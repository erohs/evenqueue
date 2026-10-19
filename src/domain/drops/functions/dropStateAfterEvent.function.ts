import { dropTransitions } from "../consts/dropTransitions.const.ts";
import type { DropEvent } from "../types/DropEvent.type.ts";
import type { DropState } from "../types/DropState.type.ts";

/** Throws on an event the drop's state does not allow, so a bad transition can never be stored. */
export const dropStateAfterEvent = (state: DropState, event: DropEvent): DropState => {
    const transition = dropTransitions[event];
    if (!transition.from.includes(state)) throw new RangeError(`a ${state} drop cannot take the event ${event}`);
    return transition.to;
};
