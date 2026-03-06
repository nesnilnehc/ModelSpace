import * as THREE from "three";

function getCognitiveSpaceBoundsInPixels({
  renderer,
  camera,
  computeGridBands,
  scale,
  toWorldY,
  toWorldZ,
  tight,
  exportCropMargin
}) {
  const xBand = computeGridBands([-1, 0, 1].map((x) => x * scale.x), scale.x);
  const yBand = computeGridBands([1, 2, 3, 4].map((y) => toWorldY(y)), scale.y);
  const zBand = computeGridBands([1, 2, 3, 4].map((z) => toWorldZ(z)), scale.z);
  const padding = tight ? 2 : 14;
  const box = new THREE.Box3(
    new THREE.Vector3(xBand.min - padding, yBand.min - padding, zBand.min - padding),
    new THREE.Vector3(xBand.max + padding, yBand.max + padding, zBand.max + padding)
  );

  const corners = [
    new THREE.Vector3(box.min.x, box.min.y, box.min.z),
    new THREE.Vector3(box.max.x, box.min.y, box.min.z),
    new THREE.Vector3(box.min.x, box.max.y, box.min.z),
    new THREE.Vector3(box.max.x, box.max.y, box.min.z),
    new THREE.Vector3(box.min.x, box.min.y, box.max.z),
    new THREE.Vector3(box.max.x, box.min.y, box.max.z),
    new THREE.Vector3(box.min.x, box.max.y, box.max.z),
    new THREE.Vector3(box.max.x, box.max.y, box.max.z)
  ];

  const canvas = renderer.domElement;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const projected = new THREE.Vector3();
  for (const corner of corners) {
    projected.copy(corner).project(camera);
    const px = (projected.x * 0.5 + 0.5) * canvas.width;
    const py = (1 - (projected.y * 0.5 + 0.5)) * canvas.height;
    if (projected.z >= -1 && projected.z <= 1) {
      minX = Math.min(minX, px);
      minY = Math.min(minY, py);
      maxX = Math.max(maxX, px);
      maxY = Math.max(maxY, py);
    }
  }

  if (!Number.isFinite(minX) || !Number.isFinite(maxX)) {
    return { x: 0, y: 0, width: canvas.width, height: canvas.height };
  }

  const margin = tight ? exportCropMargin : 24;
  let x = Math.max(0, Math.floor(minX) - margin);
  let y = Math.max(0, Math.floor(minY) - margin);
  let width = Math.ceil(maxX - minX) + margin * 2;
  let height = Math.ceil(maxY - minY) + margin * 2;

  if (x + width > canvas.width) width = canvas.width - x;
  if (y + height > canvas.height) height = canvas.height - y;
  width = Math.max(1, Math.min(width, canvas.width));
  height = Math.max(1, Math.min(height, canvas.height));
  x = Math.min(x, canvas.width - width);
  y = Math.min(y, canvas.height - height);
  return { x, y, width, height };
}

function scaleAxisLabelSprites(axisGroup, scale) {
  axisGroup.traverse((obj) => {
    if (obj.isSprite && obj.material?.map) {
      obj.scale.multiplyScalar(scale);
    }
  });
}

function waitForTwoFrames() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

