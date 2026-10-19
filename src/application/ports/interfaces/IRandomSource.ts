import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";

/** Cryptographically secure random bytes. */
export interface IRandomSource {
    bytes: (length: number) => ByteArray;
}
