import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createSeededRandom } from "#tests/support/functions/createSeededRandom.function.ts";
import { dropForTests } from "#tests/support/functions/dropForTests.function.ts";
import { randomWholeNumber } from "#tests/support/functions/randomWholeNumber.function.ts";
import { decideSettingsChange } from "#domain/drops/functions/decideSettingsChange.function.ts";
import { settingsInForceAt } from "#domain/drops/functions/settingsInForceAt.function.ts";
import type { IDrop } from "#domain/drops/interfaces/IDrop.ts";
import type { IDropSettings } from "#domain/drops/interfaces/IDropSettings.ts";
import type { DropState } from "#domain/drops/types/DropState.type.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

const random = createSeededRandom(21);
const hour = 3_600_000;
const publicStates: readonly DropState[] = ["open", "closed", "committed", "drawing", "offering"];

const randomProposal = (current: IDropSettings): IDropSettings => {
    const offerHours = randomWholeNumber(random, 12, 120);
    const sometimes = <T>(value: T, fallback: T): T => (random() < 0.4 ? value : fallback);
    return {
        ...current,
        unitCount: sometimes(toCount(randomWholeNumber(random, 1, 50)), current.unitCount),
        entrantCap: sometimes(toCount(randomWholeNumber(random, 1, 50_000)), current.entrantCap),
        entryWindow: sometimes(durationOfHours(randomWholeNumber(random, 24, 336)), current.entryWindow),
        offerWindow: sometimes(durationOfHours(offerHours), current.offerWindow),
        checkpointInterval: sometimes(durationOfHours(randomWholeNumber(random, 1, 12)), current.checkpointInterval),
        pageText: sometimes(`Restock ${randomWholeNumber(random, 1, 9)}`, current.pageText),
    };
};

/** Twenty random submissions to a drop that is already public, with the clock moving on between them. */
const runRandomSubmissions = (): readonly IDrop[] => {
    let now: EpochMilliseconds = toEpochMilliseconds(1_760_000_000_000);
    let drop = dropForTests(publicStates[randomWholeNumber(random, 0, publicStates.length - 1)] ?? "open");
    const history = [drop];
    for (let submission = 0; submission < 20; submission++) {
        now = toEpochMilliseconds(now + randomWholeNumber(random, 0, 36 * hour));
        drop = settingsInForceAt(drop, now);
        const decision = decideSettingsChange(drop, randomProposal(drop.settings), now);
        if (decision.isAccepted) drop = decision.drop;
        history.push(drop);
    }
    return history;
};
const histories = Array.from({ length: 500 }, runRandomSubmissions);

describe("Using decideSettingsChange, for 500 public drops each given 20 random submissions", () => {
    test("then the entrant cap and entry window should never change", () => {
        const first = dropForTests("open").settings;
        const isUnchanged = (drop: IDrop): boolean =>
            drop.settings.entrantCap === first.entrantCap && drop.settings.entryWindow === first.entryWindow;
        assert.ok(histories.every((history) => history.every(isUnchanged)));
    });

    test("then the offer window in force should never get shorter", () => {
        const neverShrinks = (history: readonly IDrop[]): boolean =>
            history.every(
                (drop, i) => i === 0 || drop.settings.offerWindow >= (history[i - 1]?.settings.offerWindow ?? 0),
            );
        assert.ok(histories.every(neverShrinks));
    });

    test("then every pending notice should run for at least a day", () => {
        const noticesRunADay = (drop: IDrop): boolean =>
            drop.settingsNotice === null ||
            drop.settingsNotice.takesEffectAt - drop.settingsNotice.givenAt >= 24 * hour;
        assert.ok(histories.every((history) => history.every(noticesRunADay)));
    });
});

describe("Using decideSettingsChange, for the same random submissions, when a notice runs out", () => {
    test("then the longer offer window should take effect, in over a tenth of the drops", () => {
        const first = dropForTests("open").settings.offerWindow;
        const grown = histories.filter((history) => history.some((drop) => drop.settings.offerWindow > first));
        assert.ok(grown.length > 50, `${grown.length} grew`);
    });
});
