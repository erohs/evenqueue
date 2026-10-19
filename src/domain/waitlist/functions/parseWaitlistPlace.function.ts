import { isBytes32Hex } from "#domain/shared/bytes/functions/isBytes32Hex.function.ts";
import { isCount } from "#domain/shared/counting/functions/isCount.function.ts";
import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import type { IWaitlistPlace } from "../interfaces/IWaitlistPlace.ts";

/** A place read back from storage or a backup. */
export const parseWaitlistPlace = (value: unknown): ParseResult<IWaitlistPlace> =>
    parsedFields<IWaitlistPlace>(
        value,
        {
            placeId: isBytes32Hex,
            drawsEntered: isCount,
            offersReceived: isCount,
            entryWindowNumber: isCount,
            offersNotTakenSinceLastMove: isCount,
        },
        (place) => (place.offersReceived > place.drawsEntered ? ["more offers received than draws entered"] : []),
    );
