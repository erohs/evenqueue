import type { IPublicDrawInputs } from "#domain/draw/interfaces/IPublicDrawInputs.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";

export const publicDrawInputsFor = (drawLabel: string): IPublicDrawInputs => ({
    beaconRandomness: deterministicBytes32Hex(`beacon-randomness|${drawLabel}`),
    committedWaitlistRoot: deterministicBytes32Hex(`waitlist-root|${drawLabel}`),
});
