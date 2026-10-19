import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { isBytes32Hex } from "#domain/shared/bytes/functions/isBytes32Hex.function.ts";
import { sha256Hex } from "#domain/shared/bytes/functions/sha256Hex.function.ts";
import { isRecord } from "#domain/shared/parsing/functions/isRecord.function.ts";
import type { IBeaconRound } from "../interfaces/IBeaconRound.ts";
import type { BeaconRound } from "../types/BeaconRound.type.ts";

const signaturePattern = /^[0-9a-f]{96}$/u;

/**
 * Parses an endpoint's `/public/{round}` body: accepted only if it names the round asked for and its randomness is
 * the SHA-256 of its signature. Fields are read by name, because endpoints order them differently.
 */
export const parseBeaconRound = async (body: unknown, expectedRound: BeaconRound): Promise<IBeaconRound | null> => {
    if (!isRecord(body)) return null;
    const { round, signature, randomness } = body;
    if (round !== expectedRound || typeof signature !== "string" || !signaturePattern.test(signature)) return null;
    if (!isBytes32Hex(randomness) || (await sha256Hex(decodeHex(signature))) !== randomness) return null;
    return { round: expectedRound, signature, randomness };
};
