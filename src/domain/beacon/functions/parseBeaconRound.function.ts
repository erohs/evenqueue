import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { isBytes32Hex } from "#domain/shared/bytes/functions/isBytes32Hex.function.ts";
import { sha256OfConcatenatedParts } from "#domain/shared/bytes/functions/sha256OfConcatenatedParts.function.ts";
import type { IBeaconRound } from "../interfaces/IBeaconRound.ts";

const signaturePattern = /^[0-9a-f]{96}$/u;

/**
 * Accepts an endpoint's parsed `/public/{round}` body only if it names the round asked for and its randomness is the
 * SHA-256 of its signature. Fields are read by name, because endpoints order them differently.
 */
export const parseBeaconRound = async (body: unknown, expectedRound: number): Promise<IBeaconRound | null> => {
    if (typeof body !== "object" || body === null) return null;
    const { round, signature, randomness } = body as Record<string, unknown>;
    if (round !== expectedRound || typeof signature !== "string" || !signaturePattern.test(signature)) return null;
    if (typeof randomness !== "string" || !isBytes32Hex(randomness)) return null;
    const signatureHash = encodeHex(await sha256OfConcatenatedParts(decodeHex(signature)));
    return signatureHash === randomness ? { round, signature, randomness } : null;
};
