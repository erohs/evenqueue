import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { qrCodePath } from "../functions/qrCodePath.function.ts";

describe("Using qrCodePath, for rows with runs of dark modules", () => {
    test("then it should draw one rectangle per run, offset by the quiet zone", () => {
        const isDark = [
            [true, true, false, true],
            [false, false, false, false],
            [false, true, true, true],
        ];
        assert.equal(qrCodePath(isDark, 4), "M4 4h2v1h-2zM7 4h1v1h-1zM5 6h3v1h-3z");
    });
});
