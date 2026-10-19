/** "Tue 21 Oct 2026, 14:00": a fixed, unambiguous form; the vendor's own time zone is added with the admin pages. */
export const utcTimeFormat = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
});
