import type { IScheduleCalendar } from "../interfaces/IScheduleCalendar.ts";
import { calendarTime } from "./calendarTime.function.ts";
import { escapeCalendarText } from "./escapeCalendarText.function.ts";
import { foldCalendarLine } from "./foldCalendarLine.function.ts";

/**
 * An RFC 5545 calendar of the drop's public times: for now, when joining closes. The event's id stays the same for a
 * drop, so importing the file again updates the event rather than adding a second one.
 */
export const renderScheduleCalendar = (schedule: IScheduleCalendar): string => {
    const closing =
        schedule.entryClosesAt === null
            ? []
            : [
                  "BEGIN:VEVENT",
                  `UID:entry-closes-${schedule.dropId}@evenqueue`,
                  `DTSTAMP:${calendarTime(schedule.writtenAt)}`,
                  `DTSTART:${calendarTime(schedule.entryClosesAt)}`,
                  "DURATION:PT15M",
                  `SUMMARY:${escapeCalendarText(`Joining closes: ${schedule.waitlistLabel}`)}`,
                  "DESCRIPTION:Joining the waitlist closes at this time. Joining early gives no advantage.",
                  "TRANSP:TRANSPARENT",
                  "END:VEVENT",
              ];
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Evenqueue//Waitlist schedule//EN",
        "METHOD:PUBLISH",
        ...closing,
        "END:VCALENDAR",
    ];
    return lines.map(foldCalendarLine).join("\r\n") + "\r\n";
};
