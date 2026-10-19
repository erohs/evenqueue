import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { windowClosesAt } from "../functions/windowClosesAt.function.ts";

describe("Using windowClosesAt, when the service stays up", () => {
    test("then it should close after the window's length", () => {
        assert.equal(windowClosesAt(1_000, 100, []), 1_100);
    });
});

describe("Using windowClosesAt, when an outage falls inside the window", () => {
    test("then it should extend the window by the outage's length", () => {
        assert.equal(windowClosesAt(0, 100, [{ startsAt: 40, endsAt: 70 }]), 130);
    });
});

describe("Using windowClosesAt, when outages fall before the window or after it closes", () => {
    test("then it should not extend the window", () => {
        const gaps = [
            { startsAt: -50, endsAt: -10 },
            { startsAt: 200, endsAt: 300 },
        ];
        assert.equal(windowClosesAt(0, 100, gaps), 100);
    });
});

describe("Using windowClosesAt, when the window opens during an outage", () => {
    test("then it should start counting once the service is back", () => {
        assert.equal(windowClosesAt(0, 100, [{ startsAt: -20, endsAt: 30 }]), 130);
    });
});

describe("Using windowClosesAt, when outages add up to more than the window's length", () => {
    test("then it should stop extending at double the length", () => {
        assert.equal(windowClosesAt(0, 100, [{ startsAt: 10, endsAt: 500 }]), 200);
    });
});
