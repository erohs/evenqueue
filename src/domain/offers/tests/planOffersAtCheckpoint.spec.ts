import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { ICheckpointOfferInput } from "../interfaces/ICheckpointOfferInput.ts";
import { planOffersAtCheckpoint } from "../functions/planOffersAtCheckpoint.function.ts";

const placeIds: readonly Bytes32Hex[] = ["a", "b", "c", "d", "e"].map((name) => deterministicBytes32Hex(name));

const checkpointInput = (overrides: Partial<ICheckpointOfferInput>): ICheckpointOfferInput => ({
    unitsAwaitingOffer: [],
    placeIdsInDrawOrder: placeIds,
    placeIdsAlreadyOffered: new Set(),
    checkpointAt: 1_000,
    offerWindow: 100,
    serviceGaps: [],
    backfillOffersPerUnit: 1,
    ...overrides,
});

describe("Using planOffersAtCheckpoint, at the draw", () => {
    test("then it should offer each unit to the next place in draw order", () => {
        const units = [
            { unitNumber: 2, offersMade: 0 },
            { unitNumber: 1, offersMade: 0 },
        ];
        const offers = planOffersAtCheckpoint(checkpointInput({ unitsAwaitingOffer: units }));
        assert.deepEqual(
            offers.map((offer) => [offer.unitNumber, offer.placeId, offer.offerRound, offer.expiresAt]),
            [
                [1, placeIds[0], 1, 1_100],
                [2, placeIds[1], 1, 1_100],
            ],
        );
    });
});

describe("Using planOffersAtCheckpoint, when an offer lapsed and the unit is freed", () => {
    test("then it should backfill to the next place not yet offered", () => {
        const offers = planOffersAtCheckpoint(
            checkpointInput({
                unitsAwaitingOffer: [{ unitNumber: 1, offersMade: 1 }],
                placeIdsAlreadyOffered: new Set([placeIds[0], placeIds[1]] as Bytes32Hex[]),
            }),
        );
        assert.deepEqual(
            offers.map((offer) => [offer.placeId, offer.offerRound]),
            [[placeIds[2], 2]],
        );
    });
});

describe("Using planOffersAtCheckpoint, when a unit has used its backfill offer", () => {
    test("then it should leave the unit free", () => {
        const input = checkpointInput({ unitsAwaitingOffer: [{ unitNumber: 1, offersMade: 2 }] });
        assert.deepEqual(planOffersAtCheckpoint(input), []);
    });
});

describe("Using planOffersAtCheckpoint, when the line runs out before the units do", () => {
    test("then it should offer only as many units as there are places left", () => {
        const units = [1, 2, 3].map((unitNumber) => ({ unitNumber, offersMade: 0 }));
        const input = checkpointInput({ unitsAwaitingOffer: units, placeIdsInDrawOrder: placeIds.slice(0, 2) });
        assert.equal(planOffersAtCheckpoint(input).length, 2);
    });
});

describe("Using planOffersAtCheckpoint, when an outage falls inside the offer window", () => {
    test("then it should extend the offer's expiry", () => {
        const input = checkpointInput({
            unitsAwaitingOffer: [{ unitNumber: 1, offersMade: 0 }],
            serviceGaps: [{ startsAt: 1_050, endsAt: 1_080 }],
        });
        assert.equal(planOffersAtCheckpoint(input)[0]?.expiresAt, 1_130);
    });
});