export function createExportService({
  renderer,
  camera,
  scene,
  axisGroup,
  computeGridBands,
  scale,
  toWorldY,
  toWorldZ,
  visualConfig
}) {
  async function getExportDataUrl(options = {}) {
    const mode = options.mode ?? "full";
    const overlayEl = document.getElementById("overlay");
    const dockEl = document.querySelector(".view-dock");
    const tooltipEl = document.getElementById("tooltip");

    const origOverlay = overlayEl?.style.visibility;
    const origDock = dockEl?.style.visibility;
    const origTooltip = tooltipEl?.style.visibility;
    const origFog = scene.fog;
    const origBackground = scene.background;
    const origClearColor = renderer.getClearColor(new THREE.Color());
    const origClearAlpha = renderer.getClearAlpha();
    const origPixelRatio = renderer.getPixelRatio();

    overlayEl && (overlayEl.style.visibility = "hidden");
    dockEl && (dockEl.style.visibility = "hidden");
    tooltipEl && (tooltipEl.style.visibility = "hidden");
    scene.fog = null;
    scene.background = new THREE.Color(0x0a1220);
    renderer.setClearColor(0x0a1220, 1);
    scaleAxisLabelSprites(axisGroup, visualConfig.exportAxisLabelScale);
    renderer.setPixelRatio(Math.max(origPixelRatio, visualConfig.exportPixelRatio ?? 2));

    try {
      await waitForTwoFrames();
      const canvas = renderer.domElement;
      const rect =
        mode === "viewport"
          ? { x: 0, y: 0, width: canvas.width, height: canvas.height }
          : getCognitiveSpaceBoundsInPixels({
              renderer,
              camera,
              computeGridBands,
              scale,
              toWorldY,
              toWorldZ,
              tight: true,
              exportCropMargin: visualConfig.exportCropMargin
            });

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = rect.width;
      cropCanvas.height = rect.height;
      const ctx = cropCanvas.getContext("2d");
      ctx.drawImage(
        canvas,
        rect.x, rect.y, rect.width, rect.height,
        0, 0, rect.width, rect.height
      );
      return cropCanvas.toDataURL("image/png");
    } finally {
      renderer.setPixelRatio(origPixelRatio);
      scaleAxisLabelSprites(axisGroup, 1 / visualConfig.exportAxisLabelScale);
      overlayEl && (overlayEl.style.visibility = origOverlay || "");
      dockEl && (dockEl.style.visibility = origDock || "");
      tooltipEl && (tooltipEl.style.visibility = origTooltip || "");
      scene.fog = origFog;
      scene.background = origBackground;
      renderer.setClearColor(origClearColor, origClearAlpha);
    }
  }

  /**
   * @param {string} [fileName]
   * @param {{ mode?: 'full' | 'viewport' }} [options]
   */
  function exportCanvasImage(fileName, options = {}) {
    getExportDataUrl(options).then((dataUrl) => {
      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = fileName || `modelspace-${new Date().toISOString().slice(0, 10)}.png`;
      anchor.click();
    });
  }

  const POSTER_CONFIG = {
    width: 1200,
    height: 630,
    padding: 24,
    titleFont: "24px \"Noto Sans SC\", \"PingFang SC\", sans-serif",
    subtitleFont: "16px \"Noto Sans SC\", \"PingFang SC\", sans-serif",
    titleColor: "#e7efff",
    subtitleColor: "#a6b3d1",
    bgColor: "#0a1220",
    borderColor: "rgba(140, 176, 251, 0.4)"
  };

  /**
   * Composite 3D export into a share-card poster (1200×630).
   * @param {{ title?: string, subtitle?: string }} [options]
   * @returns {Promise<string>} data URL
   */
  async function getExportPosterDataUrl(options = {}) {
    const title = options.title ?? "认知模型三维坐标系";
    const subtitle = options.subtitle ?? "用三维空间探索思维与决策模型";
    const imgDataUrl = await getExportDataUrl({ mode: "viewport" });
    const { width, height, padding, titleFont, subtitleFont, titleColor, subtitleColor, bgColor, borderColor } = POSTER_CONFIG;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    ctx.fillStyle = titleColor;
    ctx.font = titleFont;
    ctx.textAlign = "center";
    ctx.fillText(title, width / 2, padding + 20);

    ctx.fillStyle = subtitleColor;
    ctx.font = subtitleFont;
    ctx.fillText(subtitle, width / 2, padding + 48);

    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = imgDataUrl;
    });

    const imgAreaY = padding + 56;
    const imgAreaH = height - imgAreaY - padding;
    const imgAreaW = width - padding * 2;
    const scale = Math.min(imgAreaW / img.width, imgAreaH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = (width - drawW) / 2;
    const drawY = imgAreaY + (imgAreaH - drawH) / 2;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    return canvas.toDataURL("image/png");
  }

  /**
   * Export poster and trigger download.
   * @param {{ title?: string, subtitle?: string }} [options]
   */
  function exportPosterImage(options = {}) {
    getExportPosterDataUrl(options).then((dataUrl) => {
      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = `modelspace-share-${new Date().toISOString().slice(0, 10)}.png`;
      anchor.click();
    });
  }

  return { getExportDataUrl, exportCanvasImage, getExportPosterDataUrl, exportPosterImage };
}
