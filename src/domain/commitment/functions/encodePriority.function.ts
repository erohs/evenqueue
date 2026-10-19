import type { Priority } from "#domain/allocation-rules/types/Priority.type.ts";

/** Four bytes, signed, big-endian: the join-order line uses negative priorities. */
export const encodePriority = (priority: Priority): Uint8Array => {
    const bytes = new Uint8Array(4);
    new DataView(bytes.buffer).setInt32(0, priority);
    return bytes;
};
