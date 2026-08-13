/**
 * Headless smoke test: boots the production build and drives the core
 * builder flow (create draft -> add schedule -> node appears). Exists because
 * three separate regressions passed typecheck+lint+unit tests and only
 * surfaced in a real browser (module-eval TDZ cycles, a hung service layer).
 */
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = 4173;
const URL = `http://localhost:${PORT}/`;

const fail = (message) => {
  console.error(`SMOKE FAIL: ${message}`);
  process.exitCode = 1;
};

const waitForServer = async (url, timeoutMs = 30_000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Server at ${url} did not come up within ${timeoutMs}ms`);
};

const server = spawn("npx", ["vite", "preview", "--port", `${PORT}`, "--strictPort"], {
  stdio: "ignore",
  detached: true,
});

try {
  await waitForServer(URL);

  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    // Public-RPC 502s/timeouts are environmental noise, not app defects.
    if (message.type() === "error" && !message.text().includes("Failed to load resource")) {
      consoleErrors.push(message.text());
    }
  });

  await page.goto(URL, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForTimeout(1_500);

  // Shell renders
  await page.getByText("Create draft").waitFor({ timeout: 10_000 });

  // Wallet stream delivers (Connect appears once wallets emit)
  await page.getByText("Connect", { exact: true }).waitFor({ timeout: 10_000 });

  // Core builder flow (Create draft is always visible now)
  await page.getByText("Create draft").click();
  await page.getByText("Schedule", { exact: true }).last().click();
  await page.waitForTimeout(1_000);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  const nodes = await page.locator(".react-flow__node").count();
  if (nodes < 2) fail(`expected >=2 nodes after adding a schedule, saw ${nodes}`);

  if (pageErrors.length) fail(`page errors: ${pageErrors.join(" | ")}`);
  if (consoleErrors.length) fail(`console errors: ${consoleErrors.join(" | ")}`);

  await browser.close();

  if (!process.exitCode) console.log(`SMOKE OK: ${nodes} nodes, no page/console errors`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
} finally {
  if (server.pid) process.kill(-server.pid, "SIGTERM");
}
