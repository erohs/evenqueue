import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createSeededRandom } from "#tests/support/functions/createSeededRandom.function.ts";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { randomWholeNumber } from "#tests/support/functions/randomWholeNumber.function.ts";
import { planOffersAtCheckpoint } from "#domain/offers/functions/planOffersAtCheckpoint.function.ts";
import type { ICheckpointOfferInput } from "#domain/offers/interfaces/ICheckpointOfferInput.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { toDurationMilliseconds } from "#domain/shared/time/functions/toDurationMilliseconds.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";

const random = createSeededRandom(5);

const randomCheckpoint = (): ICheckpointOfferInput => {
    const placeIds = Array.from({ length: randomWholeNumber(random, 0, 30) }, (_, i) =>
        deterministicBytes32Hex(`p${i}`),
    );
    const unitCount = randomWholeNumber(random, 0, 20);
    return {
        offersMadeByUnitNumber: new Map(
            Array.from({ length: unitCount }, (_, i) => [toCount(i), toCount(randomWholeNumber(random, 0, 3))]),
        ),
        placeIdsInDrawOrder: new Set(placeIds),
        placeIdsAlreadyOffered: new Set(placeIds.filter(() => random() < 0.3)),
        checkpointAt: toEpochMilliseconds(1_760_000_000_000),
        offerWindow: toDurationMilliseconds(3_600_000),
        serviceGaps: [],
        backfillOffersPerUnit: toCount(randomWholeNumber(random, 0, 2)),
    };
};
const offersAt = Array.from({ length: 500 }, randomCheckpoint).map((input) => ({
    input,
    offers: planOffersAtCheckpoint(input),
}));

describe("Using planOffersAtCheckpoint, for 500 random checkpoints", () => {
    test("then no place should ever be offered two units, or a unit while holding an earlier offer", () => {
        for (const { input, offers } of offersAt) {
            const placeIds = offers.map((offer) => offer.placeId);
            assert.equal(new Set(placeIds).size, placeIds.length);
            assert.ok(placeIds.every((placeId) => !input.placeIdsAlreadyOffered.has(placeId)));
        }
    });

    test("then no unit should ever be offered twice, or more often than its backfill allows", () => {
        for (const { input, offers } of offersAt) {
            assert.equal(new Set(offers.map((offer) => offer.unitNumber)).size, offers.length);
            assert.ok(offers.every((offer) => offer.offerRound <= 1 + input.backfillOffersPerUnit));
        }
    });

    test("then places should be offered strictly in draw order", () => {
        for (const { input, offers } of offersAt) {
            const order = [...input.placeIdsInDrawOrder];
            const positions = offers.map((offer) => order.indexOf(offer.placeId));
            assert.deepEqual(
                positions,
                positions.toSorted((first, second) => first - second),
            );
        }
    });
});
