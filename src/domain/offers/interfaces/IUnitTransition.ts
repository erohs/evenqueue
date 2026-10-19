import type { UnitState } from "../types/UnitState.type.ts";

export interface IUnitTransition {
    readonly from: readonly UnitState[];
    readonly to: UnitState;
}
