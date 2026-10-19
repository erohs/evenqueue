import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { dropForTests } from "#tests/support/functions/dropForTests.function.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { decideSettingsChange } from "../functions/decideSettingsChange.function.ts";
import type { IDrop } from "../interfaces/IDrop.ts";
import type { IDropSettings } from "../interfaces/IDropSettings.ts";
import type { SettingsChangeDecision } from "../types/SettingsChangeDecision.type.ts";

const now = toEpochMilliseconds(1_760_100_000_000);
const dayLater = toEpochMilliseconds(now + 24 * 3_600_000);
const decide = (drop: IDrop, change: Partial<IDropSettings>): SettingsChangeDecision =>
    decideSettingsChange(drop, { ...drop.settings, ...change }, now);
const accepted = (decision: SettingsChangeDecision): Extract<SettingsChangeDecision, { isAccepted: true }> =>
    decision.isAccepted ? decision : assert.fail(decision.refusals.join("; "));
const longerOfferWindow = { offerWindow: durationOfHours(96) };

describe("Using decideSettingsChange, when a draft changes every kind of setting", () => {
    test("then it should apply them all at once and keep them private", () => {
        const decision = accepted(decide(dropForTests("draft"), { entrantCap: toCount(10), pageText: "Hi" }));
        assert.deepEqual(decision.changes, [
            { settingName: "entrantCap", takesEffectAt: now, record: "private-audit" },
            { settingName: "pageText", takesEffectAt: now, record: "private-audit" },
        ]);
    });
});

describe("Using decideSettingsChange, when an open drop changes a setting buyers joined on", () => {
    test("then it should refuse the whole submission", () => {
        assert.deepEqual(decide(dropForTests("open"), { entryWindow: durationOfHours(96), pageText: "Hi" }), {
            isAccepted: false,
            refusals: ["entryWindow is fixed once the drop opens"],
        });
    });
});

describe("Using decideSettingsChange, when an open drop shortens the offer window", () => {
    test("then it should refuse", () => {
        assert.equal(decide(dropForTests("open"), { offerWindow: durationOfHours(48) }).isAccepted, false);
    });
});

describe("Using decideSettingsChange, when an open drop lengthens the offer window", () => {
    const decision = accepted(decide(dropForTests("open"), longerOfferWindow));

    test("then it should keep the current window for now", () => {
        assert.equal(decision.drop.settings.offerWindow, durationOfHours(72));
    });

    test("then it should give a day's notice of the new window", () => {
        assert.deepEqual(decision.drop.settingsNotice, {
            givenAt: now,
            takesEffectAt: dayLater,
            changes: longerOfferWindow,
        });
    });

    test("then it should record the change publicly", () => {
        assert.equal(decision.changes[0]?.record, "public-log");
    });

    test("then it should ask the vendor to sign in again", () => {
        assert.equal(decision.isFreshSignInRequired, true);
    });
});

describe("Using decideSettingsChange, when an open drop adds units", () => {
    test("then it should apply at once and record it publicly", () => {
        const decision = accepted(decide(dropForTests("open"), { unitCount: toCount(5) }));
        assert.deepEqual(decision.changes, [{ settingName: "unitCount", takesEffectAt: now, record: "public-log" }]);
    });
});

describe("Using decideSettingsChange, when a later submission has no after-notice changes", () => {
    test("then it should leave the pending notice alone", () => {
        const noticed = accepted(decide(dropForTests("open"), longerOfferWindow)).drop;
        const later = accepted(decide(noticed, { pageText: "Restock soon" })).drop;
        assert.deepEqual(later.settingsNotice, noticed.settingsNotice);
    });
});

describe("Using decideSettingsChange, when a later submission has after-notice changes", () => {
    test("then it should replace the pending notice with its own", () => {
        const noticed = accepted(decide(dropForTests("open"), longerOfferWindow)).drop;
        const later = accepted(decide(noticed, { checkpointInterval: durationOfHours(6) })).drop;
        assert.deepEqual(later.settingsNotice?.changes, { checkpointInterval: durationOfHours(6) });
    });
});

describe("Using decideSettingsChange, when a finished drop changes its units", () => {
    test("then it should refuse", () => {
        assert.equal(decide(dropForTests("finished"), { unitCount: toCount(2) }).isAccepted, false);
    });
});

describe("Using decideSettingsChange, when a finished drop changes how long its results are kept", () => {
    test("then it should accept, because only the vendor's own records change", () => {
        assert.equal(decide(dropForTests("finished"), { resultsRetentionDays: toCount(365) }).isAccepted, true);
    });
});
