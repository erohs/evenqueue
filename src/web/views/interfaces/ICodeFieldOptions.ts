export interface ICodeFieldOptions {
    readonly name: string;
    readonly label: string;
    readonly hint: string;
    /** Shown above the field and linked to it, after a code was not recognised. */
    readonly error: string | null;
    /** What the buyer typed, given back so they can correct it rather than start again. */
    readonly typed: string;
    /** For password managers: the entry code is a password for this waitlist; other codes leave it unset. */
    readonly autocomplete: "current-password" | null;
}
