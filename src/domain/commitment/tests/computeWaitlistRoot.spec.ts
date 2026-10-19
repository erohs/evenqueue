import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/waitlistCommitment.json" with { type: "json" };
import { computeWaitlistRoot } from "../functions/computeWaitlistRoot.function.ts";

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
        const changed = vectors.leaves.map((leaf, i) => (i === 0 ? { ...leaf, priority: leaf.priority + 1 } : leaf));
        assert.notEqual(await computeWaitlistRoot(changed), vectors.committedWaitlistRoot);
    });
});

describe("Using computeWaitlistRoot, when two leaves share a public draw id", () => {
    test("then it should refuse them", async () => {
        const leaf = vectors.leaves[0] ?? assert.fail();
        await assert.rejects(computeWaitlistRoot([leaf, leaf]), RangeError);
    });
});

describe("Using computeWaitlistRoot, when there are no leaves", () => {
    test("then it should refuse to commit an empty waitlist", async () => {
        await assert.rejects(computeWaitlistRoot([]), RangeError);
    });
});
