import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toDurationMilliseconds } from "#domain/shared/time/functions/toDurationMilliseconds.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { createServiceGap } from "../functions/createServiceGap.function.ts";
import { windowClose } from "../functions/windowClose.function.ts";

const at = toEpochMilliseconds;
const length = toDurationMilliseconds(100);
const gap = (startsAt: number, endsAt: number) => createServiceGap(at(startsAt), at(endsAt));

describe("Using windowClose, when the service stays up", () => {
    test("then it should close after the window's length", () => {
        assert.deepEqual(windowClose(at(1_000), length, []), { closesAt: 1_100, isCutShortByOutages: false });
    });
});

describe("Using windowClose, when an outage falls inside the window", () => {
    test("then it should extend the window by the outage's length", () => {
        assert.equal(windowClose(at(0), length, [gap(40, 70)]).closesAt, 130);
    });
});

describe("Using windowClose, when outages fall before the window or after it closes", () => {
    test("then it should not extend the window", () => {
        assert.equal(windowClose(at(0), length, [gap(-50, -10), gap(200, 300)]).closesAt, 100);
    });
});

describe("Using windowClose, when the window opens during an outage", () => {
    test("then it should start counting once the service is back", () => {
        assert.equal(windowClose(at(0), length, [gap(-20, 30)]).closesAt, 130);
    });
});

describe("Using windowClose, when outages add up to more than the window's length", () => {
    test("then it should close at double the length and say it was cut short", () => {
        assert.deepEqual(windowClose(at(0), length, [gap(10, 500)]), { closesAt: 200, isCutShortByOutages: true });
    });
});
