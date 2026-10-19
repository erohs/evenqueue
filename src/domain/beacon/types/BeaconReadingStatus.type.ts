/**
 * agreed: two or more endpoints returned the same round and none disagreed; single-endpoint: only one answered;
 * endpoints-disagree: answers differ, so nothing is used until the verifier's signature check settles it;
 * unavailable: no endpoint answered.
 */
export type BeaconReadingStatus = "agreed" | "single-endpoint" | "endpoints-disagree" | "unavailable";
