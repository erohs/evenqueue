import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { renderScheduleCalendar } from "../functions/renderScheduleCalendar.function.ts";

const schedule = {
    dropId: deterministicBytes32Hex("drop"),
    waitlistLabel: "Seeds, bulbs; and \\ more",
    entryClosesAt: toEpochMilliseconds(Date.UTC(2026, 9, 21, 14, 0, 0)),
    writtenAt: toEpochMilliseconds(Date.UTC(2026, 9, 19, 9, 30, 5)),
};
const calendar = renderScheduleCalendar(schedule);
const lines = calendar.split("\r\n");
const unfoldedLines = calendar.replaceAll("\r\n ", "").split("\r\n");

describe("Using renderScheduleCalendar, for a drop open for entry", () => {
    test("then it should give the closing time in UTC", () => {
        assert.ok(lines.includes("DTSTART:20261021T140000Z"));
    });

    test("then it should escape the label's commas, semicolons and backslashes", () => {
        assert.ok(calendar.replaceAll("\r\n ", "").includes("SUMMARY:Joining closes: Seeds\\, bulbs\\; and \\\\ more"));
    });

    test("then it should end every line with CRLF", () => {
        assert.ok(calendar.endsWith("\r\n") && !calendar.replaceAll("\r\n", "").includes("\n"));
    });

    test("then it should fold every line to 75 octets or fewer", () => {
        assert.deepEqual(
            lines.filter((line) => new TextEncoder().encode(line).length > 75),
            [],
        );
    });

    test("then it should give the event an id that stays the same for the drop", () => {
        assert.ok(unfoldedLines.includes(`UID:entry-closes-${schedule.dropId}@evenqueue`));
    });
});

describe("Using renderScheduleCalendar, for a long label in a script of multi-byte characters", () => {
    test("then folding should never split a character", () => {
        const folded = renderScheduleCalendar({ ...schedule, waitlistLabel: "Ångström-fröer ".repeat(10) });
        assert.ok(folded.replaceAll("\r\n ", "").includes("Ångström-fröer ".repeat(10).trimEnd()));
    });
});
