import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { storedCredentialsForTests } from "#tests/support/functions/storedCredentialsForTests.function.ts";
import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { requestRecovery } from "../functions/requestRecovery.function.ts";
import { toRecoveryDelay } from "../functions/toRecoveryDelay.function.ts";
import type { IPlaceCredentials } from "../interfaces/IPlaceCredentials.ts";

const hours = (count: number) => toEpochMilliseconds(count * 3_600_000);
const twelveHours = toRecoveryDelay(durationOfHours(12));
const original = storedCredentialsForTests("original");
const replacement = storedCredentialsForTests("replacement");
const settled: IPlaceCredentials = { current: original, pendingRecovery: null };

describe("Using requestRecovery, when a buyer asks to recover their place", () => {
    test("then it should keep the current codes and hold the replacement until it takes effect", () => {
        assert.deepEqual(requestRecovery(settled, replacement, hours(0), twelveHours, null), {
            current: original,
            pendingRecovery: { requestedAt: hours(0), takesEffectAt: hours(12), replacement },
        });
    });
});

describe("Using requestRecovery, when a second request arrives during the delay", () => {
    test("then it should hold the new replacement", () => {
        const second = storedCredentialsForTests("second");
        const recovering = requestRecovery(settled, replacement, hours(0), twelveHours, null);
        assert.equal(
            requestRecovery(recovering, second, hours(1), twelveHours, null).pendingRecovery?.replacement,
            second,
        );
    });

    test("then it should never bring the swap forward", () => {
        const recovering = requestRecovery(settled, replacement, hours(0), twelveHours, hours(48));
        const repeated = requestRecovery(recovering, storedCredentialsForTests("second"), hours(1), twelveHours, null);
        assert.equal(repeated.pendingRecovery?.takesEffectAt, hours(48));
    });
});
