import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { isCloseTo } from "#tests/support/functions/isCloseTo.function.ts";
import { placeIdsOfferedFirst } from "#tests/support/functions/placeIdsOfferedFirst.function.ts";
import { runDropWhereEveryOfferIsBought } from "#tests/support/functions/runDropWhereEveryOfferIsBought.function.ts";
import { shareOfDrawsWon } from "#tests/support/functions/shareOfDrawsWon.function.ts";
import { waitlistPlacesForTests } from "#tests/support/functions/waitlistPlacesForTests.function.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import { createPriorityAfterLossesRule } from "../functions/createPriorityAfterLossesRule.function.ts";

const rule = createPriorityAfterLossesRule(2);
const newPlace = (): IWaitlistPlace => createWaitlistPlace(deterministicBytes32Hex("place"), 0);

const afterDropsNotOffered = (place: IWaitlistPlace, drops: number): IWaitlistPlace => {
    let current = place;
    for (let drop = 0; drop < drops; drop++) current = rule.placeAfterDrop(current, "not-offered", 0) ?? assert.fail();
    return current;
};

describe("Using the priority-after-losses rule, when a buyer keeps missing out", () => {
    test("then it should raise their priority by one per drop, up to the highest level", () => {
        const priorities = [0, 1, 2, 3, 9].map((drops) => rule.priorityOf(afterDropsNotOffered(newPlace(), drops)));
        assert.deepEqual(priorities, [0, 1, 2, 2, 2]);
    });
});

describe("Using the priority-after-losses rule, when a buyer does not take up an offer", () => {
    test("then it should leave their priority unchanged", () => {
        const afterOneLoss = afterDropsNotOffered(newPlace(), 1);
        const afterUnclaimedOffer = rule.placeAfterDrop(afterOneLoss, "offer-not-taken", 0) ?? assert.fail();
        assert.equal(rule.priorityOf(afterUnclaimedOffer), rule.priorityOf(afterOneLoss));
    });
});

describe("Using the priority-after-losses rule, when a buyer buys", () => {
    test("then it should remove their place from the waitlist", () => {
        assert.equal(rule.placeAfterDrop(newPlace(), "bought", 0), null);
    });
});

describe("Using the priority-after-losses rule, when units are scarce", async () => {
    const waitedLonger = waitlistPlacesForTests("waited-longer", 4, { drawsEntered: 1 });
    const justJoined = waitlistPlacesForTests("just-joined", 3);
    const shares = await shareOfDrawsWon(rule, [...waitedLonger, ...justJoined], 2);

    test("then it should never offer a unit to a lower priority ahead of a higher one", () => {
        assert.ok(justJoined.every((place) => !shares.has(place.placeId)));
    });

    test("then it should share units evenly among equal priorities", () => {
        assert.ok(waitedLonger.every((place) => isCloseTo(shares.get(place.placeId) ?? 0, 0.5, 0.1)));
    });
});

describe("Using the priority-after-losses rule, when newcomers join for a later drop", () => {
    test("then it should never put them ahead of buyers who already missed out", async () => {
        for (let series = 0; series < 40; series++) {
            const early = waitlistPlacesForTests("early", 5);
            const firstDrop = await runDropWhereEveryOfferIsBought(rule, early, 2, `first-${series}`, 0);
            const newcomers = waitlistPlacesForTests("newcomer", 3);
            const waitlist = [...firstDrop.waitlistAfterDrop, ...newcomers];
            const offered = await placeIdsOfferedFirst(rule, waitlist, 2, `second-${series}`);
            assert.ok(newcomers.every((place) => !offered.includes(place.placeId)));
        }
    });
});

describe("Using the priority-after-losses rule, when every buyer offered a unit buys it", () => {
    test("then it should serve every buyer exactly once over the series", async () => {
        let waitlist = waitlistPlacesForTests("series", 6);
        const served: string[] = [];
        for (let drop = 0; drop < 3; drop++) {
            const result = await runDropWhereEveryOfferIsBought(rule, waitlist, 2, `drop-${drop}`, drop);
            served.push(...result.buyers);
            waitlist = result.waitlistAfterDrop;
        }
        assert.equal(new Set(served).size, 6);
    });
});

describe("Using createPriorityAfterLossesRule, when the highest level is not a non-negative whole number", () => {
    test("then it should refuse a negative level", () => {
        assert.throws(() => createPriorityAfterLossesRule(-1), RangeError);
    });

    test("then it should refuse a fractional level", () => {
        assert.throws(() => createPriorityAfterLossesRule(1.5), RangeError);
    });
});
