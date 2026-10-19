import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import vectors from "#tests/vectors/waitlistCommitment.json" with { type: "json" };
import { buildInclusionProof } from "../functions/buildInclusionProof.function.ts";

describe("Using buildInclusionProof, when given the shared cross-implementation vectors", () => {
    test("then it should produce the expected proof", async () => {
        const proof = await buildInclusionProof(vectors.leaves, vectors.inclusionProof.publicDrawId);
        assert.deepEqual(proof, vectors.inclusionProof.steps);
    });
});

describe("Using buildInclusionProof, when no leaf has the public draw id", () => {
    test("then it should return null", async () => {
        assert.equal(await buildInclusionProof(vectors.leaves, deterministicBytes32Hex("absent")), null);
    });
});
