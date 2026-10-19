import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { storedCredentialsForTests } from "#tests/support/functions/storedCredentialsForTests.function.ts";
import { requestRecovery } from "../functions/requestRecovery.function.ts";
import type { IPlaceCredentials } from "../interfaces/IPlaceCredentials.ts";

const original = storedCredentialsForTests("original");
const replacement = storedCredentialsForTests("replacement");
const settled: IPlaceCredentials = { current: original, pendingRecovery: null };

describe("Using requestRecovery, when a buyer asks to recover their place", () => {
    test("then it should keep the current codes and hold the replacement until it takes effect", () => {
        assert.deepEqual(requestRecovery(settled, replacement, 100, 200), {
            current: original,
            pendingRecovery: { requestedAt: 100, takesEffectAt: 200, replacement },
        });
    });
});

describe("Using requestRecovery, when a second request arrives during the delay", () => {
    test("then it should replace the first and restart the delay", () => {
        const second = storedCredentialsForTests("second");
        const recovering = requestRecovery(settled, replacement, 100, 200);
        assert.deepEqual(requestRecovery(recovering, second, 150, 250).pendingRecovery, {
            requestedAt: 150,
            takesEffectAt: 250,
            replacement: second,
        });
    });
});

describe("Using requestRecovery, when it would take effect immediately", () => {
    test("then it should refuse it", () => {
        assert.throws(() => requestRecovery(settled, replacement, 100, 100), RangeError);
    });
});
