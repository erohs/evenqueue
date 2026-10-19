import { latestOf } from "#domain/shared/time/functions/latestOf.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IPlaceCredentials } from "../interfaces/IPlaceCredentials.ts";
import type { IStoredCredentials } from "../interfaces/IStoredCredentials.ts";
import type { RecoveryDelay } from "../types/RecoveryDelay.type.ts";
import { recoveryTakesEffectAt } from "./recoveryTakesEffectAt.function.ts";

/**
 * Starts a recovery; the current codes keep working until it takes effect. A new request replaces any pending one but
 * keeps the later time, so repeating a request can never bring a swap forward.
 */
export const requestRecovery = (
    credentials: IPlaceCredentials,
    replacement: IStoredCredentials,
    requestedAt: EpochMilliseconds,
    delay: RecoveryDelay,
    nextCheckpointAt: EpochMilliseconds | null,
): IPlaceCredentials => {
    const asked = recoveryTakesEffectAt(requestedAt, delay, nextCheckpointAt);
    const pending = credentials.pendingRecovery;
    const takesEffectAt = pending === null ? asked : latestOf(asked, pending.takesEffectAt);
    return { current: credentials.current, pendingRecovery: { requestedAt, takesEffectAt, replacement } };
};
