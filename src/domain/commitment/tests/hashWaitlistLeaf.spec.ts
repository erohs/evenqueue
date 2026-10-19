import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { waitlistCommitmentVectors } from "#tests/support/functions/waitlistCommitmentVectors.function.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { hashWaitlistLeaf } from "../functions/hashWaitlistLeaf.function.ts";
import { sortLeavesForCommitment } from "../functions/sortLeavesForCommitment.function.ts";

const vectors = waitlistCommitmentVectors();

describe("Using hashWaitlistLeaf, when given the shared cross-implementation vectors", () => {
    test("then it should produce every expected leaf hash, negative priorities included", async () => {
        const sorted = sortLeavesForCommitment(vectors.leaves);
        const hashes = await Promise.all(sorted.map(async (leaf) => encodeHex(await hashWaitlistLeaf(leaf))));
        assert.deepEqual(hashes, vectors.leafHashesInOrder);
    });
});
