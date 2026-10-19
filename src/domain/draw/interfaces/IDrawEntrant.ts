import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";

export interface IDrawEntrant {
    readonly place: IWaitlistPlace;
    /** Published for this draw only, so the public list cannot link a buyer across drops. */
    readonly publicDrawId: Bytes32Hex;
}
