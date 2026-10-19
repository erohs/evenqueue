import type { ByteArray } from "../types/ByteArray.type.ts";
import { concatenateBytes } from "./concatenateBytes.function.ts";

/** Uses the platform's WebCrypto. */
export const hmacSha256OfConcatenatedParts = async (
    key: ByteArray,
    ...parts: readonly Uint8Array[]
): Promise<ByteArray> => {
    const importedKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    return new Uint8Array(await crypto.subtle.sign("HMAC", importedKey, concatenateBytes(...parts)));
};
