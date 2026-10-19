import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { html } from "../functions/html.function.ts";

describe("Using html, when a value holds markup", () => {
    test("then it should escape it, so vendor text can never become a tag or close an attribute", () => {
        const value = `<script>alert("x")</script> & 'quotes'`;
        assert.equal(
            html`<p title="${value}">${value}</p>`.safeHtml,
            `<p title="&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;quotes&#39;">&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;quotes&#39;</p>`,
        );
    });
});

describe("Using html, when a value is markup made by html", () => {
    test("then it should keep it as markup", () => {
        assert.equal(html`<div>${html`<b>${"<i>"}</b>`}</div>`.safeHtml, "<div><b>&lt;i&gt;</b></div>");
    });
});

describe("Using html, when values are lists, numbers, null or false", () => {
    test("then it should join lists, write numbers and leave out null and false", () => {
        assert.equal(html`${["a", html`<br />`, 3]}${null}${false}`.safeHtml, "a<br />3");
    });
});

describe("Using html, when a plain object pretends to be markup", () => {
    test("then it should refuse it, so markup cannot be forged", () => {
        const pretending = { safeHtml: "<script></script>" };
        assert.throws(() => html`${pretending}`, TypeError);
    });
});
