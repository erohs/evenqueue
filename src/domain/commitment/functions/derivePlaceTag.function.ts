import { sha256Hex } from "#domain/shared/bytes/functions/sha256Hex.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { commitmentDerivationTags } from "../consts/commitmentDerivationTags.const.ts";

/**
 * From the view key, so both the entry code and the view key can find the place in a published draw. Replaced with
 * the codes on recovery. Never published: only the per-draw ids made from it are.
 */
export const derivePlaceTag = (viewKey: ByteArray): Promise<Bytes32Hex> =>
    sha256Hex(commitmentDerivationTags.placeTag, viewKey);
