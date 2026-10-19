import { isBytes32Hex } from "#domain/shared/bytes/functions/isBytes32Hex.function.ts";
import { isCount } from "#domain/shared/counting/functions/isCount.function.ts";
import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import type { ILogCheckpoint } from "../interfaces/ILogCheckpoint.ts";

/** A checkpoint a buyer saved or reposted. */
export const parseLogCheckpoint = (value: unknown): ParseResult<ILogCheckpoint> =>
    parsedFields<ILogCheckpoint>(value, { entryCount: isCount, headHash: isBytes32Hex });
