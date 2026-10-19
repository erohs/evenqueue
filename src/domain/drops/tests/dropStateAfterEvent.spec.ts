import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { dropStates } from "../consts/dropStates.const.ts";
import { dropTransitions } from "../consts/dropTransitions.const.ts";
import { dropStateAfterEvent } from "../functions/dropStateAfterEvent.function.ts";
import type { DropEvent } from "../types/DropEvent.type.ts";

const everyEvent = Object.keys(dropTransitions) as DropEvent[];

describe("Using dropStateAfterEvent, when a drop runs from draft to its last offer", () => {
    test("then it should pass through every state in order and finish", () => {
        const events: DropEvent[] = [
            "drop-opened",
            "entry-closed",
            "commitment-published",
            "draw-voided",
            "beacon-round-arrived",
            "draw-order-finished",
            "offers-finished",
        ];
        assert.equal(events.reduce(dropStateAfterEvent, "draft"), "finished");
    });
});

describe("Using dropStateAfterEvent, when a drop is cancelled before its commitment is published", () => {
    test("then it should cancel it from draft, open or closed", () => {
        for (const state of ["draft", "open", "closed"] as const) {
            assert.equal(dropStateAfterEvent(state, "drop-cancelled"), "cancelled");
        }
    });
});

describe("Using dropStateAfterEvent, when a committed drop is cancelled", () => {
    test("then it should refuse, so a vendor cannot discard an order they dislike", () => {
        for (const state of ["committed", "drawing", "offering"] as const) {
            assert.throws(() => dropStateAfterEvent(state, "drop-cancelled"), RangeError);
        }
    });
});

describe("Using dropStateAfterEvent, when an event does not fit the drop's state", () => {
    test("then it should throw for every pair outside the table", () => {
        for (const event of everyEvent) {
            for (const state of dropStates) {
                if (dropTransitions[event].from.includes(state)) continue;
                assert.throws(() => dropStateAfterEvent(state, event), RangeError);
            }
        }
    });
});
