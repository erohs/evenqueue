import { expect, test } from "@playwright/test";
import { shortestFormFillMilliseconds } from "#tests/support/consts/shortestFormFillMilliseconds.const.ts";

test.describe("Using the codes page printed from a browser in the dark theme", () => {
    test.use({ colorScheme: "dark" });

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForTimeout(shortestFormFillMilliseconds);
        await page.getByRole("button", { name: "Join the waitlist" }).click();
        await page.getByRole("heading", { level: 1, name: "You're on the waitlist" }).waitFor();
        await page.emulateMedia({ media: "print" });
    });

    test("then the codes should print dark on light paper", async ({ page }) => {
        const card = page.locator(".code-card").first();
        expect(await card.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(255, 255, 255)");
    });

    test("then the buttons should be left off the sheet", async ({ page }) => {
        await expect(page.getByRole("button", { name: "I've saved my codes" })).toBeHidden();
    });
});
