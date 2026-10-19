import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import { orderEntrantsForDraw } from "#domain/draw/functions/orderEntrantsForDraw.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import { entrantInDraw } from "./entrantInDraw.function.ts";
import { publicDrawInputsFor } from "./publicDrawInputsFor.function.ts";

export const placeIdsOfferedFirst = async (
    rule: IAllocationRule,
    places: readonly IWaitlistPlace[],
    unitsOffered: number,
    drawLabel: string,
): Promise<Bytes32Hex[]> => {
    const entrants = places.map((place) => entrantInDraw(place, drawLabel));
    const order = await orderEntrantsForDraw(rule, entrants, publicDrawInputsFor(drawLabel));
    return order.slice(0, unitsOffered).map((ranked) => ranked.place.placeId);
};
