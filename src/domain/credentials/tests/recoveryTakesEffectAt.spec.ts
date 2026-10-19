import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { millisecondsPerHour } from "#domain/shared/time/consts/millisecondsPerHour.const.ts";
import { recoveryTakesEffectAt } from "../functions/recoveryTakesEffectAt.function.ts";

const hour = millisecondsPerHour;

describe("Using recoveryTakesEffectAt, when the next checkpoint comes before the delay ends", () => {
    test("then it should wait for the delay", () => {
        assert.equal(recoveryTakesEffectAt(0, 12 * hour, 4 * hour), 12 * hour);
    });
});

describe("Using recoveryTakesEffectAt, when the next checkpoint comes after the delay ends", () => {
    test("then it should wait for the checkpoint", () => {
        assert.equal(recoveryTakesEffectAt(0, 12 * hour, 20 * hour), 20 * hour);
    });
});

describe("Using recoveryTakesEffectAt, when no drop is scheduled", () => {
    test("then it should wait for the delay alone", () => {
        assert.equal(recoveryTakesEffectAt(0, 12 * hour, null), 12 * hour);
    });
});

describe("Using recoveryTakesEffectAt, when the vendor sets a delay under six hours", () => {
    test("then it should refuse it", () => {
        assert.throws(() => recoveryTakesEffectAt(0, 5 * hour, null), RangeError);
    });
});
