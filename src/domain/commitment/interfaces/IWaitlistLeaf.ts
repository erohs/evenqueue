import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** One place as published for one draw: nothing that links it to the same place in another draw. */
export interface IWaitlistLeaf {
    readonly publicDrawId: Bytes32Hex;
    /** A whole number that fits in 32 signed bits. */
    readonly priority: number;
}
