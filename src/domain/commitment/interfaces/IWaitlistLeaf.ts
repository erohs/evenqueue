import type { Priority } from "#domain/allocation-rules/types/Priority.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** One place as published for one draw: nothing that links it to the same place in another draw. */
export interface IWaitlistLeaf {
    readonly publicDrawId: Bytes32Hex;
    readonly priority: Priority;
}
