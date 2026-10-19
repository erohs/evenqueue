import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import { minimumFormNonceByteLength } from "../consts/minimumFormNonceByteLength.const.ts";
import type { FormNonce } from "../types/FormNonce.type.ts";

/** Every form served needs a fresh one: two buyers sent the same form, say from a cached page, would share codes. */
export const toFormNonce = (bytes: ByteArray): FormNonce => {
    if (bytes.length < minimumFormNonceByteLength) throw new RangeError("a form nonce must be at least 16 bytes");
    return bytes as FormNonce;
};
