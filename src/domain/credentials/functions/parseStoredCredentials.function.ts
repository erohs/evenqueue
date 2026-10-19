import { isBytes32Hex } from "#domain/shared/bytes/functions/isBytes32Hex.function.ts";
import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import type { IStoredCredentials } from "../interfaces/IStoredCredentials.ts";

export const parseStoredCredentials = (value: unknown): ParseResult<IStoredCredentials> =>
    parsedFields<IStoredCredentials>(value, {
        entrySecretLookup: isBytes32Hex,
        viewKeyLookup: isBytes32Hex,
        recoveryCodeCheck: isBytes32Hex,
        typedPhraseCheck: isBytes32Hex,
        placeTag: isBytes32Hex,
    });
