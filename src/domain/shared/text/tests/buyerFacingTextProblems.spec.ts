import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buyerFacingTextProblems } from "../functions/buyerFacingTextProblems.function.ts";

describe("Using buyerFacingTextProblems, when text is longer than allowed", () => {
    test("then it should count characters, not UTF-16 units", () => {
        assert.deepEqual(
            [buyerFacingTextProblems("label", "🌱🌱", 2, false), buyerFacingTextProblems("label", "🌱🌱🌱", 2, false)],
            [[], ["label is longer than 2 characters"]],
        );
    });
});

describe("Using buyerFacingTextProblems, when text holds a lone surrogate", () => {
    test("then it should refuse it before any other check", () => {
        assert.deepEqual(buyerFacingTextProblems("label", "\uD800", 60, false), ["label is not well-formed text"]);
    });
});

describe("Using buyerFacingTextProblems, when text holds a control character other than a line break", () => {
    test("then it should refuse it even where line breaks are allowed", () => {
        assert.deepEqual(buyerFacingTextProblems("pageText", "a\u0000b", 60, true), [
            "pageText holds control characters",
        ]);
    });
});
