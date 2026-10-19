import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { dropForTests } from "#tests/support/functions/dropForTests.function.ts";
import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { settingsInForceAt } from "../functions/settingsInForceAt.function.ts";
import type { IDrop } from "../interfaces/IDrop.ts";

const takesEffectAt = toEpochMilliseconds(1_760_200_000_000);
const noticed: IDrop = {
    ...dropForTests("offering"),
    settingsNotice: {
        givenAt: toEpochMilliseconds(takesEffectAt - 86_400_000),
        takesEffectAt,
        changes: { offerWindow: durationOfHours(96) },
    },
};

describe("Using settingsInForceAt, a moment before the notice runs out", () => {
    test("then it should keep the current settings", () => {
        assert.equal(settingsInForceAt(noticed, toEpochMilliseconds(takesEffectAt - 1)), noticed);
    });
});

describe("Using settingsInForceAt, when the notice has run out", () => {
    test("then it should apply the change", () => {
        assert.equal(settingsInForceAt(noticed, takesEffectAt).settings.offerWindow, durationOfHours(96));
    });

    test("then it should clear the notice", () => {
        assert.equal(settingsInForceAt(noticed, takesEffectAt).settingsNotice, null);
    });
});
