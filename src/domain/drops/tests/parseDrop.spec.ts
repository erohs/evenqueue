import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { dropForTests } from "#tests/support/functions/dropForTests.function.ts";
import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { parseDrop } from "../functions/parseDrop.function.ts";
import type { IDrop } from "../interfaces/IDrop.ts";

const givenAt = toEpochMilliseconds(1_760_100_000_000);
const notice = { givenAt, takesEffectAt: toEpochMilliseconds(givenAt + 86_400_000) };
const noticed: IDrop = {
    ...dropForTests("offering"),
    settingsNotice: { ...notice, changes: { offerWindow: durationOfHours(96) } },
};
const problemsOf = (value: unknown): readonly string[] => {
    const result = parseDrop(value);
    return result.isValid ? [] : result.problems;
};

describe("Using parseDrop, when a stored drop has a pending notice", () => {
    test("then it should read it back unchanged", () => {
        assert.deepEqual(parseDrop(JSON.parse(JSON.stringify(noticed))), { isValid: true, value: noticed });
    });
});

describe("Using parseDrop, when a draft has an opening time", () => {
    test("then it should refuse it", () => {
        assert.deepEqual(problemsOf({ ...dropForTests("draft"), openedAt: givenAt }), ["a draft has an opening time"]);
    });
});

describe("Using parseDrop, when an open drop has no opening time", () => {
    test("then it should refuse it", () => {
        assert.deepEqual(problemsOf({ ...dropForTests("open"), openedAt: null }), [
            "an opened drop has no opening time",
        ]);
    });
});

describe("Using parseDrop, when a stored notice would change a setting fixed once the drop opens", () => {
    test("then it should refuse it", () => {
        const tampered = { ...noticed, settingsNotice: { ...notice, changes: { entryWindow: durationOfHours(96) } } };
        assert.deepEqual(problemsOf(tampered), ["settingsNotice: changes must name after-notice settings only"]);
    });
});

describe("Using parseDrop, when a stored notice would make the settings invalid", () => {
    test("then it should refuse it", () => {
        const tampered = { ...noticed, settingsNotice: { ...notice, changes: { offerWindow: 1 } } };
        assert.deepEqual(problemsOf(tampered), ["settingsNotice: changes: offerWindow is missing or invalid"]);
    });
});

describe("Using parseDrop, when a stored notice names an inherited property", () => {
    test("then it should refuse it", () => {
        const tampered = { ...noticed, settingsNotice: { ...notice, changes: JSON.parse('{"__proto__":{}}') } };
        assert.equal(problemsOf(tampered).length, 1);
    });
});

describe("Using parseDrop, when a draft has a notice", () => {
    test("then it should refuse it, because a draft's changes apply at once", () => {
        assert.deepEqual(problemsOf({ ...noticed, state: "draft", openedAt: null }), ["a draft has a notice"]);
    });
});
