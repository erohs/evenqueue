import type { BeaconRound } from "../types/BeaconRound.type.ts";
import { isBeaconRound } from "./isBeaconRound.function.ts";

export const toBeaconRound = (value: number): BeaconRound => {
    if (!isBeaconRound(value)) throw new RangeError(`${value} is not a beacon round`);
    return value;
};
