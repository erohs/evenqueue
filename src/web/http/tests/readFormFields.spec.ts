import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { readFormFields } from "../functions/readFormFields.function.ts";

const formRequest = (body: string | null, contentType = "application/x-www-form-urlencoded"): Request =>
    new Request("http://localhost/d/x", { method: "POST", headers: { "content-type": contentType }, body });

describe("Using readFormFields, when an ordinary form is sent", () => {
    test("then it should give its fields", async () => {
        assert.equal((await readFormFields(formRequest("code=ABCD-EFGH&confirm=yes")))?.get("code"), "ABCD-EFGH");
    });
});

describe("Using readFormFields, when a button-only form is sent with no body", () => {
    test("then it should give no fields rather than refuse it", async () => {
        assert.equal((await readFormFields(formRequest(null)))?.size, 0);
    });
});

describe("Using readFormFields, when the body is larger than any buyer form", () => {
    test("then it should refuse it without parsing it", async () => {
        assert.equal(await readFormFields(formRequest(`code=${"A".repeat(10_000)}`)), null);
    });
});

describe("Using readFormFields, when the body is not a plain HTML form", () => {
    test("then it should refuse JSON and multipart bodies", async () => {
        assert.deepEqual(
            [
                await readFormFields(formRequest("{}", "application/json")),
                await readFormFields(formRequest("x", "multipart/form-data")),
            ],
            [null, null],
        );
    });
});
