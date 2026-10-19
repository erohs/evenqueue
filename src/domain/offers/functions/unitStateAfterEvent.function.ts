import { unitTransitions } from "../consts/unitTransitions.const.ts";
import type { UnitEvent } from "../types/UnitEvent.type.ts";
import type { UnitState } from "../types/UnitState.type.ts";

/** Throws on an event the unit's state does not allow, so a bad transition can never be stored. */
export const unitStateAfterEvent = (state: UnitState, event: UnitEvent): UnitState => {
    const transition = unitTransitions[event];
    if (!transition.from.includes(state)) throw new RangeError(`a ${state} unit cannot take the event ${event}`);
    return transition.to;
};
