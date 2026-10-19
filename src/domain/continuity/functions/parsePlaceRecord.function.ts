import { parsePlaceCredentials } from "#domain/credentials/functions/parsePlaceCredentials.function.ts";
import { isRecord } from "#domain/shared/parsing/functions/isRecord.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import { parseWaitlistPlace } from "#domain/waitlist/functions/parseWaitlistPlace.function.ts";
import type { IPlaceRecord } from "../interfaces/IPlaceRecord.ts";

export const parsePlaceRecord = (value: unknown): ParseResult<IPlaceRecord> => {
    if (!isRecord(value)) return { isValid: false, problems: ["not an object"] };
    const place = parseWaitlistPlace(value["place"]);
    const credentials = parsePlaceCredentials(value["credentials"]);
    if (place.isValid && credentials.isValid) {
        return { isValid: true, value: { place: place.value, credentials: credentials.value } };
    }
    return {
        isValid: false,
        problems: [
            ...(place.isValid ? [] : place.problems.map((problem) => `place: ${problem}`)),
            ...(credentials.isValid ? [] : credentials.problems.map((problem) => `credentials: ${problem}`)),
        ],
    };
};
