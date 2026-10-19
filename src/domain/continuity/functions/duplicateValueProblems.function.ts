import type { IStoredCredentials } from "#domain/credentials/interfaces/IStoredCredentials.ts";
import type { IPlaceRecord } from "../interfaces/IPlaceRecord.ts";

const storedValueNames = [
    "entrySecretLookup",
    "viewKeyLookup",
    "recoveryCodeCheck",
    "typedPhraseCheck",
    "placeTag",
] as const;
const hasDuplicates = (values: readonly string[]): boolean => new Set(values).size !== values.length;

/** Any id or stored value shared by two places, current or pending, would let one code reach two places. */
export const duplicateValueProblems = (places: readonly IPlaceRecord[]): string[] => {
    const allCredentials: IStoredCredentials[] = places.flatMap(({ credentials }) =>
        credentials.pendingRecovery === null
            ? [credentials.current]
            : [credentials.current, credentials.pendingRecovery.replacement],
    );
    return [
        ...(hasDuplicates(places.map((record) => record.place.placeId)) ? ["duplicate placeId"] : []),
        ...storedValueNames.flatMap((name) =>
            hasDuplicates(allCredentials.map((stored) => stored[name])) ? [`duplicate ${name}`] : [],
        ),
    ];
};
