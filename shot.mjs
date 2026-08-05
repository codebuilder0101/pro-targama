import { chromium } from "playwright";

const BASE = "http://localhost:8080";
const browser = await chromium.launch({ channel: "chrome" });

async function shot(path, out, opts = {}) {
  const page = await browser.newPage({
    viewport: opts.viewport || { width: 1200, height: 820 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  if (opts.before) await opts.before(page);
  await page.screenshot({ path: out, fullPage: !!opts.fullPage });
  await page.close();
  console.log("saved", out);
}

// 1. Home
await shot("/", "docs/screenshots/01-home.png");

// 2. Live translation (types text, waits for OpenAI result)
await shot("/", "docs/screenshots/02-traducao-funcionando.png", {
  async before(page) {
    const source = page.locator("textarea").first();
    const target = page.locator("textarea").nth(1);
    await source.fill("Hello, how are you today?");
    await target.filter({ hasText: "" });
    await page.waitForFunction(
      () => {
        const tas = document.querySelectorAll("textarea");
        return tas[1] && tas[1].value.trim().length > 0;
      },
      { timeout: 20000 },
    );
    await page.waitForTimeout(500);
  },
});

// 3. Sobre
await shot("/sobre", "docs/screenshots/03-sobre.png", { fullPage: true });

// 4. Favoritos
await shot("/favoritos", "docs/screenshots/04-favoritos.png");

// 5. Privacidade
await shot("/privacidade", "docs/screenshots/05-privacidade.png", { fullPage: true });

// 6. Termos
await shot("/termos", "docs/screenshots/06-termos.png", { fullPage: true });

// 7. Mobile home (responsivo)
await shot("/", "docs/screenshots/07-mobile-home.png", {
  viewport: { width: 390, height: 780 },
});

await browser.close();
console.log("done");
