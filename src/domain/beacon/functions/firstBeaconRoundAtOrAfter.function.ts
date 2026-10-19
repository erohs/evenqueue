import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { quicknetBeaconChain } from "../consts/quicknetBeaconChain.const.ts";
import type { IBeaconChain } from "../interfaces/IBeaconChain.ts";

export const firstBeaconRoundAtOrAfter = (time: EpochMilliseconds, chain: IBeaconChain = quicknetBeaconChain): number =>
    Math.max(1, Math.ceil((time - chain.genesisTime) / chain.period) + 1);
