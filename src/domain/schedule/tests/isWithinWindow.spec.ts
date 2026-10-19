import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toDurationMilliseconds } from "#domain/shared/time/functions/toDurationMilliseconds.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { createServiceGap } from "../functions/createServiceGap.function.ts";
import { isWithinWindow } from "../functions/isWithinWindow.function.ts";

const at = toEpochMilliseconds;
const length = toDurationMilliseconds(100);

describe("Using isWithinWindow, when checking the moment a window opens", () => {
    test("then it should be open", () => {
        assert.equal(isWithinWindow(at(0), length, [], at(0)), true);
    });
});

describe("Using isWithinWindow, when checking the moment a window closes", () => {
    test("then it should be closed", () => {
        assert.equal(isWithinWindow(at(0), length, [], at(100)), false);
    });
});

describe("Using isWithinWindow, when an outage extended the window", () => {
    test("then it should still be open after the original end", () => {
        assert.equal(isWithinWindow(at(0), length, [createServiceGap(at(50), at(80))], at(120)), true);
    });
});
