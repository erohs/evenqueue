import { createHash } from "node:crypto";
import { toBytes32Hex } from "#domain/shared/bytes/functions/toBytes32Hex.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** Fixed ids, so the demo drop keeps the same address across restarts. */
export const developmentId = (label: string): Bytes32Hex =>
    toBytes32Hex(createHash("sha256").update(label).digest("hex"));
