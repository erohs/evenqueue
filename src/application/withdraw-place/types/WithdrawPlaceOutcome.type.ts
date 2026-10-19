/** needs-entry-code: a view key was given, which can only read status. */
export type WithdrawPlaceOutcome = "withdrawn" | "needs-entry-code" | "code-not-recognised" | "drop-not-found";
