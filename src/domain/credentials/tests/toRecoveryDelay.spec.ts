import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import { toRecoveryDelay } from "../functions/toRecoveryDelay.function.ts";

describe("Using toRecoveryDelay, when a vendor sets a delay under six hours", () => {
    test("then it should refuse it", () => {
        assert.throws(() => toRecoveryDelay(durationOfHours(5)), RangeError);
    });
});
