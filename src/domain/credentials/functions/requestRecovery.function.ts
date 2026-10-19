import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IPlaceCredentials } from "../interfaces/IPlaceCredentials.ts";
import type { IStoredCredentials } from "../interfaces/IStoredCredentials.ts";

/**
 * Starts a recovery; the current codes keep working until it takes effect. A new request replaces any pending one and
 * restarts the delay, so repeating a request can never bring the swap forward.
 */
export const requestRecovery = (
    credentials: IPlaceCredentials,
    replacement: IStoredCredentials,
    requestedAt: EpochMilliseconds,
    takesEffectAt: EpochMilliseconds,
): IPlaceCredentials => {
    if (takesEffectAt <= requestedAt) throw new RangeError("a recovery must take effect after it is requested");
    return { current: credentials.current, pendingRecovery: { requestedAt, takesEffectAt, replacement } };
};
