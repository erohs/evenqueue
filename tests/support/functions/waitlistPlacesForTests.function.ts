import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";

/** All in entry window 0 unless overridden. */
export const waitlistPlacesForTests = (
    label: string,
    count: number,
    overrides: Partial<IWaitlistPlace> = {},
): IWaitlistPlace[] =>
    Array.from({ length: count }, (_, i) => ({
        ...createWaitlistPlace(deterministicBytes32Hex(`${label}-${i}`), 0),
        ...overrides,
    }));
