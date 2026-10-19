import type { DropState } from "../types/DropState.type.ts";

export interface IDropTransition {
    readonly from: readonly DropState[];
    readonly to: DropState;
}
