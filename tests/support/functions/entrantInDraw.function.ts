import type { IDrawEntrant } from "#domain/draw/interfaces/IDrawEntrant.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";

/** The public draw id differs per draw, so it cannot be linked across draws. */
export const entrantInDraw = (place: IWaitlistPlace, drawLabel: string): IDrawEntrant => ({
    place,
    publicDrawId: deterministicBytes32Hex(`${place.placeId}|${drawLabel}`),
});
