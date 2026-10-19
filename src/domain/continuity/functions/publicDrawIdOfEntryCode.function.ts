import { computePublicDrawId } from "#domain/commitment/functions/computePublicDrawId.function.ts";
import { derivePlaceTag } from "#domain/commitment/functions/derivePlaceTag.function.ts";
import { deriveViewKey } from "#domain/credentials/functions/deriveViewKey.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

export const publicDrawIdOfEntryCode = async (entrySecret: ByteArray, drawId: Bytes32Hex): Promise<Bytes32Hex> =>
    computePublicDrawId(await derivePlaceTag(await deriveViewKey(entrySecret)), drawId);
