// probe: does addInitScript run for setContent in this playwright-core build?
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "src", "node_modules", "playwright-core"));
const fs = require("fs");

(async () => {
  const chromeExe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
  const browser = await chromium.launch(fs.existsSync(chromeExe) ? { executablePath: chromeExe } : { channel: "chrome" });
  const page = await browser.newPage();
  await page.addInitScript(() => { window.__probe = "init-ran"; });
  await page.setContent("<html><body><p>hi</p></body></html>", { waitUntil: "load" });
  const probe = await page.evaluate(() => [typeof window.__probe, window.__probe]);
  console.log("setContent init:", JSON.stringify(probe), "url:", page.url());
  await page.goto("data:text/html,<p>data</p>");
  const probe2 = await page.evaluate(() => [typeof window.__probe, window.__probe]);
  console.log("goto data init:", JSON.stringify(probe2), "url:", page.url());
  await browser.close();
})().catch((e) => { console.error("PROBE ERROR:", e); process.exit(1); });
