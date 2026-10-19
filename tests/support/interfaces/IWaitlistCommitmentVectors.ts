import type { IMerkleProofStep } from "#domain/commitment/interfaces/IMerkleProofStep.ts";
import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

export interface IWaitlistCommitmentVectors {
    readonly drawId: Bytes32Hex;
    readonly places: readonly {
        readonly viewKey: string;
        readonly placeTag: Bytes32Hex;
        readonly publicDrawId: Bytes32Hex;
    }[];
    readonly leaves: readonly IWaitlistLeaf[];
    readonly leafHashesInOrder: readonly string[];
    readonly committedWaitlistRoot: Bytes32Hex;
    readonly inclusionProof: { readonly publicDrawId: Bytes32Hex; readonly steps: readonly IMerkleProofStep[] };
}
