import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

export interface IMerkleTree {
    /** From the leaf hashes up. Stored at close, so a buyer's proof never needs the tree rebuilt. */
    readonly levels: readonly (readonly ByteArray[])[];
    readonly root: Bytes32Hex;
}
