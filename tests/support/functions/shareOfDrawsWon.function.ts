import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import { placeIdsOfferedFirst } from "./placeIdsOfferedFirst.function.ts";

/** For each place, the share of independent draws in which it was offered a unit. */
export const shareOfDrawsWon = async (
    rule: IAllocationRule,
    places: readonly IWaitlistPlace[],
    unitsOffered: number,
    drawCount = 300,
): Promise<Map<Bytes32Hex, number>> => {
    const shares = new Map<Bytes32Hex, number>();
    for (let draw = 0; draw < drawCount; draw++) {
        for (const placeId of await placeIdsOfferedFirst(rule, places, unitsOffered, `draw-${draw}`)) {
            shares.set(placeId, (shares.get(placeId) ?? 0) + 1 / drawCount);
        }
    }
    return shares;
};
