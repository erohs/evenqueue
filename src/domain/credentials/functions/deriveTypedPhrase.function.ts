import { hmacSha256OfConcatenatedParts } from "#domain/shared/bytes/functions/hmacSha256OfConcatenatedParts.function.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";
import { phraseWords } from "../consts/phraseWords.const.ts";
import { typedPhraseWordCount } from "../consts/typedPhraseWordCount.const.ts";
import type { FormNonce } from "../types/FormNonce.type.ts";
import type { ServerKey } from "../types/ServerKey.type.ts";
import { phraseWordIndexesIn } from "./phraseWordIndexesIn.function.ts";

/**
 * Derived like the codes, so a resent form shows the same words. Each 32-byte block gives up to 16 words, so one
 * block almost always suffices; the loop takes as many as it needs.
 */
export const deriveTypedPhrase = async (entryKey: ServerKey, formNonce: FormNonce): Promise<readonly string[]> => {
    const indexes: number[] = [];
    for (let block = 0; indexes.length < typedPhraseWordCount; block++) {
        const bytes = await hmacSha256OfConcatenatedParts(
            entryKey,
            credentialDerivationTags.typedPhrase,
            formNonce,
            Uint8Array.of(block),
        );
        indexes.push(...phraseWordIndexesIn(bytes));
    }
    return indexes.slice(0, typedPhraseWordCount).map((index) => phraseWords[index] ?? "");
};
