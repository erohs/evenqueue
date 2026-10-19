import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWebContext } from "./IWebContext.ts";

/** A request to one drop's pages, with the drop id already read from the path. */
export interface IDropRequest extends IWebContext {
    readonly request: Request;
    readonly dropId: Bytes32Hex;
}
