import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { isWithinWindow } from "../functions/isWithinWindow.function.ts";

describe("Using isWithinWindow, when checking the moment a window opens", () => {
    test("then it should be open", () => {
        assert.equal(isWithinWindow(0, 100, [], 0), true);
    });
});

describe("Using isWithinWindow, when checking the moment a window closes", () => {
    test("then it should be closed", () => {
        assert.equal(isWithinWindow(0, 100, [], 100), false);
    });
});

describe("Using isWithinWindow, when an outage extended the window", () => {
    test("then it should still be open after the original end", () => {
        assert.equal(isWithinWindow(0, 100, [{ startsAt: 50, endsAt: 80 }], 120), true);
    });
});
