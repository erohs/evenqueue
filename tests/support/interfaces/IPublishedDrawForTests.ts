import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import type { IIssuedCredentials } from "#domain/credentials/interfaces/IIssuedCredentials.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

export interface IPublishedDrawForTests {
    readonly drawId: Bytes32Hex;
    readonly buyers: readonly IIssuedCredentials[];
    readonly leaves: readonly IWaitlistLeaf[];
}
