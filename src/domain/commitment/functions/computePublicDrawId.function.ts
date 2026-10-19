import { assertBytes32Hex } from "#domain/shared/bytes/functions/assertBytes32Hex.function.ts";
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { sha256OfConcatenatedParts } from "#domain/shared/bytes/functions/sha256OfConcatenatedParts.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { commitmentDerivationTags } from "../consts/commitmentDerivationTags.const.ts";

/** SHA-256(tag ‖ placeTag ‖ drawId): new every draw, so published lists cannot be linked across draws. */
export const computePublicDrawId = async (placeTag: Bytes32Hex, drawId: Bytes32Hex): Promise<Bytes32Hex> => {
    assertBytes32Hex(placeTag, "placeTag");
    assertBytes32Hex(drawId, "drawId");
    return encodeHex(
        await sha256OfConcatenatedParts(commitmentDerivationTags.publicDrawId, decodeHex(placeTag), decodeHex(drawId)),
    );
};
