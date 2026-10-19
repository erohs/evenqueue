import type { BeaconRound } from "#domain/beacon/types/BeaconRound.type.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { ICommitment } from "./ICommitment.ts";

export interface IRecommitmentInput {
    readonly previous: ICommitment;
    readonly voidsSoFar: Count;
    readonly newBeaconRound: BeaconRound;
    readonly recommittedAt: EpochMilliseconds;
    readonly reason: string;
    readonly attestedBy: readonly string[];
}
