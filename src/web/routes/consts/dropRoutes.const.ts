import { cancelNewCodes } from "../functions/cancelNewCodes.function.ts";
import { enterWaitlist } from "../functions/enterWaitlist.function.ts";
import { finishVisit } from "../functions/finishVisit.function.ts";
import { leaveWaitlist } from "../functions/leaveWaitlist.function.ts";
import { requestNewCodes } from "../functions/requestNewCodes.function.ts";
import { showDropPage } from "../functions/showDropPage.function.ts";
import { showScheduleCalendar } from "../functions/showScheduleCalendar.function.ts";
import { showRecoveryFormPage } from "../functions/showRecoveryFormPage.function.ts";
import { showStatusFormPage } from "../functions/showStatusFormPage.function.ts";
import { showStatusPage } from "../functions/showStatusPage.function.ts";
import type { IDropRoute } from "../interfaces/IDropRoute.ts";

/** Every buyer page. Anything carrying a code is a POST, so codes never appear in an address or a server log. */
export const dropRoutes: readonly IDropRoute[] = [
    { path: "", onGet: showDropPage },
    { path: "/enter", onPost: enterWaitlist },
    { path: "/status", onGet: showStatusFormPage, onPost: showStatusPage },
    { path: "/leave", onPost: leaveWaitlist },
    { path: "/recover", onGet: showRecoveryFormPage, onPost: requestNewCodes },
    { path: "/recover/cancel", onPost: cancelNewCodes },
    { path: "/finish", onPost: finishVisit },
    { path: "/calendar", onGet: showScheduleCalendar },
];
