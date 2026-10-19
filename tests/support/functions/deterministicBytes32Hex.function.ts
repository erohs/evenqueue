import { createHash } from "node:crypto";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** Made with Node's own crypto, so fixtures do not depend on the code under test. */
export const deterministicBytes32Hex = (label: string): Bytes32Hex => createHash("sha256").update(label).digest("hex");
