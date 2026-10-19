import { haltAttestationsNeededToVoid } from "#domain/beacon/consts/haltAttestationsNeededToVoid.const.ts";
import { maximumVoidsPerDraw } from "#domain/beacon/consts/maximumVoidsPerDraw.const.ts";
import type { IRecommitment } from "../interfaces/IRecommitment.ts";
import type { IRecommitmentInput } from "../interfaces/IRecommitmentInput.ts";
import { assertBeaconRoundIsFarEnoughAhead } from "./assertBeaconRoundIsFarEnoughAhead.function.ts";

/** Voids the named round and names a later one. Everything else, the root included, stays exactly as committed. */
export const recommitAfterBeaconHalt = (input: IRecommitmentInput): IRecommitment => {
    const { previous } = input;
    const attestedBy = [...new Set(input.attestedBy)];
    if (attestedBy.length < haltAttestationsNeededToVoid) {
        throw new RangeError("a void needs halt attestations from two independent parties");
    }
    if (input.voidsSoFar >= maximumVoidsPerDraw) throw new RangeError("this draw has no voids left");
    if (input.newBeaconRound <= previous.beaconRound) throw new RangeError("a recommitment must name a later round");
    assertBeaconRoundIsFarEnoughAhead(input.newBeaconRound, input.recommittedAt);
    return {
        drawVoid: {
            drawId: previous.drawId,
            voidedBeaconRound: previous.beaconRound,
            reason: input.reason,
            attestedBy,
        },
        commitment: {
            ...previous,
            beaconRound: input.newBeaconRound,
            committedAt: input.recommittedAt,
            replacesBeaconRound: previous.beaconRound,
        },
    };
};
