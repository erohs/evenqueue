import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createSeededRandom } from "#tests/support/functions/createSeededRandom.function.ts";
import { randomBytes } from "#tests/support/functions/randomBytes.function.ts";
import { encodeCrockfordBase32 } from "#domain/credentials/functions/encodeCrockfordBase32.function.ts";
import { formatCodeForDisplay } from "#domain/credentials/functions/formatCodeForDisplay.function.ts";
import { readTypedCode } from "#domain/credentials/functions/readTypedCode.function.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";

const random = createSeededRandom(1);
const codes = Array.from({ length: 500 }, (_, i) => randomBytes(random, i % 2 === 0 ? 16 : 10));
const readBack = (typed: string, length: number): string => encodeHex(readTypedCode(typed, length) ?? new Uint8Array());

describe("Using buyer codes, for 500 random codes", () => {
    test("then every displayed code should read back as the same bytes", () => {
        assert.ok(codes.every((code) => readBack(formatCodeForDisplay(code), code.length) === encodeHex(code)));
    });

    test("then every code typed in lower case with spaces should read back the same", () => {
        const typed = (code: Uint8Array): string => formatCodeForDisplay(code).toLowerCase().replaceAll("-", " ");
        assert.ok(codes.every((code) => readBack(typed(code), code.length) === encodeHex(code)));
    });

    test("then changing any one character should never read back as the same code", () => {
        const isChangeNoticed = (code: Uint8Array): boolean => {
            const text = encodeCrockfordBase32(code);
            const position = Math.floor(random() * (text.length - 1));
            const swapped = text.charAt(position) === "A" ? "B" : "A";
            const changed = `${text.slice(0, position)}${swapped}${text.slice(position + 1)}`;
            return readBack(changed, code.length) !== encodeHex(code);
        };
        assert.ok(codes.every(isChangeNoticed));
    });
});
