import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { createServiceGap } from "#domain/schedule/functions/createServiceGap.function.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { toDurationMilliseconds } from "#domain/shared/time/functions/toDurationMilliseconds.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import type { ICheckpointOfferInput } from "../interfaces/ICheckpointOfferInput.ts";
import { planOffersAtCheckpoint } from "../functions/planOffersAtCheckpoint.function.ts";

const placeIds = ["a", "b", "c", "d", "e"].map((name) => deterministicBytes32Hex(name));
const units = (...offersMade: number[]) => new Map(offersMade.map((made, i) => [toCount(i + 1), toCount(made)]));

const checkpointInput = (overrides: Partial<ICheckpointOfferInput>): ICheckpointOfferInput => ({
    offersMadeByUnitNumber: new Map(),
    placeIdsInDrawOrder: new Set(placeIds),
    placeIdsAlreadyOffered: new Set(),
    checkpointAt: toEpochMilliseconds(1_000),
    offerWindow: toDurationMilliseconds(100),
    serviceGaps: [],
    backfillOffersPerUnit: toCount(1),
    ...overrides,
});

describe("Using planOffersAtCheckpoint, at the draw", () => {
    test("then it should offer each unit to the next place in draw order", () => {
        const offers = planOffersAtCheckpoint(checkpointInput({ offersMadeByUnitNumber: units(0, 0) }));
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
        const alreadyOffered = new Set(placeIds.slice(0, 2));
        const offers = planOffersAtCheckpoint(
            checkpointInput({ offersMadeByUnitNumber: units(1), placeIdsAlreadyOffered: alreadyOffered }),
        );
        assert.deepEqual(
            offers.map((offer) => [offer.placeId, offer.offerRound]),
            [[placeIds[2], 2]],
        );
    });
});

describe("Using planOffersAtCheckpoint, when a unit has used its backfill offer", () => {
    test("then it should leave the unit free", () => {
        assert.deepEqual(planOffersAtCheckpoint(checkpointInput({ offersMadeByUnitNumber: units(2) })), []);
    });
});

describe("Using planOffersAtCheckpoint, when the line runs out before the units do", () => {
    test("then it should offer only as many units as there are places left", () => {
        const input = checkpointInput({
            offersMadeByUnitNumber: units(0, 0, 0),
            placeIdsInDrawOrder: new Set(placeIds.slice(0, 2)),
        });
        assert.equal(planOffersAtCheckpoint(input).length, 2);
    });
});

describe("Using planOffersAtCheckpoint, when an outage falls inside the offer window", () => {
    test("then it should extend the offer's expiry", () => {
        const serviceGaps = [createServiceGap(toEpochMilliseconds(1_050), toEpochMilliseconds(1_080))];
        const input = checkpointInput({ offersMadeByUnitNumber: units(0), serviceGaps });
        assert.equal(planOffersAtCheckpoint(input)[0]?.expiresAt, 1_130);
    });
});
