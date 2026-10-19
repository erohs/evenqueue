import type { IPlaceStore } from "#application/ports/interfaces/IPlaceStore.ts";
import type { PlaceAddition } from "#application/ports/types/PlaceAddition.type.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { IPlaceRecord } from "#domain/continuity/interfaces/IPlaceRecord.ts";
import type { IStoredCredentials } from "#domain/credentials/interfaces/IStoredCredentials.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

type PlacesById = Map<Bytes32Hex, IPlaceRecord>;

const hasCredentials = (record: IPlaceRecord, matches: (credentials: IStoredCredentials) => boolean): boolean =>
    matches(record.credentials.current) ||
    (record.credentials.pendingRecovery !== null && matches(record.credentials.pendingRecovery.replacement));

const addPlaceIfRoom = (places: PlacesById, record: IPlaceRecord, entrantCap: Count): PlaceAddition => {
    if (places.has(record.place.placeId)) return "already-on-waitlist";
    if (places.size >= entrantCap) return "waitlist-full";
    places.set(record.place.placeId, record);
    return "added";
};

/** For tests and local runs. Searches every place, which is fine for the sizes those use. */
export const createInMemoryPlaceStore = (): IPlaceStore => {
    const waitlists = new Map<Bytes32Hex, PlacesById>();
    const placesOf = (waitlistId: Bytes32Hex): PlacesById =>
        waitlists.get(waitlistId) ?? waitlists.set(waitlistId, new Map()).get(waitlistId) ?? new Map();
    const findBy = async (waitlistId: Bytes32Hex, matches: (credentials: IStoredCredentials) => boolean) =>
        [...placesOf(waitlistId).values()].find((record) => hasCredentials(record, matches)) ?? null;
    return {
        addPlace: async (waitlistId, record, entrantCap) => addPlaceIfRoom(placesOf(waitlistId), record, entrantCap),
        findPlaceByEntryCode: (waitlistId, lookup) =>
            findBy(waitlistId, (stored) => stored.entrySecretLookup === lookup),
        findPlaceByViewKey: (waitlistId, lookup) => findBy(waitlistId, (stored) => stored.viewKeyLookup === lookup),
        findPlaceByRecoveryCode: (waitlistId, check) =>
            findBy(waitlistId, (stored) => stored.recoveryCodeCheck === check),
        findPlaceByTypedPhrase: (waitlistId, check) =>
            findBy(waitlistId, (stored) => stored.typedPhraseCheck === check),
        saveCredentials: async (waitlistId, placeId, credentials) => {
            const record = placesOf(waitlistId).get(placeId);
            if (record !== undefined) placesOf(waitlistId).set(placeId, { place: record.place, credentials });
        },
        removePlace: async (waitlistId, placeId) => {
            placesOf(waitlistId).delete(placeId);
        },
    };
};
