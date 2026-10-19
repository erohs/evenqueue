import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import { leavesForCommitment } from "#domain/commitment/functions/leavesForCommitment.function.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import type { ICommittedDrawForTests } from "../interfaces/ICommittedDrawForTests.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";
import { publicDrawInputsFor } from "./publicDrawInputsFor.function.ts";

/** Commits places under a rule as a real close would, with a tag per place and a public id per draw. */
export const committedDrawForTests = async (
    rule: IAllocationRule,
    places: readonly IWaitlistPlace[],
    drawLabel: string,
): Promise<ICommittedDrawForTests> => {
    const drawId = deterministicBytes32Hex(`draw|${drawLabel}`);
    const placesToCommit = places.map((place) => ({
        place,
        placeTag: deterministicBytes32Hex(`tag|${place.placeId}`),
    }));
    const leaves = await leavesForCommitment(rule, placesToCommit, drawId);
    const placeIdByPublicDrawId = new Map(
        leaves.map((leaf, i) => [leaf.publicDrawId, places[i]?.placeId ?? leaf.publicDrawId]),
    );
    return { leaves, publicDrawInputs: publicDrawInputsFor(drawLabel), placeIdByPublicDrawId };
};
