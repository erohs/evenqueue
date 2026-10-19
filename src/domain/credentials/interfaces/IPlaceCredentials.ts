import type { IPendingRecovery } from "./IPendingRecovery.ts";
import type { IStoredCredentials } from "./IStoredCredentials.ts";

/** The credentials of one waitlist place. Recovery swaps them; the place itself never changes. */
export interface IPlaceCredentials {
    readonly current: IStoredCredentials;
    readonly pendingRecovery: IPendingRecovery | null;
}
