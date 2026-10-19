import type { FormNonce } from "#domain/credentials/types/FormNonce.type.ts";
import type { FormRefusalReason } from "./FormRefusalReason.type.ts";

export type FormCheck =
    | { readonly isAccepted: true; readonly nonce: FormNonce }
    | { readonly isAccepted: false; readonly reason: FormRefusalReason };
