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
    const checks = [];
    const mark = (name) => {
      checks.push(name);
      console.log(`[check] ${name}`);
    };

    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    await page.goto(`${baseUrl}/cognitive-atlas.html`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector("#appTitle", { timeout: 15000 });

    const initialTitle = await page.locator("#appTitle").innerText();
    assert.ok(/cognitive atlas/i.test(initialTitle), "Expected branded zh title");
    mark("initial-zh-title");

    const linkChecked = await page.isChecked("#linkToggle");
    assert.equal(linkChecked, false, "Expected links to be disabled by default");
    mark("default-link-toggle-off");

    await page.click('[data-ui-lang="en"]');
    await page.waitForFunction(() => {
      return document.getElementById("appTitle")?.textContent?.includes("Cognitive");
    }, { timeout: 10000 });
    mark("language-switch-en");

    await page.click("#modelMultiClearBtn");
    await page.waitForFunction(() => {
      const input = document.getElementById("modelMultiSearchInput");
      return input && input.value === "";
    }, { timeout: 10000 });
    mark("model-clear");

    await page.fill("#modelMultiSearchInput", "MECE");
    await page.waitForFunction(() => {
      const input = document.getElementById("modelMultiSearchInput");
      return input && input.value === "MECE";
    }, { timeout: 5000 });
    await page.waitForTimeout(200);
    mark("model-search");

    await page.waitForTimeout(500);
    const currentUrl = page.url();
    const urlParams = new URL(currentUrl).searchParams;
    const langVal = urlParams.get("lang") ?? urlParams.get("l");
    assert.ok(langVal === "en", `Expected URL to keep language state, got lang=${langVal}, url=${currentUrl}`);
    const qVal = urlParams.get("q");
    assert.ok(qVal === "MECE" || qVal === "mece", "Expected URL to keep search keyword");
    mark("url-sync");

    const replayPage = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    await replayPage.goto(currentUrl, { waitUntil: "networkidle", timeout: 30000 });
    await replayPage.waitForFunction(() => {
      const title = document.getElementById("appTitle")?.textContent || "";
      const input = document.getElementById("modelMultiSearchInput");
      const val = (input?.value || "").toLowerCase();
      return title.includes("Cognitive") && val === "mece";
    }, { timeout: 10000 });
    await replayPage.close();
    mark("url-replay");

    const focusCell = await page.evaluate(() => {
      const source = window.COGNITIVE_ATLAS_OBJECTS || window.MODEL_LIBRARY_ROWS;
      const allModels = window.ModelLayout
        .buildModelData(source)
        .filter((model) => model?.evaluation?.stageA !== "不纳入");
      const seed = allModels.find((model) => model.name === "MECE") || allModels[0];
      return `${seed.x}|${seed.y}|${seed.z}`;
    });

    const focusPage = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    await focusPage.goto(`${baseUrl}/cognitive-atlas.html?lang=en&cells=${encodeURIComponent(focusCell)}`, {
      waitUntil: "networkidle",
      timeout: 30000
    });
    await focusPage.waitForSelector("#modelContent .model-action-btn[data-model-name]", { timeout: 10000 });
    const focusButtonName = await focusPage.getAttribute("#modelContent .model-action-btn[data-model-name]", "data-model-name");
    const focusModeTitle = await focusPage.locator("#modelContent .model-name").innerText();
    assert.ok(focusModeTitle.trim().length > 0, "Expected a focus-mode title");
    mark("cell-focus");

    assert.ok(focusButtonName, "Expected focus path to expose a model name");
    await focusPage.evaluate((modelName) => {
      window.__focusModelByName?.(modelName);
    }, focusButtonName);
    await focusPage.evaluate((beforeTitle) => {
      window.__beforeModelTitle = beforeTitle;
    }, focusModeTitle.trim());
    await focusPage.waitForFunction(() => {
      const title = document.querySelector("#modelContent .model-name")?.textContent?.trim() || "";
      return title.length > 0 && title !== window.__beforeModelTitle;
    }, { timeout: 10000 });
    const afterFocusJumpTitle = await focusPage.locator("#modelContent .model-name").innerText();
    assert.notEqual(afterFocusJumpTitle.trim(), focusModeTitle.trim(), "Expected cell-focus click to open a model detail");
    mark("cell-focus-jump-to-model");

    const relatedTrigger = focusPage.locator("#modelContent .accordion-section.related-card .accordion-trigger").first();
    await relatedTrigger.click();
    const modelNameBeforeRelatedJump = await focusPage.locator("#modelContent .model-name").innerText();
    const relatedButtons = focusPage.locator("#modelContent .accordion-section.related-card .model-action-btn[data-model-name]");
    assert.ok(await relatedButtons.count(), "Expected related model actions to exist");
    const relatedModelName = await relatedButtons.first().getAttribute("data-model-name");
    assert.ok(relatedModelName, "Expected related-model action to provide model name");
    await focusPage.evaluate((modelName) => {
      window.__focusModelByName?.(modelName);
    }, relatedModelName);
    await focusPage.waitForTimeout(120);
    const modelNameAfterRelatedJump = await focusPage.locator("#modelContent .model-name").innerText();
    assert.notEqual(modelNameAfterRelatedJump.trim(), modelNameBeforeRelatedJump.trim(), "Expected related-model jump to switch detail");
    await focusPage.close();
    mark("related-model-jump");

    const exportHookType = await page.evaluate(() => typeof window.__getPromoExportDataUrl);
    assert.equal(exportHookType, "function", "Expected export hook to exist");

    const exportResult = await page.evaluate(async () => {
      const start = performance.now();
      const dataUrl = await window.__getPromoExportDataUrl();
      return { dataUrl, elapsedMs: performance.now() - start };
    });
    assert.ok(String(exportResult.dataUrl).startsWith("data:image/png;base64,"), "Expected PNG export data URL");
    assert.ok(exportResult.elapsedMs < 5000, "Expected export hook to return within 5 seconds");
    mark("export-hook");

    const embedPage = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await embedPage.goto(`${baseUrl}/embed.html?lang=en`, { waitUntil: "networkidle", timeout: 30000 });
    await embedPage.waitForFunction(() => document.body.classList.contains("embed-mode"), { timeout: 10000 });
    const embedUrl = embedPage.url();
    assert.ok(embedUrl.includes("embed=1"), "Expected embed mode to preserve embed query");
    assert.ok(embedUrl.includes("simple=1"), "Expected embed mode to force simple query");
    await embedPage.close();
    mark("embed-mode");

    assert.ok(checks.length >= 10, "Expected at least 10 regression checks");

    console.log(`Smoke E2E passed (${checks.length} checks).`);
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
