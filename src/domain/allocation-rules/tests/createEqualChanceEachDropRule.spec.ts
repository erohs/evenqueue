import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { isCloseTo } from "#tests/support/functions/isCloseTo.function.ts";
import { shareOfDrawsWon } from "#tests/support/functions/shareOfDrawsWon.function.ts";
import { waitlistPlacesForTests } from "#tests/support/functions/waitlistPlacesForTests.function.ts";
import { createEqualChanceEachDropRule } from "../functions/createEqualChanceEachDropRule.function.ts";
import type { PlaceOutcomeInDrop } from "../types/PlaceOutcomeInDrop.type.ts";

const rule = createEqualChanceEachDropRule();
const outcomes: readonly PlaceOutcomeInDrop[] = ["bought", "not-offered", "offer-not-taken"];

describe("Using the equal-chance-each-drop rule, when some buyers have waited longer than others", async () => {
    const places = [
        ...waitlistPlacesForTests("waited-longer", 4, { drawsEntered: 5 }),
        ...waitlistPlacesForTests("just-joined", 3),
    ];
    const shares = await shareOfDrawsWon(rule, places, 2);

    test("then it should give every entrant the same chance", () => {
        assert.ok(places.every((place) => isCloseTo(shares.get(place.placeId) ?? 0, 2 / 7, 0.1)));
    });
});

describe("Using the equal-chance-each-drop rule, when a drop ends", () => {
    test("then it should remove every place, whatever its outcome", () => {
        const [place] = waitlistPlacesForTests("place", 1);
        assert.ok(place && outcomes.every((outcome) => rule.placeAfterDrop(place, outcome, 0) === null));
    });
});
