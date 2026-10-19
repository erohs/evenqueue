import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";

/**
 * What a vendor sets for one drop. Payment settings arrive with redemption. dropSettingChangeClasses says which of
 * these can change once buyers can see the drop, and how.
 */
export interface IDropSettings {
    readonly unitCount: Count;
    /** Joining stops once this many places are on the waitlist. */
    readonly entrantCap: Count;
    /** Uptime during which new buyers can join, from the moment the drop opens. */
    readonly entryWindow: DurationMilliseconds;
    /** Uptime a buyer has to claim an offer. */
    readonly offerWindow: DurationMilliseconds;
    /** Offers go out at the draw and then once per interval. */
    readonly checkpointInterval: DurationMilliseconds;
    /** Sites allowed to show the entry form in a frame, as `https://` origins. */
    readonly embedOrigins: readonly string[];
    /** The vendor's own words on the drop page, shown as plain text. */
    readonly pageText: string;
    /** One content-free post per public event, never per buyer; null for none. It holds a secret, so it is never logged. */
    readonly announcementWebhookUrl: string | null;
    /** How long the published draw stays downloadable after the drop, for anyone to check. */
    readonly resultsRetentionDays: Count;
}
