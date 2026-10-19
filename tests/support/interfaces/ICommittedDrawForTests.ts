import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import type { IPublicDrawInputs } from "#domain/draw/interfaces/IPublicDrawInputs.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

export interface ICommittedDrawForTests {
    readonly leaves: readonly IWaitlistLeaf[];
    readonly publicDrawInputs: IPublicDrawInputs;
    /** Kept privately by the vendor at commit, so an offer can reach the place behind a leaf. */
    readonly placeIdByPublicDrawId: ReadonlyMap<Bytes32Hex, Bytes32Hex>;
}
