import { requestsPerMinuteByBucket } from "#application/ports/consts/requestsPerMinuteByBucket.const.ts";
import type { IClock } from "#application/ports/interfaces/IClock.ts";
import type { IRateLimiter } from "#application/ports/interfaces/IRateLimiter.ts";

const minute = 60_000;

/** Fixed one-minute windows per bucket and address, as the platform binding counts them. */
export const createInMemoryRateLimiter = (clock: IClock): IRateLimiter => {
    const counts = new Map<string, number>();
    return {
        isWithinLimit: async (bucket, clientAddress) => {
            const key = `${bucket} ${clientAddress} ${Math.floor(clock.now() / minute)}`;
            const count = (counts.get(key) ?? 0) + 1;
            counts.set(key, count);
            return count <= requestsPerMinuteByBucket[bucket];
        },
    };
};
