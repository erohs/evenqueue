import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { dropForTests } from "#tests/support/functions/dropForTests.function.ts";
import { createServiceGap } from "#domain/schedule/functions/createServiceGap.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { isDropOpenForEntry } from "../functions/isDropOpenForEntry.function.ts";

const hour = 3_600_000;
const open = dropForTests("open");
const openedAt = open.openedAt ?? assert.fail();
const at = (hours: number) => toEpochMilliseconds(openedAt + hours * hour);

describe("Using isDropOpenForEntry, during the entry window", () => {
    test("then it should be open from the moment it opens until just before the window ends", () => {
        assert.deepEqual([isDropOpenForEntry(open, [], at(0)), isDropOpenForEntry(open, [], at(71.99))], [true, true]);
    });
});

describe("Using isDropOpenForEntry, once the entry window's uptime has run out", () => {
    test("then it should be closed, even before the timer marks the drop closed", () => {
        assert.equal(isDropOpenForEntry(open, [], at(72)), false);
    });
});

describe("Using isDropOpenForEntry, when an outage happened during the window", () => {
    test("then it should stay open for as long again as the outage lasted", () => {
        const outage = createServiceGap(at(10), at(14));
        assert.equal(isDropOpenForEntry(open, [outage], at(75)), true);
    });
});

describe("Using isDropOpenForEntry, for a drop that is not open", () => {
    test("then it should be closed whatever the time", () => {
        for (const state of ["draft", "closed", "committed", "offering", "cancelled"] as const) {
            assert.equal(isDropOpenForEntry(dropForTests(state), [], at(1)), false, state);
        }
    });
});
