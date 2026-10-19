import type { FormNonce } from "#domain/credentials/types/FormNonce.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { formTokenTag } from "../consts/formTokenTag.const.ts";
import type { FormPurpose } from "../types/FormPurpose.type.ts";

export const formTokenSignedParts = (
    purpose: FormPurpose,
    waitlistId: Bytes32Hex,
    nonce: FormNonce,
    issuedAt: EpochMilliseconds,
): Uint8Array[] => [
    formTokenTag,
    new TextEncoder().encode(`${purpose}\u0000${waitlistId}\u0000${issuedAt}\u0000`),
    nonce,
];
