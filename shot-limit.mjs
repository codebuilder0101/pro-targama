import { chromium } from "playwright";

const BASE = "http://localhost:8080";
const browser = await chromium.launch({ channel: "chrome" });

async function withUsage(count, out) {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.evaluate((c) => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const key = `${d.getFullYear()}-${m}-${day}`;
    window.localStorage.setItem("targama_daily_usage", JSON.stringify({ day: key, count: c }));
  }, count);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: out });
  await page.close();
  console.log("saved", out);
}

await withUsage(7, "docs/screenshots/14-limite-contador.png");
await withUsage(10, "docs/screenshots/15-limite-atingido.png");

await browser.close();
console.log("done");
