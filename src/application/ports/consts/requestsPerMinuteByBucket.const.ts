import type { RateLimitBucket } from "../types/RateLimitBucket.type.ts";

/**
 * Per client address. Sized for a shared building, a hostel or a library behind one address, so they protect the
 * free plan's budget without locking out neighbours. Guessing a code is stopped by its length, not by these.
 */
export const requestsPerMinuteByBucket: Readonly<Record<RateLimitBucket, number>> = {
    joining: 60,
    "code-lookup": 30,
};
