import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createSeededRandom } from "#tests/support/functions/createSeededRandom.function.ts";
import { randomWholeNumber } from "#tests/support/functions/randomWholeNumber.function.ts";
import { storedCredentialsForTests } from "#tests/support/functions/storedCredentialsForTests.function.ts";
import { credentialsInForceAt } from "#domain/credentials/functions/credentialsInForceAt.function.ts";
import { requestRecovery } from "#domain/credentials/functions/requestRecovery.function.ts";
import { toRecoveryDelay } from "#domain/credentials/functions/toRecoveryDelay.function.ts";
import { toDurationMilliseconds } from "#domain/shared/time/functions/toDurationMilliseconds.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";

const random = createSeededRandom(8);
const hour = 3_600_000;
const original = storedCredentialsForTests("original");
const settled = { current: original, pendingRecovery: null };

const randomRecovery = () => {
    const requestedAt = toEpochMilliseconds(1_760_000_000_000 + randomWholeNumber(random, 0, 1_000 * hour));
    const delay = toRecoveryDelay(toDurationMilliseconds(6 * hour + randomWholeNumber(random, 0, 48 * hour)));
    const nextCheckpointAt =
        random() < 0.3 ? null : toEpochMilliseconds(requestedAt + randomWholeNumber(random, -24 * hour, 48 * hour));
    const recovering = requestRecovery(settled, storedCredentialsForTests("new"), requestedAt, delay, nextCheckpointAt);
    return { requestedAt, takesEffectAt: recovering.pendingRecovery?.takesEffectAt ?? assert.fail(), recovering };
};
const recoveries = Array.from({ length: 1_000 }, randomRecovery);

describe("Using recovery, for 1,000 random requests, delays and checkpoints", () => {
    test("then no recovery should ever take effect less than six hours after it was asked for", () => {
        assert.ok(recoveries.every(({ requestedAt, takesEffectAt }) => takesEffectAt >= requestedAt + 6 * hour));
    });

    test("then the original codes should keep working until the very moment it takes effect", () => {
        const isOriginalUntilDue = ({ requestedAt, takesEffectAt, recovering }: (typeof recoveries)[number]): boolean =>
            [requestedAt, toEpochMilliseconds(takesEffectAt - 1)].every(
                (now) => credentialsInForceAt(recovering, now).current === original,
            ) && credentialsInForceAt(recovering, takesEffectAt).current !== original;
        assert.ok(recoveries.every(isOriginalUntilDue));
    });
});
