/**
 * use: run the draw with this round; wait: keep fetching; wait-with-delay-notice: keep fetching and publish a delay
 * notice; void-and-recommit: a halt is attested, so name a later round; abandon: a halt is attested and no voids remain.
 */
export type BeaconAction = "use" | "wait" | "wait-with-delay-notice" | "void-and-recommit" | "abandon";
