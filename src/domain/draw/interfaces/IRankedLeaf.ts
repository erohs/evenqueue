import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

export interface IRankedLeaf extends IWaitlistLeaf {
    readonly randomTiebreakKey: Bytes32Hex;
}
