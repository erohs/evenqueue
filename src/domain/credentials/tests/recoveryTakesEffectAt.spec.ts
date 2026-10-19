import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { toRecoveryDelay } from "../functions/toRecoveryDelay.function.ts";
import { recoveryTakesEffectAt } from "../functions/recoveryTakesEffectAt.function.ts";

const hours = (count: number) => toEpochMilliseconds(count * 3_600_000);
const twelveHours = toRecoveryDelay(durationOfHours(12));

describe("Using recoveryTakesEffectAt, when the next checkpoint comes before the delay ends", () => {
    test("then it should wait for the delay", () => {
        assert.equal(recoveryTakesEffectAt(hours(0), twelveHours, hours(4)), hours(12));
    });
});

describe("Using recoveryTakesEffectAt, when the next checkpoint comes after the delay ends", () => {
    test("then it should wait for the checkpoint", () => {
        assert.equal(recoveryTakesEffectAt(hours(0), twelveHours, hours(20)), hours(20));
    });
});

describe("Using recoveryTakesEffectAt, when no drop is scheduled", () => {
    test("then it should wait for the delay alone", () => {
        assert.equal(recoveryTakesEffectAt(hours(0), twelveHours, null), hours(12));
    });
});
