import { showSchedule } from "#application/show-schedule/functions/showSchedule.function.ts";
import { renderScheduleCalendar } from "#web/calendar/functions/renderScheduleCalendar.function.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";
import type { DropRouteHandler } from "../types/DropRouteHandler.type.ts";

/** Public and the same for everyone, so it may be cached briefly; it carries no code and no form token. */
export const showScheduleCalendar: DropRouteHandler = async ({ services, dropId }) => {
    const schedule = await showSchedule(services, dropId);
    if (schedule.kind === "drop-not-found") return commonResponses.notFound();
    const calendar = renderScheduleCalendar({
        dropId,
        waitlistLabel: schedule.waitlist.label,
        entryClosesAt: schedule.entryClosesAt,
        writtenAt: services.clock.now(),
    });
    return new Response(calendar, {
        headers: {
            "content-type": "text/calendar; charset=utf-8",
            "content-disposition": 'attachment; filename="waitlist.ics"',
            "cache-control": "public, max-age=300",
            "x-content-type-options": "nosniff",
        },
    });
};
