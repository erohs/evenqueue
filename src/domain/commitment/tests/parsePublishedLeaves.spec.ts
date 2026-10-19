import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { parsePublishedLeaves } from "../functions/parsePublishedLeaves.function.ts";

const leaf = { publicDrawId: "0".repeat(64), priority: 1 };

describe("Using parsePublishedLeaves, when two downloaded leaves share a public draw id", () => {
    test("then it should refuse the list", () => {
        assert.deepEqual(parsePublishedLeaves([leaf, leaf]), {
            isValid: false,
            problems: ["two leaves share a public draw id"],
        });
    });
});

describe("Using parsePublishedLeaves, when a priority does not fit in 32 signed bits", () => {
    test("then it should name the leaf", () => {
        assert.deepEqual(parsePublishedLeaves([{ ...leaf, priority: 2 ** 40 }]), {
            isValid: false,
            problems: ["leaf 0: priority is missing or invalid"],
        });
    });
});
