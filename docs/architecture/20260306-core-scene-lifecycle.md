# core/scene 生命周期集中管理

**Date:** 2026-03-06  
**Status:** Implemented  
**Scope:** 架构演进 — 将 Three.js 场景、渲染器、相机、控制器、灯光、分组创建与渲染循环集中到 scene.js  
**Traceability:** [Phase3 架构演进](../designs/2026-03-06-phase3-architecture-evolution.md) → [Backlog](../process-management/backlog.md)

---

## 1. 目标

将 `app.js` 中分散的 Three.js 生命周期逻辑迁入 `src/app3d/scene.js`，集中管理场景创建、渲染循环。

---

## 2. 交付物

| 交付物 | 状态 |
|--------|------|
| `createSceneContext(THREE, options)` | 已加入 scene.js：创建 scene、renderer、camera、controls、lights、groups |
| `createRenderLoop({ renderer, scene, camera, controls, onFrame })` | 已加入 scene.js：统一渲染循环 |
| `app.js` | 已改为使用上述接口，移除内联场景/灯光/渲染循环 |

---

## 3. API

**createSceneContext(THREE, options)**
- `options.container` - 渲染器父容器
- `options.insertBefore` - 渲染器插入位置（可选）
- `options.width`, `options.height` - 初始尺寸
- 返回 `{ scene, renderer, camera, controls, groups }`

**createRenderLoop(params)**
- `params.renderer`, `params.scene`, `params.camera` - 必需
- `params.controls` - OrbitControls，每帧 update
- `params.onFrame` - 每帧回调
- 返回启动函数，调用即开始循环

---

## 4. 验收

- [x] smoke:e2e 通过
- [x] 行为无回退
