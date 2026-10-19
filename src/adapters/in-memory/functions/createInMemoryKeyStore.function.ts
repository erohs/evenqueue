import type { IKeyStore } from "#application/ports/interfaces/IKeyStore.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** For tests and local runs: keys last only as long as the process. */
export const createInMemoryKeyStore = (): IKeyStore => {
    let rootKey: ByteArray | null = null;
    const salts = new Map<Bytes32Hex, ByteArray>();
    return {
        readRootKey: async () => rootKey,
        storeRootKey: async (key) => {
            rootKey = key;
        },
        readWaitlistKeySalt: async (waitlistId) => salts.get(waitlistId) ?? null,
        storeWaitlistKeySalt: async (waitlistId, salt) => {
            salts.set(waitlistId, salt);
        },
    };
};
