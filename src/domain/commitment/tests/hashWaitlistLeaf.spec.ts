import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/waitlistCommitment.json" with { type: "json" };
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { hashWaitlistLeaf } from "../functions/hashWaitlistLeaf.function.ts";

describe("Using hashWaitlistLeaf, when given the shared cross-implementation vectors", () => {
    test("then it should produce every expected leaf hash, negative priorities included", async () => {
        const sorted = vectors.leaves.toSorted((first, second) => (first.publicDrawId < second.publicDrawId ? -1 : 1));
        const hashes = await Promise.all(sorted.map(async (leaf) => encodeHex(await hashWaitlistLeaf(leaf))));
        assert.deepEqual(hashes, vectors.leafHashesInOrder);
    });
});

describe("Using hashWaitlistLeaf, when the priority does not fit in 32 signed bits", () => {
    test("then it should refuse it", async () => {
        const leaf = vectors.leaves[0] ?? assert.fail();
        await assert.rejects(hashWaitlistLeaf({ ...leaf, priority: 2 ** 31 }), RangeError);
    });
});
