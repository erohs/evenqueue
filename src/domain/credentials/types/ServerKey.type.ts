import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";

/** A secret key held by the server: the entry key or a series key, at least 256 bits. Made only by toServerKey. */
export type ServerKey = ByteArray & { readonly brand: "ServerKey" };
