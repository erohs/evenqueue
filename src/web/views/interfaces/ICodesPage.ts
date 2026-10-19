import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import type { ICodesForDisplay } from "./ICodesForDisplay.ts";

export interface ICodesPage {
    readonly dropId: Bytes32Hex;
    readonly waitlistLabel: string;
    readonly heading: string;
    /** What the codes are for, and from when they work. */
    readonly introduction: ISafeHtml;
    readonly codes: ICodesForDisplay;
}
