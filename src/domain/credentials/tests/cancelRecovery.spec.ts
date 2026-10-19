import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { storedCredentialsForTests } from "#tests/support/functions/storedCredentialsForTests.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { cancelRecovery } from "../functions/cancelRecovery.function.ts";

describe("Using cancelRecovery, when the original code's holder cancels in time", () => {
    test("then it should drop the pending recovery and keep the original codes", () => {
        const original = storedCredentialsForTests("original");
        const pendingRecovery = {
            requestedAt: toEpochMilliseconds(100),
            takesEffectAt: toEpochMilliseconds(200),
            replacement: storedCredentialsForTests("replacement"),
        };
        assert.deepEqual(cancelRecovery({ current: original, pendingRecovery }), {
            current: original,
            pendingRecovery: null,
        });
    });
});
