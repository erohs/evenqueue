import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { sha256Hex } from "#domain/shared/bytes/functions/sha256Hex.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { commitmentDerivationTags } from "../consts/commitmentDerivationTags.const.ts";

/** SHA-256(tag ‖ placeTag ‖ drawId): new every draw, so published lists cannot be linked across draws. */
export const computePublicDrawId = (placeTag: Bytes32Hex, drawId: Bytes32Hex): Promise<Bytes32Hex> =>
    sha256Hex(commitmentDerivationTags.publicDrawId, decodeHex(placeTag), decodeHex(drawId));
