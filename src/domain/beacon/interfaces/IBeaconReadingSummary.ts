import type { BeaconReadingStatus } from "../types/BeaconReadingStatus.type.ts";
import type { IBeaconRound } from "./IBeaconRound.ts";

export interface IBeaconReadingSummary {
    readonly status: BeaconReadingStatus;
    /** Set only when the status is agreed. */
    readonly beaconRound: IBeaconRound | null;
    readonly answeringEndpointNames: readonly string[];
}
