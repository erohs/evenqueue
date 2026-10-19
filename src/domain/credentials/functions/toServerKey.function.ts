import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import { minimumServerKeyByteLength } from "../consts/minimumServerKeyByteLength.const.ts";
import type { ServerKey } from "../types/ServerKey.type.ts";

export const toServerKey = (bytes: ByteArray): ServerKey => {
    if (bytes.length < minimumServerKeyByteLength) throw new RangeError("a server key must be at least 32 bytes");
    return bytes as ServerKey;
};
