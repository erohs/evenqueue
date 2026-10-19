import type { ByteArray } from "../types/ByteArray.type.ts";
import { concatenateBytes } from "./concatenateBytes.function.ts";

/** Uses the platform's WebCrypto. */
export const sha256OfConcatenatedParts = async (...parts: readonly Uint8Array[]): Promise<ByteArray> =>
    new Uint8Array(await crypto.subtle.digest("SHA-256", concatenateBytes(...parts)));
