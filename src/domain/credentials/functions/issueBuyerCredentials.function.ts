import { hmacSha256OfConcatenatedParts } from "#domain/shared/bytes/functions/hmacSha256OfConcatenatedParts.function.ts";
import { buyerCodeByteLengths } from "../consts/buyerCodeByteLengths.const.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";
import type { IIssuedCredentials } from "../interfaces/IIssuedCredentials.ts";
import type { FormNonce } from "../types/FormNonce.type.ts";
import type { ServerKey } from "../types/ServerKey.type.ts";
import { deriveTypedPhrase } from "./deriveTypedPhrase.function.ts";
import { deriveViewKey } from "./deriveViewKey.function.ts";

/**
 * Derived from the entry key and the random nonce in the signed form, so a retried or double-submitted form shows the
 * same codes and creates one place, without the codes ever being stored.
 */
export const issueBuyerCredentials = async (entryKey: ServerKey, formNonce: FormNonce): Promise<IIssuedCredentials> => {
    const derive = async (tag: Uint8Array, length: number) =>
        (await hmacSha256OfConcatenatedParts(entryKey, tag, formNonce)).slice(0, length);
    const entrySecret = await derive(credentialDerivationTags.entrySecret, buyerCodeByteLengths.entrySecret);
    const recoveryCode = await derive(credentialDerivationTags.recoveryCode, buyerCodeByteLengths.recoveryCode);
    const typedPhrase = await deriveTypedPhrase(entryKey, formNonce);
    return { entrySecret, viewKey: await deriveViewKey(entrySecret), recoveryCode, typedPhrase };
};
