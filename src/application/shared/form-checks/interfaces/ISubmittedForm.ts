/** The guard fields of a submitted form, exactly as they arrived. */
export interface ISubmittedForm {
    readonly formToken: unknown;
    /** A field people never see or fill; it must arrive empty or not at all. */
    readonly honeypot: unknown;
}
