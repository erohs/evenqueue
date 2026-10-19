import { hmacSha256OfConcatenatedParts } from "#domain/shared/bytes/functions/hmacSha256OfConcatenatedParts.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import { buyerCodeByteLengths } from "../consts/buyerCodeByteLengths.const.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";

/** HMAC(entrySecret, tag), truncated. Anyone with the entry code can rebuild it; nobody can go the other way. */
export const deriveViewKey = async (entrySecret: ByteArray): Promise<ByteArray> =>
    (await hmacSha256OfConcatenatedParts(entrySecret, credentialDerivationTags.viewKey)).slice(
        0,
        buyerCodeByteLengths.viewKey,
    );
