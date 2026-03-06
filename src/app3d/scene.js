import * as THREE from "three";
import { OrbitControls } from "../../vendor/three/examples/jsm/controls/OrbitControls.js";

/**
 * core/scene — Three.js 生命周期集中管理
 *
 * 职责：场景、渲染器、相机、控制器、灯光、分组创建与配置。
 * Traceability: Phase3 架构演进
 */

const DEFAULT_SCENE_BG = 0x0a1220;
const DEFAULT_FOG = { color: 0x0a1220, near: 140, far: 300 };

/**
 * 创建完整的 Three.js 场景上下文（scene, renderer, camera, controls, groups, lights）
 * @param {Object} THREE - Three.js 库
 * @param {Object} options
 * @param {HTMLElement} options.container - 渲染器插入的父容器（如 document.body）
 * @param {HTMLElement} [options.insertBefore] - 渲染器插入在此元素之前
 * @param {number} [options.width] - 初始宽度
 * @param {number} [options.height] - 初始高度
 */
export function createSceneContext(THREE, options = {}) {
  const container = options.container ?? document.body;
  const insertBefore = options.insertBefore ?? null;
  const width = options.width ?? (typeof window !== "undefined" ? window.innerWidth : 800);
  const height = options.height ?? (typeof window !== "undefined" ? window.innerHeight : 600);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(DEFAULT_SCENE_BG);
  scene.fog = new THREE.Fog(DEFAULT_FOG.color, DEFAULT_FOG.near, DEFAULT_FOG.far);

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
  renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 2, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.zIndex = "0";
  renderer.domElement.style.touchAction = "none";
  if (insertBefore) {
    container.insertBefore(renderer.domElement, insertBefore);
  } else {
    container.appendChild(renderer.domElement);
  }

  const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
  camera.position.set(98, 90, 98);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxDistance = 320;
  controls.minDistance = 24;
  controls.target.set(0, 18, 18);
  controls.enablePan = true;
  controls.update();

  scene.add(new THREE.AmbientLight(0xc8dcff, 0.85));
  const keyLight = new THREE.DirectionalLight(0xa8d4ff, 1.1);
  keyLight.position.set(34, 65, 42);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0x7ee8dc, 0.9, 200, 1.8);
  fillLight.position.set(-38, 24, 54);
  scene.add(fillLight);

  const axisGroup = new THREE.Group();
  const nodesGroup = new THREE.Group();
  const linksGroup = new THREE.Group();
  const pyramidGroup = new THREE.Group();
  const neighborLineGroup = new THREE.Group();
  const cellBadgeGroup = new THREE.Group();
  scene.add(axisGroup, nodesGroup, linksGroup, pyramidGroup, neighborLineGroup, cellBadgeGroup);

  return {
    scene,
    renderer,
    camera,
    controls,
    groups: {
      axisGroup,
      nodesGroup,
      linksGroup,
      pyramidGroup,
      neighborLineGroup,
      cellBadgeGroup
    }
  };
}

/**
 * 创建渲染循环
 * @param {Object} params
 * @param {THREE.WebGLRenderer} params.renderer
 * @param {THREE.Scene} params.scene
 * @param {THREE.Camera} params.camera
 * @param {Object} [params.controls] - OrbitControls，每帧调用 update()
 * @param {Function} [params.onFrame] - 每帧回调（如 refreshNodeStylesIfCameraMoved）
 */
export function createRenderLoop({ renderer, scene, camera, controls, onFrame }) {
  function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (onFrame) onFrame();
    renderer.render(scene, camera);
  }
  return animate;
}

export function createCellOffsets(total) {
  const step = total >= 10 ? 4.2 : total >= 6 ? 3.8 : 3.4;
  const coords = [0, step, -step];
  const points = [];
  for (const x of coords) {
    for (const y of coords) {
      for (const z of coords) {
        points.push(new THREE.Vector3(x, y, z));
      }
    }
  }
  points.sort((a, b) => a.lengthSq() - b.lengthSq() || a.x - b.x || a.y - b.y || a.z - b.z);
  return points;
}

export function computeGridBands(centers, step) {
  const sorted = [...centers].sort((a, b) => a - b);
  const bounds = [sorted[0] - step / 2];
  for (let i = 0; i < sorted.length - 1; i++) {
    bounds.push((sorted[i] + sorted[i + 1]) / 2);
  }
  bounds.push(sorted[sorted.length - 1] + step / 2);
  return {
    bounds,
    min: bounds[0],
    max: bounds[bounds.length - 1]
  };
}

export function makeLine(start, end, material) {
  const geometry = new THREE.BufferGeometry().setFromPoints([start.clone(), end.clone()]);
  return new THREE.Line(geometry, material);
}

export function makePolyline(points, material) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points.map((p) => p.clone()));
  return new THREE.Line(geometry, material);
}

export function clearGroup(group) {
  while (group.children.length > 0) {
    const child = group.children[group.children.length - 1];
    group.remove(child);
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => {
          if (material.map) material.map.dispose();
          material.dispose();
        });
      } else {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    }
  }
}

export function createTextSprite(text, options = {}) {
  const {
    fontSize = 34,
    lineHeight = 36,
    paddingX = 18,
    paddingY = 10,
    background = "rgba(6, 12, 25, 0.72)",
    border = "rgba(143, 181, 255, 0.52)",
    textColor = "rgba(233, 241, 255, 0.96)",
    radius = 10,
    scaleFactor = 0.02
  } = options;

  const lines = text.split("\n");
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const font = `600 ${fontSize}px "Barlow Condensed","Noto Sans SC",sans-serif`;
  context.font = font;

  const maxWidth = Math.max(...lines.map((line) => context.measureText(line).width));
  const width = Math.ceil(maxWidth + paddingX * 2);
  const height = lines.length * lineHeight + paddingY * 2;
  canvas.width = width;
  canvas.height = height;

  context.font = font;
  context.fillStyle = background;
  context.strokeStyle = border;
  context.lineWidth = 2;
  roundRect(context, 1, 1, width - 2, height - 2, radius);
  context.fill();
  context.stroke();

  context.fillStyle = textColor;
  context.textAlign = "center";
  context.textBaseline = "middle";
  lines.forEach((line, index) => {
    context.fillText(line, width / 2, paddingY + lineHeight / 2 + index * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(width * scaleFactor, height * scaleFactor, 1);
  return sprite;
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}
