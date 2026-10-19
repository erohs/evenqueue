/** Only the entry code in force can cancel, so a stolen recovery code cannot quietly take a place. */
export type CancelRecoveryOutcome =
    "cancelled" | "nothing-to-cancel" | "needs-entry-code" | "code-not-recognised" | "drop-not-found";
