import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { waitlistForTests } from "#tests/support/functions/waitlistForTests.function.ts";
import { parseWaitlist } from "../functions/parseWaitlist.function.ts";

const waitlist = waitlistForTests();
const problemsOf = (value: unknown): readonly string[] => {
    const result = parseWaitlist(value);
    return result.isValid ? [] : result.problems;
};

describe("Using parseWaitlist, when a waitlist is well formed", () => {
    test("then it should return it with only the known fields", () => {
        assert.deepEqual(parseWaitlist({ ...waitlist, vendorEmail: "x" }), { isValid: true, value: waitlist });
    });
});

describe("Using parseWaitlist, when places would be forgotten under a rule that carries them between drops", () => {
    test("then it should refuse, because buyers would silently lose their priority", () => {
        assert.deepEqual(problemsOf({ ...waitlist, shouldForgetPlacesAfterEachDrop: true }), [
            "places can be forgotten after each drop only under equal-chance-each-drop",
        ]);
    });
});

describe("Using parseWaitlist, when places are forgotten under equal-chance-each-drop", () => {
    test("then it should accept it", () => {
        const forgetting = {
            ...waitlist,
            allocationRuleId: "equal-chance-each-drop",
            shouldForgetPlacesAfterEachDrop: true,
        };
        assert.deepEqual(problemsOf(forgetting), []);
    });
});

describe("Using parseWaitlist, when the label is blank", () => {
    test("then it should refuse it", () => {
        assert.deepEqual(problemsOf({ ...waitlist, label: "   " }), ["label is empty"]);
    });
});

describe("Using parseWaitlist, when the label spans lines", () => {
    test("then it should refuse it, because it is printed on one line", () => {
        assert.deepEqual(problemsOf({ ...waitlist, label: "Spring\nrestock" }), ["label holds control characters"]);
    });
});
