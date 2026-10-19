import type { IWaitlist } from "#domain/waitlist/interfaces/IWaitlist.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";

export const waitlistForTests = (): IWaitlist => ({
    waitlistId: deterministicBytes32Hex("waitlist"),
    allocationRuleId: "priority-after-losses",
    shouldForgetPlacesAfterEachDrop: false,
    label: "Spring restock",
});
