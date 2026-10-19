import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { publishedDrawForTests } from "#tests/support/functions/publishedDrawForTests.function.ts";
import { findOwnLeafInPublishedDraw } from "../functions/findOwnLeafInPublishedDraw.function.ts";

const draw = await publishedDrawForTests([2, 1, 0]);

describe("Using findOwnLeafInPublishedDraw, when each buyer looks for themselves", () => {
    test("then it should find each buyer's own leaf", async () => {
        const found = await Promise.all(
            draw.buyers.map((buyer) => findOwnLeafInPublishedDraw(buyer.entrySecret, draw.drawId, draw.leaves)),
        );
        assert.deepEqual(found, draw.leaves);
    });
});

describe("Using findOwnLeafInPublishedDraw, when the buyer looks in a different draw", () => {
    test("then it should find nothing, because public ids change every draw", async () => {
        const entrySecret = draw.buyers[0]?.entrySecret ?? assert.fail();
        const otherDraw = deterministicBytes32Hex("another-draw");
        assert.equal(await findOwnLeafInPublishedDraw(entrySecret, otherDraw, draw.leaves), null);
    });
});
