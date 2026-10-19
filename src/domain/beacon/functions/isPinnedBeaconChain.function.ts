import { quicknetBeaconChain } from "../consts/quicknetBeaconChain.const.ts";
import type { IBeaconChain } from "../interfaces/IBeaconChain.ts";

/** Whether an endpoint's parsed `/info` body describes exactly the pinned chain. */
export const isPinnedBeaconChain = (chainInfo: unknown, chain: IBeaconChain = quicknetBeaconChain): boolean => {
    if (typeof chainInfo !== "object" || chainInfo === null) return false;
    const info = chainInfo as Record<string, unknown>;
    return (
        info["hash"] === chain.chainHash &&
        info["schemeID"] === chain.schemeId &&
        info["public_key"] === chain.publicKey &&
        info["genesis_time"] === chain.genesisTime / 1_000 &&
        info["period"] === chain.period / 1_000
    );
};
