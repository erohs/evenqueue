import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { parseServiceGap } from "../functions/parseServiceGap.function.ts";

describe("Using parseServiceGap, when a stored gap is well formed", () => {
    test("then it should return it", () => {
        assert.deepEqual(parseServiceGap({ startsAt: 1, endsAt: 2 }), {
            isValid: true,
            value: { startsAt: 1, endsAt: 2 },
        });
    });
});

describe("Using parseServiceGap, when a stored gap ends before it starts", () => {
    test("then it should refuse it", () => {
        assert.deepEqual(parseServiceGap({ startsAt: 2, endsAt: 1 }), {
            isValid: false,
            problems: ["ends before it starts"],
        });
    });
});
