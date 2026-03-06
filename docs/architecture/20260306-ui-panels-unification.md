# ui/panels 面板层统一

**Date:** 2026-03-06  
**Status:** Implemented  
**Scope:** 架构演进 — 将筛选、详情、校验、view dock 相关 DOM 解析与可见性控制迁入 panels 模块  
**Traceability:** [Phase3 架构演进](../designs/2026-03-06-phase3-architecture-evolution.md) → [Backlog](../process-management/backlog.md)

---

## 1. 目标

将 `app.js` 中分散的面板 DOM 解析与工具栏/详情可见性逻辑迁入 `src/app3d/panels.js`，统一面板层入口。

---

## 2. 交付物

| 交付物 | 状态 |
|--------|------|
| `resolvePanelElements(doc)` | 已加入 panels.js：集中解析所有面板 DOM 引用 |
| `setToolbarHidden(elements, viewUiState, hidden, getUIText)` | 已迁入 panels.js |
| `setInfoHidden(elements, viewUiState, hidden, getUIText)` | 已迁入 panels.js |
| `app.js` | 已改为使用 resolvePanelElements + panels 可见性接口 |

---

## 3. API

**resolvePanelElements(doc)** — 返回控件、筛选、详情、view dock 等元素引用集合

**setToolbarHidden / setInfoHidden** — 面板可见性控制，接收 elements、viewUiState、hidden、getUIText

---

## 4. 验收

- [x] smoke:e2e 通过
- [x] 行为无回退
