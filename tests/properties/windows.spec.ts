import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createSeededRandom } from "#tests/support/functions/createSeededRandom.function.ts";
import { randomWholeNumber } from "#tests/support/functions/randomWholeNumber.function.ts";
import { createServiceGap } from "#domain/schedule/functions/createServiceGap.function.ts";
import { windowClose } from "#domain/schedule/functions/windowClose.function.ts";
import type { IServiceGap } from "#domain/schedule/interfaces/IServiceGap.ts";
import { toDurationMilliseconds } from "#domain/shared/time/functions/toDurationMilliseconds.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";

const random = createSeededRandom(4);
const opensAt = toEpochMilliseconds(1_760_000_000_000);
const hour = 3_600_000;

const randomGaps = (count: number): IServiceGap[] =>
    Array.from({ length: count }, () => {
        const startsAt = opensAt + randomWholeNumber(random, -10 * hour, 200 * hour);
        return createServiceGap(
            toEpochMilliseconds(startsAt),
            toEpochMilliseconds(startsAt + randomWholeNumber(random, 1, 30 * hour)),
        );
    });
const cases = Array.from({ length: 300 }, () => ({
    length: toDurationMilliseconds(randomWholeNumber(random, 1, 96) * hour + randomWholeNumber(random, 0, 999)),
    gaps: randomGaps(randomWholeNumber(random, 0, 8)),
}));

describe("Using windowClose, for 300 random windows and outages", () => {
    test("then a window should never close before its full length", () => {
        assert.ok(cases.every(({ length, gaps }) => windowClose(opensAt, length, gaps).closesAt >= opensAt + length));
    });

    test("then a window should never close after twice its length", () => {
        assert.ok(
            cases.every(({ length, gaps }) => windowClose(opensAt, length, gaps).closesAt <= opensAt + 2 * length),
        );
    });

    test("then it should say it was cut short exactly when it closed at twice its length with uptime still owed", () => {
        const isHonest = ({ length, gaps }: (typeof cases)[number]): boolean => {
            const close = windowClose(opensAt, length, gaps);
            return !close.isCutShortByOutages || close.closesAt === opensAt + 2 * length;
        };
        assert.ok(cases.every(isHonest));
    });

    test("then another outage should never make a window close earlier", () => {
        const isMonotonic = ({ length, gaps }: (typeof cases)[number]): boolean =>
            windowClose(opensAt, length, [...gaps, ...randomGaps(1)]).closesAt >=
            windowClose(opensAt, length, gaps).closesAt;
        assert.ok(cases.every(isMonotonic));
    });
});
