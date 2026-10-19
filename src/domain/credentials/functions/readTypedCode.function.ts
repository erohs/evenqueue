import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import { maximumTypedCodeLength } from "../consts/maximumTypedCodeLength.const.ts";
import { decodeCrockfordBase32 } from "./decodeCrockfordBase32.function.ts";
import { normaliseTypedCode } from "./normaliseTypedCode.function.ts";

/** Parses a code as a buyer typed or pasted it: its bytes, or null if it cannot be a code of that length. */
export const readTypedCode = (typed: string, byteLength: number): ByteArray | null =>
    typed.length > maximumTypedCodeLength ? null : decodeCrockfordBase32(normaliseTypedCode(typed), byteLength);
