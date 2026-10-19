import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import { decodeCrockfordBase32 } from "./decodeCrockfordBase32.function.ts";
import { normaliseTypedCode } from "./normaliseTypedCode.function.ts";

/** The bytes of a code as a buyer typed it, or null if it cannot be a code of that length. */
export const readTypedCode = (typed: string, byteLength: number): ByteArray | null =>
    decodeCrockfordBase32(normaliseTypedCode(typed), byteLength);
