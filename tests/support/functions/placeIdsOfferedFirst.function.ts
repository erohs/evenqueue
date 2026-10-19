import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import { orderLeavesForDraw } from "#domain/draw/functions/orderLeavesForDraw.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import { committedDrawForTests } from "./committedDrawForTests.function.ts";

export const placeIdsOfferedFirst = async (
    rule: IAllocationRule,
    places: readonly IWaitlistPlace[],
    unitsOffered: number,
    drawLabel: string,
): Promise<Bytes32Hex[]> => {
    const draw = await committedDrawForTests(rule, places, drawLabel);
    const order = await orderLeavesForDraw(draw.leaves, draw.publicDrawInputs);
    return order.slice(0, unitsOffered).flatMap((leaf) => draw.placeIdByPublicDrawId.get(leaf.publicDrawId) ?? []);
};
