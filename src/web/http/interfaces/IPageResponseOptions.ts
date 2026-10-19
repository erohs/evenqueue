export interface IPageResponseOptions {
    readonly status?: number;
    /** Sites allowed to frame this page; only the entry pages pass the drop's list. */
    readonly embedOrigins?: readonly string[];
    /** Asks the browser to drop its cached pages, so codes shown earlier cannot be reached with the back button. */
    readonly shouldClearCache?: boolean;
    readonly retryAfterSeconds?: number;
    /** The methods a path accepts, for a 405. */
    readonly allowedMethods?: readonly string[];
}
