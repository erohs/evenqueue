import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

export interface IMerkleProofStep {
    readonly siblingHash: Bytes32Hex;
    readonly isSiblingOnLeft: boolean;
}
