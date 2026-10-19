import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { storedCredentialsForTests } from "#tests/support/functions/storedCredentialsForTests.function.ts";
import { cancelRecovery } from "../functions/cancelRecovery.function.ts";

describe("Using cancelRecovery, when the original code's holder cancels in time", () => {
    test("then it should drop the pending recovery and keep the original codes", () => {
        const original = storedCredentialsForTests("original");
        const recovering = {
            current: original,
            pendingRecovery: {
                requestedAt: 100,
                takesEffectAt: 200,
                replacement: storedCredentialsForTests("replacement"),
            },
        };
        assert.deepEqual(cancelRecovery(recovering), { current: original, pendingRecovery: null });
    });
});
