import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** A path under a drop. Codes never go in a path or query: they travel only in form bodies. */
export const dropPath = (dropId: Bytes32Hex, rest = ""): string => `/d/${dropId}${rest}`;
