/** Codes in groups of four, and the phrase as words separated by spaces, ready to show. */
export interface ICodesForDisplay {
    readonly entryCode: string;
    readonly typedPhrase: string;
    readonly viewKey: string;
    readonly recoveryCode: string;
}
