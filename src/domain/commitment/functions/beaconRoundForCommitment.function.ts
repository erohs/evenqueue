import { firstBeaconRoundAtOrAfter } from "#domain/beacon/functions/firstBeaconRoundAtOrAfter.function.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { defaultAnchorHorizon } from "../consts/defaultAnchorHorizon.const.ts";

/** The round to name: the first one after the anchor horizon. */
export const beaconRoundForCommitment = (
    committedAt: EpochMilliseconds,
    anchorHorizon: DurationMilliseconds = defaultAnchorHorizon,
): number => firstBeaconRoundAtOrAfter(committedAt + anchorHorizon);
