import type { BeaconRound } from "#domain/beacon/types/BeaconRound.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IPriorityCount } from "./IPriorityCount.ts";

/** Published before the named beacon round exists, so nobody can choose the waitlist knowing the randomness. */
export interface ICommitment {
    readonly drawId: Bytes32Hex;
    readonly protocolVersion: number;
    readonly committedWaitlistRoot: Bytes32Hex;
    readonly placeCount: Count;
    /** Highest priority first, so the verifier can check how many places moved up since the last draw. */
    readonly placeCountsByPriority: readonly IPriorityCount[];
    /** Digest of the draw's frozen settings: rule, units, windows. */
    readonly settingsDigest: Bytes32Hex;
    readonly beaconChainHash: string;
    readonly beaconRound: BeaconRound;
    readonly minimumBeaconLead: DurationMilliseconds;
    readonly committedAt: EpochMilliseconds;
    /** The round of the commitment this one replaced after a void, or null. */
    readonly replacesBeaconRound: BeaconRound | null;
}
