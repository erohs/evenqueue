import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";

/**
 * The windows' lower bounds keep buyers with intermittent internet access in with a fair chance: shorter windows
 * favour whoever is online all the time. An offer window is at most five days, the shortest time a card payment
 * stays valid. A checkpoint every hour or less often keeps the scheduled jobs within a free plan.
 */
export const dropSettingLimits = {
    unitCount: { least: 1, most: 50_000 },
    entrantCap: { least: 1, most: 50_000 },
    entryWindow: { least: durationOfHours(24), most: durationOfHours(14 * 24) },
    offerWindow: { least: durationOfHours(12), most: durationOfHours(5 * 24) },
    checkpointInterval: { least: durationOfHours(1), most: durationOfHours(24) },
    embedOrigins: { most: 10 },
    pageTextCharacters: { most: 2_000 },
    resultsRetentionDays: { least: 90, most: 365 },
} as const;
