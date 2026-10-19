import type { BeaconRound } from "#domain/beacon/types/BeaconRound.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** Published when a halted beacon chain forces a new round. The waitlist and its root stay frozen. */
export interface IDrawVoid {
    readonly drawId: Bytes32Hex;
    readonly voidedBeaconRound: BeaconRound;
    readonly reason: string;
    /** The independent parties that attested the halt. */
    readonly attestedBy: readonly string[];
}
