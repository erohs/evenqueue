import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IPlaceToCommit } from "../interfaces/IPlaceToCommit.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";
import { computePublicDrawId } from "./computePublicDrawId.function.ts";

/**
 * The only place a draw's leaves are made: each place's priority under the rule, fixed now, and its public id for
 * this draw, from its tag. The draw then orders exactly these leaves, as the public verifier does.
 */
export const leavesForCommitment = (
    rule: IAllocationRule,
    places: readonly IPlaceToCommit[],
    drawId: Bytes32Hex,
): Promise<IWaitlistLeaf[]> =>
    Promise.all(
        places.map(async ({ place, placeTag }) => ({
            publicDrawId: await computePublicDrawId(placeTag, drawId),
            priority: rule.priorityOf(place),
        })),
    );
