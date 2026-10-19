import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { visitEveryBuyerPage } from "#tests/support/functions/visitEveryBuyerPage.function.ts";

const wcag22AaTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`Using axe on every buyer page, in the ${colorScheme} theme`, () => {
        test.use({ colorScheme });

        test("then no page should break a WCAG 2.2 AA rule axe can check", async ({ page }, testInfo) => {
            const violations: string[] = [];
            await visitEveryBuyerPage(page, async (name) => {
                const results = await new AxeBuilder({ page }).withTags(wcag22AaTags).analyze();
                violations.push(...results.violations.map((violation) => `${name}: ${violation.id}`));
                const screenshotPath = testInfo.outputPath(`${name.replaceAll(" ", "-")}-${colorScheme}.png`);
                await page.screenshot({ path: screenshotPath, fullPage: true });
            });
            expect(violations).toEqual([]);
        });
    });
}
