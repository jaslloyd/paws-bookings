import { chromium } from "playwright";

const URL =
  "http://localhost:5173/s/jason-south-dublin?service=svc-boarding&pets=1&start=2026-08-03&end=2026-08-05";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2, // retina-crisp
});

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1200); // let images + calendar settle

await page.screenshot({ path: "docs/sitter-page.png" });
await browser.close();
console.log("saved docs/sitter-page.png");
