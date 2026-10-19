import type { IPlaceCredentials } from "../interfaces/IPlaceCredentials.ts";

/** Done with the current entry code, so a stolen recovery code cannot quietly take a place. */
export const cancelRecovery = (credentials: IPlaceCredentials): IPlaceCredentials => ({
    current: credentials.current,
    pendingRecovery: null,
});
