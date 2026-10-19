import { hmacSha256OfConcatenatedParts } from "#domain/shared/bytes/functions/hmacSha256OfConcatenatedParts.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import { buyerCodeByteLengths } from "../consts/buyerCodeByteLengths.const.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";
import { minimumFormNonceByteLength } from "../consts/minimumFormNonceByteLength.const.ts";
import type { IIssuedCredentials } from "../interfaces/IIssuedCredentials.ts";
import { deriveViewKey } from "./deriveViewKey.function.ts";

/**
 * Derived from the entry key and the random nonce in the signed form, so a retried or double-submitted form shows the
 * same codes and creates one place, without the codes ever being stored.
 */
export const issueBuyerCredentials = async (entryKey: ByteArray, formNonce: ByteArray): Promise<IIssuedCredentials> => {
    if (formNonce.length < minimumFormNonceByteLength) {
        throw new RangeError(`formNonce must be at least ${minimumFormNonceByteLength} bytes`);
    }
    const entrySecret = (
        await hmacSha256OfConcatenatedParts(entryKey, credentialDerivationTags.entrySecret, formNonce)
    ).slice(0, buyerCodeByteLengths.entrySecret);
    const recoveryCode = (
        await hmacSha256OfConcatenatedParts(entryKey, credentialDerivationTags.recoveryCode, formNonce)
    ).slice(0, buyerCodeByteLengths.recoveryCode);
    return { entrySecret, viewKey: await deriveViewKey(entrySecret), recoveryCode };
};
