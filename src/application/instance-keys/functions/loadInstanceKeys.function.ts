import { deriveServerKey } from "#domain/credentials/functions/deriveServerKey.function.ts";
import { toServerKey } from "#domain/credentials/functions/toServerKey.function.ts";
import type { IInstanceKeys } from "#application/ports/interfaces/IInstanceKeys.ts";
import type { IKeyStore } from "#application/ports/interfaces/IKeyStore.ts";
import type { IRandomSource } from "#application/ports/interfaces/IRandomSource.ts";
import { rootKeyByteLength } from "../consts/rootKeyByteLength.const.ts";

const noSalt = new Uint8Array(0);

/**
 * Reads the root key, or makes and stores one on the first start, so a vendor never types a key. It reads the key
 * back after storing it, so two isolates starting together settle on whichever key the store kept.
 */
export const loadInstanceKeys = async (keyStore: IKeyStore, random: IRandomSource): Promise<IInstanceKeys> => {
    if ((await keyStore.readRootKey()) === null) await keyStore.storeRootKey(random.bytes(rootKeyByteLength));
    const rootKey = toServerKey((await keyStore.readRootKey()) ?? noSalt);
    return {
        entryCodesKey: await deriveServerKey(rootKey, "entry-codes", noSalt),
        formGuardKey: await deriveServerKey(rootKey, "form-guard", noSalt),
        waitlistKey: async (waitlistId) => {
            const salt = await keyStore.readWaitlistKeySalt(waitlistId);
            if (salt === null) throw new Error(`waitlist ${waitlistId} has no key salt; restore the key backup`);
            return deriveServerKey(rootKey, "waitlist", salt);
        },
    };
};
