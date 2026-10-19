import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { placesNeededForDraw } from "../functions/placesNeededForDraw.function.ts";

describe("Using placesNeededForDraw, with one backfill offer per unit", () => {
    test("then it should keep two places per unit", () => {
        assert.equal(placesNeededForDraw(toCount(10), toCount(1)), 20);
    });
});
