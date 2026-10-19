import type { IBeaconRound } from "./IBeaconRound.ts";

/** What one endpoint returned for the round: null if it was unreachable, unpinned or sent something invalid. */
export interface IEndpointBeaconReading {
    readonly endpointName: string;
    readonly beaconRound: IBeaconRound | null;
}
