/**
 * How a setting may change once buyers can see the drop. fixed-once-open: never, because buyers joined on those terms
 * and the commitment's digest covers them; after-notice: after a public notice period; unit-count: at once, logged
 * publicly; anytime: at once, recorded only in the vendor's private audit. In a draft, everything changes at once.
 */
export type SettingChangeClass = "fixed-once-open" | "after-notice" | "unit-count" | "anytime";
