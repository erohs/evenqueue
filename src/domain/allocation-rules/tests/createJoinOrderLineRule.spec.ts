import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { placeIdsOfferedFirst } from "#tests/support/functions/placeIdsOfferedFirst.function.ts";
import { waitlistPlacesForTests } from "#tests/support/functions/waitlistPlacesForTests.function.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import { createJoinOrderLineRule } from "../functions/createJoinOrderLineRule.function.ts";

const rule = createJoinOrderLineRule(2);
const placeInWindow = (window: number): IWaitlistPlace =>
    createWaitlistPlace(deterministicBytes32Hex(`window-${window}`), window);

const afterUnclaimedOffers = (place: IWaitlistPlace, offers: number, currentWindow: number): IWaitlistPlace => {
    let current = place;
    for (let offer = 0; offer < offers; offer++) {
        current = rule.placeAfterDrop(current, "offer-not-taken", currentWindow) ?? assert.fail();
    }
    return current;
};

const windowAndCount = (place: IWaitlistPlace): number[] => [
    place.entryWindowNumber,
    place.offersNotTakenSinceLastMove,
];

describe("Using the join-order-line rule, when buyers joined in different entry windows", () => {
    test("then it should put the earlier window first", () => {
        assert.ok(rule.priorityOf(placeInWindow(1)) > rule.priorityOf(placeInWindow(2)));
    });
});

describe("Using the join-order-line rule, when buyers joined in the same entry window", () => {
    test("then it should let the beacon decide their order", async () => {
        const sameWindow = waitlistPlacesForTests("same-window", 6);
        const offeredFirst = new Set<string>();
        for (let draw = 0; draw < 40; draw++) {
            offeredFirst.add((await placeIdsOfferedFirst(rule, sameWindow, 1, `draw-${draw}`))[0] ?? assert.fail());
        }
        assert.ok(offeredFirst.size > 3);
    });
});

describe("Using the join-order-line rule, when a buyer does not take up offers", () => {
    test("then it should keep their place through the first unclaimed offer", () => {
        assert.deepEqual(windowAndCount(afterUnclaimedOffers(placeInWindow(1), 1, 7)), [1, 1]);
    });

    test("then it should keep their place through the second unclaimed offer", () => {
        assert.deepEqual(windowAndCount(afterUnclaimedOffers(placeInWindow(1), 2, 7)), [1, 2]);
    });

    test("then it should move their place to the back on the third", () => {
        assert.deepEqual(windowAndCount(afterUnclaimedOffers(placeInWindow(1), 3, 7)), [7, 0]);
    });
});

describe("Using the join-order-line rule, when a buyer is not offered a unit", () => {
    test("then it should keep their place and their count of unclaimed offers", () => {
        const place = { ...placeInWindow(1), offersNotTakenSinceLastMove: 1 };
        assert.deepEqual(windowAndCount(rule.placeAfterDrop(place, "not-offered", 7) ?? assert.fail()), [1, 1]);
    });
});

describe("Using the join-order-line rule, when a buyer buys", () => {
    test("then it should remove their place from the line", () => {
        assert.equal(rule.placeAfterDrop(placeInWindow(1), "bought", 1), null);
    });
});

describe("Using createJoinOrderLineRule, when the allowance is not a non-negative whole number", () => {
    test("then it should refuse a negative allowance", () => {
        assert.throws(() => createJoinOrderLineRule(-1), RangeError);
    });

    test("then it should refuse a fractional allowance", () => {
        assert.throws(() => createJoinOrderLineRule(1.5), RangeError);
    });
});
