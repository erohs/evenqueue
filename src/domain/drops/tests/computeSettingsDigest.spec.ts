import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { waitlistForTests } from "#tests/support/functions/waitlistForTests.function.ts";
import vectors from "#tests/vectors/settingsDigest.json" with { type: "json" };
import type { AllocationRuleId } from "#domain/allocation-rules/types/AllocationRuleId.type.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import { toDurationMilliseconds } from "#domain/shared/time/functions/toDurationMilliseconds.function.ts";
import { dropSettingChangeClasses } from "../consts/dropSettingChangeClasses.const.ts";
import { computeSettingsDigest } from "../functions/computeSettingsDigest.function.ts";
import { defaultDropSettings } from "../functions/defaultDropSettings.function.ts";
import type { IDropSettings } from "../interfaces/IDropSettings.ts";
import type { DropSettingName } from "../types/DropSettingName.type.ts";

const waitlist = waitlistForTests();
const settings = defaultDropSettings(waitlist.allocationRuleId);
const changedValues: { readonly [Name in DropSettingName]: IDropSettings[Name] } = {
    unitCount: toCount(9),
    entrantCap: toCount(9),
    entryWindow: durationOfHours(25),
    offerWindow: durationOfHours(25),
    checkpointInterval: durationOfHours(2),
    embedOrigins: ["https://shop.example"],
    pageText: "Changed",
    announcementWebhookUrl: "https://hooks.example/post",
    resultsRetentionDays: toCount(100),
};
const settingNames = Object.keys(dropSettingChangeClasses) as DropSettingName[];
const digestWith = (name: DropSettingName) =>
    computeSettingsDigest(waitlist, { ...settings, [name]: changedValues[name] });

describe("Using computeSettingsDigest, for the independently computed vectors", () => {
    test("then it should reproduce every digest", async () => {
        for (const { fields, digest } of vectors.cases) {
            const vectorWaitlist = {
                ...waitlist,
                allocationRuleId: fields.allocationRuleId as AllocationRuleId,
                shouldForgetPlacesAfterEachDrop: fields.shouldForgetPlacesAfterEachDrop,
            };
            const vectorSettings = {
                ...settings,
                entrantCap: toCount(fields.entrantCap),
                entryWindow: toDurationMilliseconds(fields.entryWindowMilliseconds),
            };
            assert.equal(await computeSettingsDigest(vectorWaitlist, vectorSettings), digest);
        }
    });
});

describe("Using computeSettingsDigest, when any setting fixed once the drop opens changes", () => {
    test("then it should change the digest", async () => {
        const original = await computeSettingsDigest(waitlist, settings);
        for (const name of settingNames.filter((setting) => dropSettingChangeClasses[setting] === "fixed-once-open")) {
            assert.notEqual(await digestWith(name), original, name);
        }
    });
});

describe("Using computeSettingsDigest, when a setting that may change in public changes", () => {
    test("then it should keep the digest, so the change cannot break the commitment", async () => {
        const original = await computeSettingsDigest(waitlist, settings);
        for (const name of settingNames.filter((setting) => dropSettingChangeClasses[setting] !== "fixed-once-open")) {
            assert.equal(await digestWith(name), original, name);
        }
    });
});
