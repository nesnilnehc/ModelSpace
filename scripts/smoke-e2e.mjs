#!/usr/bin/env node
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function createStaticServer(rootDir) {
  return createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || "/", "http://localhost");
      let pathname = decodeURIComponent(requestUrl.pathname);
      if (pathname === "/") pathname = "/index.html";

      const normalized = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
      const targetPath = path.join(rootDir, normalized);
      if (!targetPath.startsWith(rootDir)) {
        res.writeHead(403).end("Forbidden");
        return;
      }

      const fileBuffer = await readFile(targetPath);
      const ext = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(fileBuffer);
    } catch (error) {
      if (error?.code === "ENOENT") {
        res.writeHead(404).end("Not found");
        return;
      }
      res.writeHead(500).end("Server error");
    }
  });
}

async function startServer() {
  const server = createStaticServer(projectRoot);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to resolve local server address");
  }
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
}

async function run() {
  const { server, baseUrl } = await startServer();
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=angle", "--ignore-gpu-blocklist"]
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    await page.goto(`${baseUrl}/cognitive-model-3d.html`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector("#appTitle", { timeout: 15000 });

    const initialTitle = await page.locator("#appTitle").innerText();
    assert.ok(initialTitle.includes("认知模型"), "Expected initial zh title");

    await page.click('[data-ui-lang="en"]');
    await page.waitForFunction(() => {
      return document.getElementById("appTitle")?.textContent?.includes("Cognitive");
    }, { timeout: 10000 });

    await page.click("#modelMultiClearBtn");
    await page.waitForFunction(() => {
      const text = document.getElementById("modelMultiSummary")?.textContent || "";
      return /Selected:\s*0\s+models/i.test(text);
    }, { timeout: 10000 });

    await page.fill("#modelMultiSearchInput", "MECE");
    await page.click("#modelMultiSelectVisibleBtn");
    await page.waitForFunction(() => {
      const text = document.getElementById("modelMultiSummary")?.textContent || "";
      return /Selected:\s*1\s+model/i.test(text);
    }, { timeout: 10000 });

    const currentUrl = page.url();
    assert.ok(currentUrl.includes("lang=en"), "Expected URL to keep language state");
    assert.ok(currentUrl.includes("models=MECE"), "Expected URL to keep model selection state");

    const replayPage = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    await replayPage.goto(currentUrl, { waitUntil: "networkidle", timeout: 30000 });
    await replayPage.waitForFunction(() => {
      const title = document.getElementById("appTitle")?.textContent || "";
      const summary = document.getElementById("modelMultiSummary")?.textContent || "";
      return title.includes("Cognitive") && /Selected:\s*1\s+model/i.test(summary);
    }, { timeout: 10000 });
    await replayPage.close();

    const exportHookType = await page.evaluate(() => typeof window.__getPromoExportDataUrl);
    assert.equal(exportHookType, "function", "Expected export hook to exist");

    const dataUrl = await page.evaluate(async () => {
      return window.__getPromoExportDataUrl();
    });
    assert.ok(String(dataUrl).startsWith("data:image/png;base64,"), "Expected PNG export data URL");

    console.log("Smoke E2E passed.");
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

run().catch((error) => {
  const message = error?.message || String(error);
  if (/Executable doesn't exist|browserType\.launch/i.test(message)) {
    console.error("Playwright Chromium is not installed. Run: npx playwright install chromium");
  }
  console.error("Smoke E2E failed:", message);
  process.exit(1);
});
