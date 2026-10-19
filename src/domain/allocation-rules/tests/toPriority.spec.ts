import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toPriority } from "../functions/toPriority.function.ts";

describe("Using toPriority, when given negative zero", () => {
    test("then it should give plain zero, so every priority has one spelling", () => {
        assert.ok(Object.is(toPriority(-0), 0));
    });
});

describe("Using toPriority, when the value does not fit in 32 signed bits", () => {
    test("then it should refuse it", () => {
        assert.throws(() => toPriority(2 ** 31), RangeError);
    });
});
