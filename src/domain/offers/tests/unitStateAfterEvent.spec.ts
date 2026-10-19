import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { unitTransitions } from "../consts/unitTransitions.const.ts";
import { unitStateAfterEvent } from "../functions/unitStateAfterEvent.function.ts";
import type { UnitEvent } from "../types/UnitEvent.type.ts";
import type { UnitState } from "../types/UnitState.type.ts";

const everyState: readonly UnitState[] = ["free", "offered", "pending", "sold", "held", "retired", "withdrawn"];
const everyEvent = Object.keys(unitTransitions) as UnitEvent[];

describe("Using unitStateAfterEvent, when a unit goes through a whole sale", () => {
    test("then it should move from free to offered, pending and sold", () => {
        const events: UnitEvent[] = ["offer-made", "offer-claimed", "payment-accepted"];
        assert.equal(events.reduce(unitStateAfterEvent, "free"), "sold");
    });
});

describe("Using unitStateAfterEvent, when an offer lapses before or after it is claimed", () => {
    test("then it should free the unit", () => {
        assert.equal(unitStateAfterEvent("offered", "offer-expired"), "free");
        assert.equal(unitStateAfterEvent("pending", "offer-expired"), "free");
        assert.equal(unitStateAfterEvent("pending", "claim-cancelled"), "free");
    });
});

describe("Using unitStateAfterEvent, when any event reaches a sold unit", () => {
    test("then it should refuse it, so a sale is never clawed back", () => {
        for (const event of everyEvent) assert.throws(() => unitStateAfterEvent("sold", event), RangeError);
    });
});

describe("Using unitStateAfterEvent, when an event does not fit the unit's state", () => {
    test("then it should throw for every pair outside the table", () => {
        for (const event of everyEvent) {
            for (const state of everyState) {
                if (unitTransitions[event].from.includes(state)) continue;
                assert.throws(() => unitStateAfterEvent(state, event), RangeError);
            }
        }
    });
});
