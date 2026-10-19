import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { committedPublicDrawIdThroughRecoveries } from "../functions/committedPublicDrawIdThroughRecoveries.function.ts";

const committed = deterministicBytes32Hex("committed");
const middle = deterministicBytes32Hex("middle");
const latest = deterministicBytes32Hex("latest");
const recover = (from: Bytes32Hex, to: Bytes32Hex) => ({ replacedPublicDrawId: from, replacementPublicDrawId: to });
const twoRecoveries = [recover(committed, middle), recover(middle, latest)];

describe("Using committedPublicDrawIdThroughRecoveries, after two recoveries since the commitment", () => {
    test("then the latest code should lead back to the committed id", () => {
        assert.equal(committedPublicDrawIdThroughRecoveries(latest, twoRecoveries), committed);
    });

    test("then a code replaced along the way should be refused", () => {
        assert.equal(committedPublicDrawIdThroughRecoveries(middle, twoRecoveries), "replaced");
    });
});

describe("Using committedPublicDrawIdThroughRecoveries, when hostile data forms a cycle", () => {
    test("then it should stop rather than loop forever", () => {
        assert.equal(
            committedPublicDrawIdThroughRecoveries(committed, [recover(middle, latest), recover(latest, middle)]),
            committed,
        );
    });
});
