import { quicknetBeaconChain } from "#domain/beacon/consts/quicknetBeaconChain.const.ts";
import { assertBytes32Hex } from "#domain/shared/bytes/functions/assertBytes32Hex.function.ts";
import { minimumBeaconLead } from "../consts/minimumBeaconLead.const.ts";
import { protocolVersion } from "../consts/protocolVersion.const.ts";
import type { ICommitment } from "../interfaces/ICommitment.ts";
import type { ICommitmentInput } from "../interfaces/ICommitmentInput.ts";
import { assertBeaconRoundIsFarEnoughAhead } from "./assertBeaconRoundIsFarEnoughAhead.function.ts";
import { computeWaitlistRoot } from "./computeWaitlistRoot.function.ts";
import { countPlacesByPriority } from "./countPlacesByPriority.function.ts";

export const createCommitment = async (input: ICommitmentInput): Promise<ICommitment> => {
    assertBytes32Hex(input.drawId, "drawId");
    assertBytes32Hex(input.settingsDigest, "settingsDigest");
    assertBeaconRoundIsFarEnoughAhead(input.beaconRound, input.committedAt);
    return {
        drawId: input.drawId,
        protocolVersion,
        committedWaitlistRoot: await computeWaitlistRoot(input.leaves),
        placeCount: input.leaves.length,
        placeCountsByPriority: countPlacesByPriority(input.leaves),
        settingsDigest: input.settingsDigest,
        beaconChainHash: quicknetBeaconChain.chainHash,
        beaconRound: input.beaconRound,
        minimumBeaconLead,
        committedAt: input.committedAt,
        replacesBeaconRound: null,
    };
};
