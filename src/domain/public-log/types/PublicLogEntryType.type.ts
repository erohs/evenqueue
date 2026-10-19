/** Every public event of a drop. None of them carries a place id, so the log identifies nobody. */
export type PublicLogEntryType =
    | "commitment"
    | "beacon-round"
    | "draw-order"
    | "draw-void"
    | "service-gap"
    | "settings-change"
    | "recovery"
    | "unit-counts";
