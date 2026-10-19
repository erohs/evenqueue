import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { waitlistCommitmentVectors } from "#tests/support/functions/waitlistCommitmentVectors.function.ts";
import { buildInclusionProof } from "../functions/buildInclusionProof.function.ts";

const vectors = waitlistCommitmentVectors();

describe("Using buildInclusionProof, when given the shared cross-implementation vectors", () => {
    test("then it should produce the expected proof", async () => {
        assert.deepEqual(
            await buildInclusionProof(vectors.leaves, vectors.inclusionProof.publicDrawId),
            vectors.inclusionProof.steps,
        );
    });
});

describe("Using buildInclusionProof, when no leaf has the public draw id", () => {
    test("then it should return null", async () => {
        assert.equal(await buildInclusionProof(vectors.leaves, deterministicBytes32Hex("absent")), null);
    });
});
