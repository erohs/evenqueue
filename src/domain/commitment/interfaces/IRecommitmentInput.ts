import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { ICommitment } from "./ICommitment.ts";

export interface IRecommitmentInput {
    readonly previous: ICommitment;
    readonly voidsSoFar: number;
    readonly newBeaconRound: number;
    readonly recommittedAt: EpochMilliseconds;
    readonly reason: string;
    readonly attestedBy: readonly string[];
}
