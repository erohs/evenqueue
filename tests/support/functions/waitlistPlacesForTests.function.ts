import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";

/** All in entry window 0, with any counters overridden. */
export const waitlistPlacesForTests = (
    label: string,
    count: number,
    counters: Partial<Record<"drawsEntered" | "offersReceived" | "entryWindowNumber", number>> = {},
): IWaitlistPlace[] =>
    Array.from({ length: count }, (_, i) => {
        const place = createWaitlistPlace(
            deterministicBytes32Hex(`${label}-${i}`),
            toCount(counters.entryWindowNumber ?? 0),
        );
        return {
            ...place,
            drawsEntered: toCount(counters.drawsEntered ?? 0),
            offersReceived: toCount(counters.offersReceived ?? 0),
        };
    });
