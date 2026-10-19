import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";

/** Shown on every drop page for buyers to copy and repost; two that differ at the same size prove a split view. */
export interface ILogCheckpoint {
    readonly entryCount: Count;
    readonly headHash: Bytes32Hex;
}
