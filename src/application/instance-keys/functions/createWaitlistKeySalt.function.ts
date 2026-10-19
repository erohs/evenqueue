import type { IKeyStore } from "#application/ports/interfaces/IKeyStore.ts";
import type { IRandomSource } from "#application/ports/interfaces/IRandomSource.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { waitlistKeySaltByteLength } from "../consts/waitlistKeySaltByteLength.const.ts";

/** Made once, with the waitlist. Deleting it later is what makes the waitlist's recovery checks unmatchable. */
export const createWaitlistKeySalt = (
    keyStore: IKeyStore,
    random: IRandomSource,
    waitlistId: Bytes32Hex,
): Promise<void> => keyStore.storeWaitlistKeySalt(waitlistId, random.bytes(waitlistKeySaltByteLength));
