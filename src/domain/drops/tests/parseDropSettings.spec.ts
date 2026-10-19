import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { defaultDropSettings } from "../functions/defaultDropSettings.function.ts";
import { parseDropSettings } from "../functions/parseDropSettings.function.ts";

const hour = 3_600_000;
const defaults = defaultDropSettings("priority-after-losses");
const problemsWith = (change: Record<string, unknown>): readonly string[] => {
    const result = parseDropSettings({ ...defaults, ...change });
    return result.isValid ? [] : result.problems;
};

describe("Using parseDropSettings, when a vendor submits extra fields", () => {
    test("then it should keep only the known settings", () => {
        assert.deepEqual(parseDropSettings({ ...defaults, isPaidPriority: true }), { isValid: true, value: defaults });
    });
});

describe("Using parseDropSettings, when an entry window is shorter than buyers with intermittent access need", () => {
    test("then it should refuse anything under 24 hours", () => {
        assert.deepEqual(problemsWith({ entryWindow: 23 * hour }), ["entryWindow is missing or invalid"]);
    });
});

describe("Using parseDropSettings, when an offer window is shorter than buyers with intermittent access need", () => {
    test("then it should refuse anything under 12 hours", () => {
        assert.deepEqual(problemsWith({ offerWindow: 11 * hour, checkpointInterval: hour }), [
            "offerWindow is missing or invalid",
        ]);
    });
});

describe("Using parseDropSettings, when the offer window outlasts a card payment", () => {
    test("then it should refuse anything over five days", () => {
        assert.deepEqual(problemsWith({ offerWindow: 121 * hour }), ["offerWindow is missing or invalid"]);
    });
});

describe("Using parseDropSettings, when checkpoints are further apart than the offer window", () => {
    test("then it should refuse, because an offer could lapse before the next checkpoint", () => {
        assert.equal(problemsWith({ offerWindow: 12 * hour, checkpointInterval: 13 * hour }).length, 1);
    });
});

describe("Using parseDropSettings, when an embed origin is not exactly an https origin", () => {
    test("then it should refuse a path, plain http, a trailing slash or a repeat", () => {
        const lists = [
            ["https://shop.example/page"],
            ["http://shop.example"],
            ["https://shop.example/"],
            ["https://shop.example", "https://shop.example"],
        ];
        for (const embedOrigins of lists) {
            assert.deepEqual(problemsWith({ embedOrigins }), ["embedOrigins is missing or invalid"]);
        }
    });
});

describe("Using parseDropSettings, when there are more embed origins than allowed", () => {
    test("then it should refuse the list", () => {
        const embedOrigins = Array.from({ length: 11 }, (_, i) => `https://shop${i}.example`);
        assert.deepEqual(problemsWith({ embedOrigins }), ["embedOrigins is missing or invalid"]);
    });
});

describe("Using parseDropSettings, when the webhook address carries a password", () => {
    test("then it should refuse it", () => {
        assert.deepEqual(problemsWith({ announcementWebhookUrl: "https://user:secret@hooks.example/post" }), [
            "announcementWebhookUrl is missing or invalid",
        ]);
    });
});

describe("Using parseDropSettings, when the page text uses a gambling word", () => {
    test("then it should name the word", () => {
        assert.deepEqual(problemsWith({ pageText: "Every WINNER gets a tote." }), [
            "pageText uses words kept off buyer pages: winner",
        ]);
    });
});

describe("Using parseDropSettings, when the page text has several paragraphs", () => {
    test("then it should accept its line breaks", () => {
        assert.deepEqual(problemsWith({ pageText: "Restock in spring.\r\n\r\nOne per household." }), []);
    });
});

describe("Using parseDropSettings, when results would be kept for less than the audit period", () => {
    test("then it should refuse fewer than 90 days", () => {
        assert.deepEqual(problemsWith({ resultsRetentionDays: 89 }), ["resultsRetentionDays is missing or invalid"]);
    });
});
