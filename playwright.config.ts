import { defineConfig, devices } from "@playwright/test";

const port = 8788;

/** Browser checks of the buyer pages, against the in-memory development server, in every engine and on a phone. */
export default defineConfig({
    testDir: "tests/e2e",
    workers: 1,
    reporter: "list",
    use: { baseURL: `http://localhost:${port}` },
    webServer: {
        command: `node src/entry-points/dev-server/main.ts ${port}`,
        url: `http://localhost:${port}/`,
        reuseExistingServer: false,
    },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
        { name: "phone", use: { ...devices["Pixel 7"] } },
    ],
});
