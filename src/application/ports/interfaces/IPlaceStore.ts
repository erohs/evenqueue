import type { IPlaceRecord } from "#domain/continuity/interfaces/IPlaceRecord.ts";
import type { IPlaceCredentials } from "#domain/credentials/interfaces/IPlaceCredentials.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { PlaceAddition } from "../types/PlaceAddition.type.ts";

/**
 * Buyers' places, kept per waitlist. The finders match a place's current credentials or the replacement in a pending
 * recovery, because a recovery may be due before a timer has applied it; the use case decides which are in force.
 */
export interface IPlaceStore {
    /** Atomic: checks for the place id first, then the cap, then adds. */
    addPlace: (waitlistId: Bytes32Hex, record: IPlaceRecord, entrantCap: Count) => Promise<PlaceAddition>;
    findPlaceByEntryCode: (waitlistId: Bytes32Hex, entrySecretLookup: Bytes32Hex) => Promise<IPlaceRecord | null>;
    findPlaceByViewKey: (waitlistId: Bytes32Hex, viewKeyLookup: Bytes32Hex) => Promise<IPlaceRecord | null>;
    findPlaceByRecoveryCode: (waitlistId: Bytes32Hex, recoveryCodeCheck: Bytes32Hex) => Promise<IPlaceRecord | null>;
    saveCredentials: (waitlistId: Bytes32Hex, placeId: Bytes32Hex, credentials: IPlaceCredentials) => Promise<void>;
    /** Deletes the place outright: nothing about it is kept. */
    removePlace: (waitlistId: Bytes32Hex, placeId: Bytes32Hex) => Promise<void>;
}
