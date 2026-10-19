import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IDrawEntrant } from "./IDrawEntrant.ts";

export interface IRankedEntrant extends IDrawEntrant {
    readonly priority: number;
    readonly randomTiebreakKey: Bytes32Hex;
}
