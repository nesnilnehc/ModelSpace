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

const PERF_MIN_ROWS = 120;
const PERF_BUDGET_LOCAL = {
  firstScreenMsMax: 6000,
  avgFpsMin: 20,
  exportMsMax: 4000
};
const PERF_BUDGET_CI = {
  firstScreenMsMax: 6000,
  avgFpsMin: 5,
  exportMsMax: 4000
};
const IS_CI = String(process.env.CI || "").toLowerCase() === "true";

function parseBudgetNumber(name, fallback) {
  const value = process.env[name];
  if (value == null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveBudget() {
  const defaults = IS_CI ? PERF_BUDGET_CI : PERF_BUDGET_LOCAL;
  return {
    firstScreenMsMax: parseBudgetNumber("PERF_FIRST_SCREEN_MS_MAX", defaults.firstScreenMsMax),
    avgFpsMin: parseBudgetNumber("PERF_AVG_FPS_MIN", defaults.avgFpsMin),
    exportMsMax: parseBudgetNumber("PERF_EXPORT_MS_MAX", defaults.exportMsMax)
  };
}

const PERF_BUDGET = resolveBudget();

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

const PERF_DATA_PATCH = `
;(() => {
  const rows = window.MODEL_LIBRARY_ROWS;
  if (!Array.isArray(rows)) return;
  const seedRows = rows.slice();
  let idx = 1;
  while (rows.length < ${PERF_MIN_ROWS}) {
    const base = seedRows[(idx - 1) % seedRows.length];
    const clone = Array.isArray(base) ? [...base] : base;
    clone[0] = String(clone[0] || "Model") + " [Perf " + idx + "]";
    if (typeof clone[1] === "string" && clone[1].length > 0) clone[1] = clone[1] + "·性能" + idx;
    if (typeof clone[2] === "string" && clone[2].length > 0) clone[2] = clone[2] + " (perf " + idx + ")";
    rows.push(clone);
    idx += 1;
  }
})();
`;

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
    const pageErrors = [];
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    page.on("pageerror", (error) => {
      pageErrors.push(String(error?.message || error));
    });
    await page.route("**/data/model-library.js", async (route) => {
      const response = await route.fetch();
      const source = await response.text();
      await route.fulfill({
        response,
        body: `${source}\n${PERF_DATA_PATCH}`
      });
    });

    await page.goto(`${baseUrl}/cognitive-atlas.html`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector("#appTitle", { timeout: 15000 });

    const readyTimeoutMs = 30000;
    const readyStartedAt = Date.now();
    while (Date.now() - readyStartedAt < readyTimeoutMs) {
      const ready = await page.evaluate(() => typeof window.__getPromoExportDataUrl === "function");
      if (ready) break;
      await page.waitForTimeout(120);
    }
    const exportHookReady = await page.evaluate(() => typeof window.__getPromoExportDataUrl === "function");
    assert.ok(
      exportHookReady,
      `Expected export hook to be ready before perf sampling. Page errors: ${pageErrors.join(" | ") || "none"}`
    );

    const firstScreenMs = await page.evaluate(() => performance.now());
    const rowCount = await page.evaluate(() => Array.isArray(window.MODEL_LIBRARY_ROWS) ? window.MODEL_LIBRARY_ROWS.length : 0);
    const rendererInfo = await page.evaluate(() => {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return { webgl: false, renderer: "unavailable" };
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
        return { webgl: true, renderer: String(renderer || "unknown") };
      } catch (error) {
        return { webgl: false, renderer: `error:${String(error?.message || error)}` };
      }
    });
    const runtimeContext = `CI=${IS_CI}, renderer=${rendererInfo.renderer}`;

    const avgFps = await page.evaluate(async () => {
      const durationMs = 2000;
      return await new Promise((resolve) => {
        let frames = 0;
        const start = performance.now();
        const tick = (now) => {
          frames += 1;
          if (now - start >= durationMs) {
            resolve((frames * 1000) / (now - start));
            return;
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    });

    const exportMs = await page.evaluate(async () => {
      const start = performance.now();
      await window.__getPromoExportDataUrl();
      return performance.now() - start;
    });

    assert.ok(rowCount >= PERF_MIN_ROWS, `Expected at least ${PERF_MIN_ROWS} models in perf run, got ${rowCount}`);
    assert.ok(firstScreenMs <= PERF_BUDGET.firstScreenMsMax,
      `First-screen time ${firstScreenMs.toFixed(1)}ms exceeds budget ${PERF_BUDGET.firstScreenMsMax}ms`);
    assert.ok(avgFps >= PERF_BUDGET.avgFpsMin,
      `Average FPS ${avgFps.toFixed(1)} is below budget ${PERF_BUDGET.avgFpsMin} (${runtimeContext})`);
    assert.ok(exportMs <= PERF_BUDGET.exportMsMax,
      `Export time ${exportMs.toFixed(1)}ms exceeds budget ${PERF_BUDGET.exportMsMax}ms`);

    console.log("Performance budget passed.");
    console.log(`Runtime: ${runtimeContext}`);
    console.log(`Rows: ${rowCount}`);
    console.log(`First-screen: ${firstScreenMs.toFixed(1)}ms (budget <= ${PERF_BUDGET.firstScreenMsMax}ms)`);
    console.log(`Average FPS: ${avgFps.toFixed(1)} (budget >= ${PERF_BUDGET.avgFpsMin})`);
    console.log(`Export time: ${exportMs.toFixed(1)}ms (budget <= ${PERF_BUDGET.exportMsMax}ms)`);
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
  console.error("Performance budget failed:", message);
  process.exit(1);
});
