import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { ServerKey } from "../types/ServerKey.type.ts";
import type { ServerKeyPurpose } from "../types/ServerKeyPurpose.type.ts";
import { toServerKey } from "./toServerKey.function.ts";

/**
 * HKDF-SHA-256 (RFC 5869) through WebCrypto, with the info `evenqueue/server-key/<purpose>/v1`. Every key comes from
 * the one root key, so backing up the root and the waitlists' salts backs up every key. Deleting a waitlist's salt
 * makes its recovery checks unmatchable for good.
 */
export const deriveServerKey = async (
    rootKey: ServerKey,
    purpose: ServerKeyPurpose,
    salt: ByteArray,
): Promise<ServerKey> => {
    const keyMaterial = await crypto.subtle.importKey("raw", rootKey, "HKDF", false, ["deriveBits"]);
    const info = new TextEncoder().encode(`evenqueue/server-key/${purpose}/v1`);
    const bits = await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, keyMaterial, 256);
    return toServerKey(new Uint8Array(bits));
};
