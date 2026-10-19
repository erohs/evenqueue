import type { FormNonce } from "#domain/credentials/types/FormNonce.type.ts";
import type { ServerKey } from "#domain/credentials/types/ServerKey.type.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { hmacSha256OfConcatenatedParts } from "#domain/shared/bytes/functions/hmacSha256OfConcatenatedParts.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { FormPurpose } from "../types/FormPurpose.type.ts";
import { formTokenSignedParts } from "./formTokenSignedParts.function.ts";

/**
 * A hidden field in each form served: it proves the form came from this instance, for this waitlist and purpose, and
 * when. Its nonce becomes the buyer's codes, so the codes never need storing.
 */
export const signFormToken = async (
    formGuardKey: ServerKey,
    purpose: FormPurpose,
    waitlistId: Bytes32Hex,
    nonce: FormNonce,
    issuedAt: EpochMilliseconds,
): Promise<string> => {
    const parts = formTokenSignedParts(purpose, waitlistId, nonce, issuedAt);
    return `${encodeHex(nonce)}.${issuedAt}.${encodeHex(await hmacSha256OfConcatenatedParts(formGuardKey, ...parts))}`;
};
