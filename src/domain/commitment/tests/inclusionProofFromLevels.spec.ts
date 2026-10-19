import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { waitlistCommitmentVectors } from "#tests/support/functions/waitlistCommitmentVectors.function.ts";
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { buildMerkleTree } from "../functions/buildMerkleTree.function.ts";
import { inclusionProofFromLevels } from "../functions/inclusionProofFromLevels.function.ts";
import { sortLeavesForCommitment } from "../functions/sortLeavesForCommitment.function.ts";

const vectors = waitlistCommitmentVectors();
const tree = await buildMerkleTree(vectors.leafHashesInOrder.map(decodeHex));
const position = sortLeavesForCommitment(vectors.leaves).findIndex(
    (leaf) => leaf.publicDrawId === vectors.inclusionProof.publicDrawId,
);

describe("Using inclusionProofFromLevels, with levels stored at close", () => {
    test("then it should give the shared vector proof without rebuilding the tree", () => {
        assert.deepEqual(inclusionProofFromLevels(tree.levels, position), vectors.inclusionProof.steps);
    });
});
