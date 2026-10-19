import type { BeaconRound } from "../types/BeaconRound.type.ts";

export const isBeaconRound = (value: unknown): value is BeaconRound =>
    Number.isSafeInteger(value) && (value as number) >= 1;
