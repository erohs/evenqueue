import { assertWholeNumber } from "#domain/shared/validation/functions/assertWholeNumber.function.ts";

/** Four bytes, signed, big-endian: the join-order line uses negative priorities. */
export const encodePriority = (priority: number): Uint8Array => {
    assertWholeNumber(priority, "priority");
    if (priority < -(2 ** 31) || priority >= 2 ** 31) throw new RangeError("priority must fit in 32 signed bits");
    const bytes = new Uint8Array(4);
    new DataView(bytes.buffer).setInt32(0, priority);
    return bytes;
};
