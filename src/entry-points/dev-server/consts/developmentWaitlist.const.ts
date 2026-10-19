import type { IWaitlist } from "#domain/waitlist/interfaces/IWaitlist.ts";
import { developmentId } from "../functions/developmentId.function.ts";

export const developmentWaitlist: IWaitlist = {
    waitlistId: developmentId("development waitlist"),
    allocationRuleId: "priority-after-losses",
    shouldForgetPlacesAfterEachDrop: false,
    label: "Spring seed swap",
};
