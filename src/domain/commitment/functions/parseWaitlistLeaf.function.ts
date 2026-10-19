import { isPriority } from "#domain/allocation-rules/functions/isPriority.function.ts";
import { isBytes32Hex } from "#domain/shared/bytes/functions/isBytes32Hex.function.ts";
import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";

export const parseWaitlistLeaf = (value: unknown): ParseResult<IWaitlistLeaf> =>
    parsedFields<IWaitlistLeaf>(value, { publicDrawId: isBytes32Hex, priority: isPriority });
