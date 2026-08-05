import { chromium } from "playwright";

const BASE = "http://localhost:8080";
const browser = await chromium.launch({ channel: "chrome" });

async function newPage(h = 1000) {
  return browser.newPage({
    viewport: { width: 1200, height: h },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
}

async function simple(path, out, h) {
  const page = await newPage(h);
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: out });
  await page.close();
  console.log("saved", out);
}

// Cadastro (now with Google button)
await simple("/cadastro", "docs/screenshots/08-cadastro.png", 1080);
// Recuperar senha
await simple("/recuperar-senha", "docs/screenshots/11-recuperar-senha.png", 820);
// Perfil
await simple("/perfil", "docs/screenshots/12-perfil.png", 1000);

// Perfil with delete confirmation dialog open
const page = await newPage(1000);
await page.goto(`${BASE}/perfil`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.getByRole("button", { name: /Apagar minha conta/ }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "docs/screenshots/13-perfil-confirmar-exclusao.png" });
await page.close();
console.log("saved dialog");

await browser.close();
console.log("done");
