import type { ICodeFormPage } from "./ICodeFormPage.ts";

export interface IRecoveryFormPage extends ICodeFormPage {
    readonly formToken: string;
    /** Set when the previous form had to be confirmed again. */
    readonly shouldAskToConfirm: boolean;
}
