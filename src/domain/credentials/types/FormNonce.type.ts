import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";

/** The random value in one signed entry form, at least 128 bits. Made only by toFormNonce. */
export type FormNonce = ByteArray & { readonly brand: "FormNonce" };
