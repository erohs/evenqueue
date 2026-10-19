import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import { isEpochMilliseconds } from "#domain/shared/time/functions/isEpochMilliseconds.function.ts";
import type { IServiceGap } from "../interfaces/IServiceGap.ts";

/** A gap read back from storage. */
export const parseServiceGap = (value: unknown): ParseResult<IServiceGap> =>
    parsedFields<IServiceGap>(value, { startsAt: isEpochMilliseconds, endsAt: isEpochMilliseconds }, (gap) =>
        gap.endsAt > gap.startsAt ? [] : ["ends before it starts"],
    );
