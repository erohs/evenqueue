import { assertPositiveWholeNumber } from "#domain/shared/validation/functions/assertPositiveWholeNumber.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { quicknetBeaconChain } from "../consts/quicknetBeaconChain.const.ts";
import type { IBeaconChain } from "../interfaces/IBeaconChain.ts";

/** When the chain publishes a round. Round 1 is at genesis. */
export const beaconRoundTime = (round: number, chain: IBeaconChain = quicknetBeaconChain): EpochMilliseconds => {
    assertPositiveWholeNumber(round, "round");
    return chain.genesisTime + (round - 1) * chain.period;
};
