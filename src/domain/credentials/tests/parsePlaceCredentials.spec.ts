import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { storedCredentialsForTests } from "#tests/support/functions/storedCredentialsForTests.function.ts";
import { parsePlaceCredentials } from "../functions/parsePlaceCredentials.function.ts";

const current = storedCredentialsForTests("current");
const pendingRecovery = { requestedAt: 1, takesEffectAt: 2, replacement: storedCredentialsForTests("new") };

describe("Using parsePlaceCredentials, when stored credentials are well formed", () => {
    test("then it should return them", () => {
        assert.deepEqual(parsePlaceCredentials({ current, pendingRecovery }), {
            isValid: true,
            value: { current, pendingRecovery },
        });
    });
});

describe("Using parsePlaceCredentials, when the pending recovery is left out instead of null", () => {
    test("then it should refuse them", () => {
        assert.equal(parsePlaceCredentials({ current }).isValid, false);
    });
});

describe("Using parsePlaceCredentials, when a pending recovery would never take effect", () => {
    test("then it should name the bad time", () => {
        const never = { ...pendingRecovery, takesEffectAt: Number.POSITIVE_INFINITY };
        assert.deepEqual(parsePlaceCredentials({ current, pendingRecovery: never }), {
            isValid: false,
            problems: ["pendingRecovery: takesEffectAt is missing or invalid"],
        });
    });
});

describe("Using parsePlaceCredentials, when a stored value is not a 32-byte hash", () => {
    test("then it should name the field", () => {
        const result = parsePlaceCredentials({ current: { ...current, placeTag: "abc" }, pendingRecovery: null });
        assert.deepEqual(result, { isValid: false, problems: ["current: placeTag is missing or invalid"] });
    });
});
