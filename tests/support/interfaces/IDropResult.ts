import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";

export interface IDropResult {
    readonly buyers: ReadonlySet<Bytes32Hex>;
    readonly waitlistAfterDrop: IWaitlistPlace[];
}
