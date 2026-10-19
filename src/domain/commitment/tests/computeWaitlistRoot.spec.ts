import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { waitlistCommitmentVectors } from "#tests/support/functions/waitlistCommitmentVectors.function.ts";
import { toPriority } from "#domain/allocation-rules/functions/toPriority.function.ts";
import { computeWaitlistRoot } from "../functions/computeWaitlistRoot.function.ts";

const vectors = waitlistCommitmentVectors();

describe("Using computeWaitlistRoot, when given the shared cross-implementation vectors", () => {
    test("then it should produce the expected root", async () => {
        assert.equal(await computeWaitlistRoot(vectors.leaves), vectors.committedWaitlistRoot);
    });
});

describe("Using computeWaitlistRoot, when the same leaves arrive in another order", () => {
    test("then it should produce the same root", async () => {
        assert.equal(await computeWaitlistRoot(vectors.leaves.toReversed()), vectors.committedWaitlistRoot);
    });
});

describe("Using computeWaitlistRoot, when one place's priority changes", () => {
    test("then it should produce a different root", async () => {
        const changed = vectors.leaves.map((leaf, i) =>
            i === 0 ? { ...leaf, priority: toPriority(leaf.priority + 1) } : leaf,
        );
        assert.notEqual(await computeWaitlistRoot(changed), vectors.committedWaitlistRoot);
    });
});

describe("Using computeWaitlistRoot, when there are no leaves", () => {
    test("then it should give SHA-256 of nothing, as RFC 6962 defines the root of an empty tree", async () => {
        assert.equal(await computeWaitlistRoot([]), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    });
});
