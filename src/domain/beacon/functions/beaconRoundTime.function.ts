import { addDuration } from "#domain/shared/time/functions/addDuration.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { quicknetBeaconChain } from "../consts/quicknetBeaconChain.const.ts";
import type { IBeaconChain } from "../interfaces/IBeaconChain.ts";
import type { BeaconRound } from "../types/BeaconRound.type.ts";

/** When the chain publishes a round. Round 1 is at genesis. */
export const beaconRoundTime = (round: BeaconRound, chain: IBeaconChain = quicknetBeaconChain): EpochMilliseconds =>
    addDuration(chain.genesisTime, chain.period, round - 1);
