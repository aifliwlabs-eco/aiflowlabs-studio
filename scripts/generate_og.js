// scripts/generate_og.js
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const htmlPath = path.resolve(__dirname, "..", "og-banner.html");
  const outDir = path.resolve(__dirname, "..", "assets", "img");
  const outPath = path.join(outDir, "og-banner.png");

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    // На Windows/WSL/CI может потребоваться headless: 'new'
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  // Загружаем локальный файл
  await page.goto("file://" + htmlPath.replace(/\\/g, "/"), { waitUntil: "networkidle0" });

  // Скриншот области 1200x630
  await page.screenshot({ path: outPath, type: "png" });

  await browser.close();
  console.log("Saved:", outPath);
})();
