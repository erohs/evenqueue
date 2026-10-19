import type { ICodeCard } from "./ICodeCard.ts";
import type { ICodesForDisplay } from "./ICodesForDisplay.ts";

export interface ICodeCardDescription extends Omit<ICodeCard, "code"> {
    readonly codeShown: keyof ICodesForDisplay;
}
