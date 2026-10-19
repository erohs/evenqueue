import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IWaitlistLeaf } from "./IWaitlistLeaf.ts";

export interface ICommitmentInput {
    readonly drawId: Bytes32Hex;
    readonly leaves: readonly IWaitlistLeaf[];
    readonly settingsDigest: Bytes32Hex;
    readonly committedAt: EpochMilliseconds;
    readonly beaconRound: number;
}
