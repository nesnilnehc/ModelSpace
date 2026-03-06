# core/state 补全

**Date:** 2026-03-06  
**Status:** Implemented  
**Scope:** 架构演进 — 将 app.js 中剩余视角/相机状态逻辑迁入 state.js  
**Traceability:** [Phase3 架构演进](../designs/2026-03-06-phase3-architecture-evolution.md) → [Backlog](../process-management/backlog.md)

---

## 1. 目标

将 `app.js` 中视角、相机相关的剩余状态逻辑迁入 `src/app3d/state.js`，为后续 core/scene 与 ui/panels 拆分打底。

---

## 2. 交付物

| 交付物 | 状态 |
|--------|------|
| `createCameraViewDirections(THREE)` | 已加入 state.js，返回 default/promo/x/y/z 视角方向预设 |
| `createViewUiState` 扩展 | 新增 `three` 选项，初始化 `baseCameraCenter` |
| `app.js` | 已改为使用上述接口，移除内联 CAMERA_VIEW_DIRECTIONS 与 baseCameraCenter 赋值 |

---

## 3. API 变更

**createViewUiState(options)**
- 新增 `options.three`：传入时自动初始化 `baseCameraCenter` 为 `new THREE.Vector3(0,0,0)`

**createCameraViewDirections(THREE)**
- 新增导出：返回 `{ default, promo, x, y, z }` 视角方向预设（Vector3）

---

## 4. 验收

- [x] smoke:e2e 通过
- [x] 行为无回退
