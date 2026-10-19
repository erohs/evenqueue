import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { parseInclusionProof } from "../functions/parseInclusionProof.function.ts";

const step = { siblingHash: "0".repeat(64), isSiblingOnLeft: false };

describe("Using parseInclusionProof, when a hostile server sends a malformed step", () => {
    test("then it should name the step", () => {
        assert.deepEqual(parseInclusionProof([step, { siblingHash: "not hex", isSiblingOnLeft: true }]), {
            isValid: false,
            problems: ["step 1: siblingHash is missing or invalid"],
        });
    });
});

describe("Using parseInclusionProof, when a proof is longer than any real tree needs", () => {
    test("then it should refuse it before any hashing", () => {
        assert.deepEqual(parseInclusionProof(Array.from({ length: 65 }, () => step)), {
            isValid: false,
            problems: ["the proof is too long"],
        });
    });
});
