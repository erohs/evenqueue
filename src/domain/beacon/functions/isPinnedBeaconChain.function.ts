import { isRecord } from "#domain/shared/parsing/functions/isRecord.function.ts";
import { quicknetBeaconChain } from "../consts/quicknetBeaconChain.const.ts";
import type { IBeaconChain } from "../interfaces/IBeaconChain.ts";

/** Whether an endpoint's parsed `/info` body describes exactly the pinned chain. */
export const isPinnedBeaconChain = (chainInfo: unknown, chain: IBeaconChain = quicknetBeaconChain): boolean =>
    isRecord(chainInfo) &&
    chainInfo["hash"] === chain.chainHash &&
    chainInfo["schemeID"] === chain.schemeId &&
    chainInfo["public_key"] === chain.publicKey &&
    chainInfo["genesis_time"] === chain.genesisTime / 1_000 &&
    chainInfo["period"] === chain.period / 1_000;
