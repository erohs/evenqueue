import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";

export interface IPlaceToCommit {
    readonly place: IWaitlistPlace;
    /** From the place's current stored credentials. */
    readonly placeTag: Bytes32Hex;
}
