/**
 * out-of-sequence: an entry is missing, extra or moved; broken-link: an entry does not point at the one before;
 * altered: an entry's content no longer matches its hash; time-went-backwards: recorded earlier than the entry before.
 */
export type LogProblemKind = "out-of-sequence" | "broken-link" | "altered" | "time-went-backwards";
