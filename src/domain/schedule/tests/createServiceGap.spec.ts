import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { createServiceGap } from "../functions/createServiceGap.function.ts";

describe("Using createServiceGap, when the gap ends before it starts", () => {
    test("then it should refuse it", () => {
        assert.throws(() => createServiceGap(toEpochMilliseconds(10), toEpochMilliseconds(5)), RangeError);
    });
});
