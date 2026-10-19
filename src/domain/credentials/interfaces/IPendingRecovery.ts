import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IStoredCredentials } from "./IStoredCredentials.ts";

export interface IPendingRecovery {
    readonly requestedAt: EpochMilliseconds;
    readonly takesEffectAt: EpochMilliseconds;
    readonly replacement: IStoredCredentials;
}
