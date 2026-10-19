import type { RateLimitBucket } from "../types/RateLimitBucket.type.ts";

/**
 * Counts requests per client address, as the platform reports it (never a forwarded-for header). It may be loose,
 * per location and eventually consistent: it protects the request budget, not the codes.
 */
export interface IRateLimiter {
    isWithinLimit: (bucket: RateLimitBucket, clientAddress: string) => Promise<boolean>;
}
