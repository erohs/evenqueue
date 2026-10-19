import type { ByteArray } from "../types/ByteArray.type.ts";
import { concatenateBytes } from "./concatenateBytes.function.ts";

/** Uses the platform's WebCrypto, which compares in constant time. */
export const verifyHmacSha256 = async (
    key: ByteArray,
    signature: ByteArray,
    ...parts: readonly Uint8Array[]
): Promise<boolean> => {
    const importedKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    return crypto.subtle.verify("HMAC", importedKey, signature, concatenateBytes(...parts));
};
