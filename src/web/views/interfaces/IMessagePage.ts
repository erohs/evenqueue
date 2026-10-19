import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";

export interface IMessagePage {
    readonly heading: string;
    readonly message: ISafeHtml;
    readonly waitlistLabel: string | null;
    /** Adds a link back to the drop page. */
    readonly dropId: Bytes32Hex | null;
}
