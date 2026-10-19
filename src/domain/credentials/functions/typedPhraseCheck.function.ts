import { hmacSha256Hex } from "#domain/shared/bytes/functions/hmacSha256Hex.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";
import type { ServerKey } from "../types/ServerKey.type.ts";

/** Over the words joined by single spaces, so however the buyer spaced or capitalised them, one check matches. */
export const typedPhraseCheck = (waitlistKey: ServerKey, words: readonly string[]): Promise<Bytes32Hex> =>
    hmacSha256Hex(waitlistKey, credentialDerivationTags.typedPhraseCheck, new TextEncoder().encode(words.join(" ")));
