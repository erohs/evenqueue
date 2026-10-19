import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { publishedDrawForTests } from "#tests/support/functions/publishedDrawForTests.function.ts";
import { availableAllocationRules } from "#domain/allocation-rules/consts/availableAllocationRules.const.ts";
import { derivePlaceTag } from "#domain/commitment/functions/derivePlaceTag.function.ts";
import { restorePlaceFromPublishedDraw } from "../functions/restorePlaceFromPublishedDraw.function.ts";
import { publishedRecoveryFor } from "../functions/publishedRecoveryFor.function.ts";
import type { IPublishedDrawRestoreInput } from "../interfaces/IPublishedDrawRestoreInput.ts";

const draw = await publishedDrawForTests([1, 1, 0]);
const priorityRule = availableAllocationRules["priority-after-losses"];
const buyer = (i: number) => draw.buyers[i] ?? assert.fail();

const restoreInput = (overrides: Partial<IPublishedDrawRestoreInput>): IPublishedDrawRestoreInput => ({
    entrySecret: buyer(0).entrySecret,
    drawId: draw.drawId,
    publishedLeaves: draw.leaves,
    recoveriesSinceCommit: [],
    hasDrawRun: false,
    offeredPublicDrawIds: new Set(),
    rule: priorityRule,
    newPlaceId: deterministicBytes32Hex("new-place"),
    ...overrides,
});
const restoredPriority = async (overrides: Partial<IPublishedDrawRestoreInput>): Promise<number | string> => {
    const result = await restorePlaceFromPublishedDraw(restoreInput(overrides));
    return result.status === "restored" ? priorityRule.priorityOf(result.place) : result.status;
};

describe("Using restorePlaceFromPublishedDraw, when the database is lost before the draw runs", () => {
    test("then it should restore the place with exactly its committed priority", async () => {
        assert.equal(await restoredPriority({}), 1);
    });
});

describe("Using restorePlaceFromPublishedDraw, when the draw ran and the buyer missed out", () => {
    test("then it should restore the place one step up, as the draw left it", async () => {
        assert.equal(await restoredPriority({ hasDrawRun: true }), 2);
    });
});

describe("Using restorePlaceFromPublishedDraw, when the buyer was offered a unit in that draw", () => {
    test("then it should hold the place for the vendor to check against their sales", async () => {
        const offered = new Set([draw.leaves[0]?.publicDrawId ?? assert.fail()]);
        assert.equal(
            await restoredPriority({ hasDrawRun: true, offeredPublicDrawIds: offered }),
            "needs-vendor-review",
        );
    });
});

const recoveriesAfterSwap = [
    await publishedRecoveryFor(
        await derivePlaceTag(buyer(0).viewKey),
        await derivePlaceTag(buyer(2).viewKey),
        draw.drawId,
    ),
];
const afterSwap = (entrySecret: Uint8Array<ArrayBuffer>): Partial<IPublishedDrawRestoreInput> => ({
    entrySecret,
    publishedLeaves: draw.leaves.filter((_, i) => i !== 2),
    recoveriesSinceCommit: recoveriesAfterSwap,
});

describe("Using restorePlaceFromPublishedDraw, when a recovery replaced the codes after the commitment", () => {
    test("then the new code should restore the place committed under the old one", async () => {
        assert.equal(await restoredPriority(afterSwap(buyer(2).entrySecret)), 1);
    });

    test("then the replaced code should be refused", async () => {
        assert.equal(await restoredPriority(afterSwap(buyer(0).entrySecret)), "code-replaced");
    });
});

describe("Using restorePlaceFromPublishedDraw, when the code was not in the draw", () => {
    test("then it should restore nothing", async () => {
        assert.equal(await restoredPriority({ entrySecret: new Uint8Array(16).fill(7) }), "not-in-draw");
    });
});

describe("Using restorePlaceFromPublishedDraw, when someone holds only the buyer's view key", () => {
    test("then it should not match, so a helper cannot take the place", async () => {
        assert.equal(await restoredPriority({ entrySecret: buyer(0).viewKey }), "not-in-draw");
    });
});

describe("Using restorePlaceFromPublishedDraw, under a rule that keeps no places once the draw has run", () => {
    test("then it should restore nothing", async () => {
        const rule = availableAllocationRules["equal-chance-each-drop"];
        assert.equal(await restoredPriority({ rule, hasDrawRun: true }), "not-kept");
    });
});
