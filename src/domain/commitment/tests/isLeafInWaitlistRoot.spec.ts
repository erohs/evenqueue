import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { waitlistCommitmentVectors } from "#tests/support/functions/waitlistCommitmentVectors.function.ts";
import { toPriority } from "#domain/allocation-rules/functions/toPriority.function.ts";
import { isLeafInWaitlistRoot } from "../functions/isLeafInWaitlistRoot.function.ts";

const vectors = waitlistCommitmentVectors();
const { publicDrawId, steps } = vectors.inclusionProof;
const leaf = vectors.leaves.find((candidate) => candidate.publicDrawId === publicDrawId) ?? assert.fail();

describe("Using isLeafInWaitlistRoot, when given a buyer's leaf and proof from the shared vectors", () => {
    test("then it should confirm the place was committed", async () => {
        assert.equal(await isLeafInWaitlistRoot(leaf, steps, vectors.committedWaitlistRoot), true);
    });
});

describe("Using isLeafInWaitlistRoot, when the leaf claims a higher priority than was committed", () => {
    test("then it should reject it", async () => {
        const promoted = { ...leaf, priority: toPriority(leaf.priority + 1) };
        assert.equal(await isLeafInWaitlistRoot(promoted, steps, vectors.committedWaitlistRoot), false);
    });
});

describe("Using isLeafInWaitlistRoot, when a step of the proof is swapped to the other side", () => {
    test("then it should reject it", async () => {
        const flipped = steps.map((step, i) => (i === 0 ? { ...step, isSiblingOnLeft: !step.isSiblingOnLeft } : step));
        assert.equal(await isLeafInWaitlistRoot(leaf, flipped, vectors.committedWaitlistRoot), false);
    });
});
