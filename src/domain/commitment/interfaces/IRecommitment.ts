import type { ICommitment } from "./ICommitment.ts";
import type { IDrawVoid } from "./IDrawVoid.ts";

export interface IRecommitment {
    readonly drawVoid: IDrawVoid;
    readonly commitment: ICommitment;
}
