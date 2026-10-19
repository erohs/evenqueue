import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IPlaceCredentials } from "../interfaces/IPlaceCredentials.ts";

/** Applies a recovery whose time has come: the replacement codes start working and the old ones stop. */
export const credentialsInForceAt = (credentials: IPlaceCredentials, now: EpochMilliseconds): IPlaceCredentials => {
    const pending = credentials.pendingRecovery;
    if (pending === null || now < pending.takesEffectAt) return credentials;
    return { current: pending.replacement, pendingRecovery: null };
};
