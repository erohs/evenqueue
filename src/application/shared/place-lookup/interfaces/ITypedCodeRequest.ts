import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** A code as the buyer typed or pasted it, sent in a form body, never in a web address. */
export interface ITypedCodeRequest {
    readonly dropId: Bytes32Hex;
    readonly typedCode: unknown;
}
