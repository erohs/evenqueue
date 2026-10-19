/**
 * draft: being set up, not public; open: buyers can join; closed: entry has ended and the commitment is being built;
 * committed: published, waiting for the named beacon round; drawing: the round has arrived and the order is being
 * worked out; offering: offers go out at each checkpoint; finished: no unit is left to offer; cancelled: stopped
 * before it was committed.
 */
export type DropState = "draft" | "open" | "closed" | "committed" | "drawing" | "offering" | "finished" | "cancelled";
