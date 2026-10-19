import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import type { IPublicDrawInputs } from "#domain/draw/interfaces/IPublicDrawInputs.ts";
import type { IPublicLogEntry } from "#domain/public-log/interfaces/IPublicLogEntry.ts";
import type { ServerKey } from "#domain/credentials/types/ServerKey.type.ts";
import type { IMerkleTree } from "#domain/commitment/interfaces/IMerkleTree.ts";

export interface IBenchmarkFixtures {
    readonly entryKey: ServerKey;
    readonly seriesKey: ServerKey;
    readonly leaves10k: readonly IWaitlistLeaf[];
    readonly leaves50k: readonly IWaitlistLeaf[];
    readonly tree50k: IMerkleTree;
    readonly drawInputs: IPublicDrawInputs;
    readonly log1k: readonly IPublicLogEntry[];
}
