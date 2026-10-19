/** Where a change is written: the public log, which buyers and the verifier read, or the vendor's private audit. */
export type SettingChangeRecord = "public-log" | "private-audit";
