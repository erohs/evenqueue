import { parseInclusionProof } from "#domain/commitment/functions/parseInclusionProof.function.ts";
import { parsePublishedLeaves } from "#domain/commitment/functions/parsePublishedLeaves.function.ts";
import { toBytes32Hex } from "#domain/shared/bytes/functions/toBytes32Hex.function.ts";
import vectors from "#tests/vectors/waitlistCommitment.json" with { type: "json" };
import type { IWaitlistCommitmentVectors } from "../interfaces/IWaitlistCommitmentVectors.ts";
import { parsedOrFail } from "./parsedOrFail.function.ts";

/** The shared commitment vectors, read through the same parsers as any downloaded draw. */
export const waitlistCommitmentVectors = (): IWaitlistCommitmentVectors => ({
    drawId: toBytes32Hex(vectors.drawId),
    places: vectors.places.map((place) => ({
        viewKey: place.viewKey,
        placeTag: toBytes32Hex(place.placeTag),
        publicDrawId: toBytes32Hex(place.publicDrawId),
    })),
    leaves: parsedOrFail(parsePublishedLeaves(vectors.leaves)),
    leafHashesInOrder: vectors.leafHashesInOrder,
    committedWaitlistRoot: toBytes32Hex(vectors.committedWaitlistRoot),
    inclusionProof: {
        publicDrawId: toBytes32Hex(vectors.inclusionProof.publicDrawId),
        steps: parsedOrFail(parseInclusionProof(vectors.inclusionProof.steps)),
    },
});
