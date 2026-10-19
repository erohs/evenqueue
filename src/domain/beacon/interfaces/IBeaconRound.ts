import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

export interface IBeaconRound {
    readonly round: number;
    /** The BLS signature, 48 bytes as hex. The public verifier checks it against the chain's key. */
    readonly signature: string;
    /** SHA-256 of the signature. */
    readonly randomness: Bytes32Hex;
}
