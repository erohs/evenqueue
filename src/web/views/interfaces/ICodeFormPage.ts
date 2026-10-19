import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** A page with one code field, shown first empty and again with an error after a code was not recognised. */
export interface ICodeFormPage {
    readonly dropId: Bytes32Hex;
    readonly waitlistLabel: string;
    readonly typed: string;
    readonly error: string | null;
}
