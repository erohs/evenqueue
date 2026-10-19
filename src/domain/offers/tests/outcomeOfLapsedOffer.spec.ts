import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { createServiceGap } from "#domain/schedule/functions/createServiceGap.function.ts";
import { windowClose } from "#domain/schedule/functions/windowClose.function.ts";
import type { IServiceGap } from "#domain/schedule/interfaces/IServiceGap.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { toDurationMilliseconds } from "#domain/shared/time/functions/toDurationMilliseconds.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import type { IOffer } from "../interfaces/IOffer.ts";
import { outcomeOfLapsedOffer } from "../functions/outcomeOfLapsedOffer.function.ts";

const offerWindow = toDurationMilliseconds(100);
const offeredAt = toEpochMilliseconds(0);
const gap = (startsAt: number, endsAt: number) =>
    createServiceGap(toEpochMilliseconds(startsAt), toEpochMilliseconds(endsAt));
const offerAfter = (gaps: readonly IServiceGap[]): IOffer => ({
    unitNumber: toCount(1),
    placeId: deterministicBytes32Hex("place"),
    offeredAt,
    expiresAt: windowClose(offeredAt, offerWindow, gaps).closesAt,
    offerRound: toCount(1),
});

describe("Using outcomeOfLapsedOffer, when the service stayed up for the whole window", () => {
    test("then it should count the lapse against the buyer", () => {
        assert.equal(outcomeOfLapsedOffer(offerAfter([]), offerWindow, []), "offer-not-taken");
    });
});

describe("Using outcomeOfLapsedOffer, when a short outage was fully made up", () => {
    test("then it should still count the lapse against the buyer", () => {
        const gaps = [gap(10, 40)];
        assert.equal(outcomeOfLapsedOffer(offerAfter(gaps), offerWindow, gaps), "offer-not-taken");
    });
});

describe("Using outcomeOfLapsedOffer, when the vendor was down longer than the window could stretch", () => {
    test("then it should count the offer as withdrawn, not the buyer's fault", () => {
        const gaps = [gap(10, 500)];
        assert.equal(outcomeOfLapsedOffer(offerAfter(gaps), offerWindow, gaps), "offer-withdrawn");
    });
});
