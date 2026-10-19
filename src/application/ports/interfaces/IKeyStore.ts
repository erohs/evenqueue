import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** Where key material lives, outside the database, so a database export or backup never holds a key. */
export interface IKeyStore {
    readRootKey: () => Promise<ByteArray | null>;
    storeRootKey: (rootKey: ByteArray) => Promise<void>;
    readWaitlistKeySalt: (waitlistId: Bytes32Hex) => Promise<ByteArray | null>;
    storeWaitlistKeySalt: (waitlistId: Bytes32Hex, salt: ByteArray) => Promise<void>;
}
