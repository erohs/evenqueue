import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { storedCredentialsForTests } from "#tests/support/functions/storedCredentialsForTests.function.ts";
import { credentialsInForceAt } from "../functions/credentialsInForceAt.function.ts";
import type { IPlaceCredentials } from "../interfaces/IPlaceCredentials.ts";

const original = storedCredentialsForTests("original");
const replacement = storedCredentialsForTests("replacement");
const recovering: IPlaceCredentials = {
    current: original,
    pendingRecovery: { requestedAt: 100, takesEffectAt: 200, replacement },
};

describe("Using credentialsInForceAt, while a recovery is still waiting", () => {
    test("then it should keep the original codes working", () => {
        assert.equal(credentialsInForceAt(recovering, 199), recovering);
    });
});

describe("Using credentialsInForceAt, once a recovery's time comes", () => {
    test("then it should switch to the replacement codes", () => {
        assert.deepEqual(credentialsInForceAt(recovering, 200), { current: replacement, pendingRecovery: null });
    });
});

describe("Using credentialsInForceAt, when no recovery is pending", () => {
    test("then it should leave the codes as they are", () => {
        const settled = { current: original, pendingRecovery: null };
        assert.equal(credentialsInForceAt(settled, 1_000), settled);
    });
});
