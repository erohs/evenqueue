import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/serverKeys.json" with { type: "json" };
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { deriveServerKey } from "../functions/deriveServerKey.function.ts";
import { toServerKey } from "../functions/toServerKey.function.ts";
import type { ServerKeyPurpose } from "../types/ServerKeyPurpose.type.ts";

const rootKey = toServerKey(decodeHex(vectors.rootKey));

describe("Using deriveServerKey, for the independently computed vectors", () => {
    test("then it should reproduce every key, so an upgrade never breaks stored recovery checks", async () => {
        for (const vector of vectors.cases) {
            const key = await deriveServerKey(rootKey, vector.purpose as ServerKeyPurpose, decodeHex(vector.salt));
            assert.equal(encodeHex(key), vector.key);
        }
    });
});
