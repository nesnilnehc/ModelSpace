# domain/model-data 抽离

**Date:** 2026-03-06  
**Status:** Implemented  
**Scope:** 架构演进首项 — 将模型解析、准入映射抽离至独立 domain 模块  
**Traceability:** [Phase3 架构演进](../designs/2026-03-06-phase3-architecture-evolution.md) → [Backlog](../process-management/backlog.md)

---

## 1. 目标

将分散在 `app.js` 与 `layout.js` 的模型数据逻辑集中到 `src/domain/model-data.js`，便于测试、扩展，并与 M5 数据治理对齐。

---

## 2. 交付物

| 交付物 | 状态 |
|--------|------|
| `src/domain/model-data.js` | 已建立 |
| `src/layout.js` | 已删除（逻辑迁入 model-data） |
| `src/app.js` | 已改为从 model-data 导入 |
| `cognitive-model-3d.html` | 已移除 layout.js 脚本引用 |
| `window.ModelLayout` | 由 app.js 注入，保持 smoke-e2e 兼容 |

---

## 3. 模块 API

**src/domain/model-data.js**

- `buildModelData(rows, evaluationByName)` — 从 rows 构建三维坐标化模型数据
- `createAdmittedModelData(rows, evaluationByName)` — 构建并过滤 stageA !== "不纳入"
- `CATEGORY_COLOR_MAP` — 分类配色
- `CATEGORY_ORDER` — 分类顺序
- `TYPICAL_MODEL_PRIORITY` — 每类典型模型优先级

---

## 4. 验收

- [x] smoke:e2e 通过
- [x] validate:content 通过
- [x] 行为无回退
