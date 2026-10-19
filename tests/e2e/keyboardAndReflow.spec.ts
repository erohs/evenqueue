import { expect, test } from "@playwright/test";
import { shortestFormFillMilliseconds } from "#tests/support/consts/shortestFormFillMilliseconds.const.ts";
import { visitEveryBuyerPage } from "#tests/support/functions/visitEveryBuyerPage.function.ts";

test.describe("Using the keyboard alone on the drop page", () => {
    test("then the first Tab should show a skip link that moves to the content", async ({ page, browserName }) => {
        test.skip(
            browserName === "webkit",
            "Safari reaches links by keyboard only with a setting this engine can't turn on",
        );
        await page.goto("/");
        await page.keyboard.press("Tab");
        await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
        await expect(page.getByRole("link", { name: "Skip to content" })).toBeInViewport();
    });
});

test.describe("Using the keyboard alone to join from the drop page", () => {
    test("then Tab should reach the join button with a visible focus ring, and Enter should join", async ({ page }) => {
        await page.goto("/");
        const joinButton = page.getByRole("button", { name: "Join the waitlist" });
        for (
            let presses = 0;
            presses < 10 && !(await joinButton.evaluate((button) => button === document.activeElement));
            presses++
        ) {
            await page.keyboard.press("Tab");
        }
        expect(await joinButton.evaluate((button) => getComputedStyle(button).outlineStyle)).not.toBe("none");
        await page.waitForTimeout(shortestFormFillMilliseconds);
        await page.keyboard.press("Enter");
        await expect(page.getByRole("heading", { level: 1 })).toHaveText("You're on the waitlist");
    });
});

test.describe("Using every buyer page 320 CSS pixels wide, as on a small phone or at 400% zoom", () => {
    test.use({ viewport: { width: 320, height: 640 } });

    test("then no page should scroll sideways", async ({ page }) => {
        const scrollingSideways: string[] = [];
        await visitEveryBuyerPage(page, async (name) => {
            const isWider = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
            if (isWider) scrollingSideways.push(name);
        });
        expect(scrollingSideways).toEqual([]);
    });
});
