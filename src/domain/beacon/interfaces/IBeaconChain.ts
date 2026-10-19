import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

/** A drand chain, pinned: an endpoint is used only if it reports exactly these values. */
export interface IBeaconChain {
    readonly chainHash: string;
    readonly schemeId: string;
    readonly publicKey: string;
    readonly genesisTime: EpochMilliseconds;
    readonly period: DurationMilliseconds;
}
