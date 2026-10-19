import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { dropForTests } from "#tests/support/functions/dropForTests.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { openDrop } from "../functions/openDrop.function.ts";

const openedAt = toEpochMilliseconds(1_770_000_000_000);

describe("Using openDrop, when a draft opens", () => {
    test("then it should record when entry opened", () => {
        assert.deepEqual(openDrop(dropForTests("draft"), openedAt), { ...dropForTests("open"), openedAt });
    });
});

describe("Using openDrop, when the drop is already open", () => {
    test("then it should refuse to open it again", () => {
        assert.throws(() => openDrop(dropForTests("open"), openedAt), RangeError);
    });
});
