import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import type { IPublicDrawInputs } from "#domain/draw/interfaces/IPublicDrawInputs.ts";
import type { IPublicLogEntry } from "#domain/public-log/interfaces/IPublicLogEntry.ts";
import type { ServerKey } from "#domain/credentials/types/ServerKey.type.ts";
import type { IMerkleTree } from "#domain/commitment/interfaces/IMerkleTree.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

export interface IBenchmarkFixtures {
    readonly entryKey: ServerKey;
    readonly waitlistKey: ServerKey;
    readonly waitlistId: Bytes32Hex;
    /** Signed with the entry key, for a form sent ten seconds later. */
    readonly formToken: string;
    readonly formSentAt: EpochMilliseconds;
    readonly leaves10k: readonly IWaitlistLeaf[];
    readonly leaves50k: readonly IWaitlistLeaf[];
    readonly tree50k: IMerkleTree;
    readonly drawInputs: IPublicDrawInputs;
    readonly log1k: readonly IPublicLogEntry[];
}
