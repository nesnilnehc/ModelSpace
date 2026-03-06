# Phase 3 分发能力深化 & 架构演进（规划草案）

**Date:** 2026-03-06  
**Status:** Draft  
**Scope:** 规划与优先级建议，不含实现  
**Traceability:** [Goals](../project-overview/goals.md) → [Roadmap](../designs/2026-03-05-iteration-roadmap.md) → [Backlog](../process-management/backlog.md)

---

## 背景

M5 已完，Phase 1（B：工程基线）与 Phase 2（A：学习体验 + M5 内容治理）均已落地。本规划推进 **Phase 3（方案 C：分发能力深化）** 与 **架构演进**，将 backlog 中的 optional 项转化为可执行方案。

---

## Phase 3：分发能力深化（方案 C）

### 目标

提高外部触达与复用率，将「浏览器内体验」扩展为「可传播资产」。

### 选项与估算

| 选项 | 描述 | 估算 | 价值 |
|------|------|------|------|
| **分享能力增强** | 带筛选/视角参数的 URL 优化，短链、可读性 | small | 高（分享体验） |
| **局部截图** | 仅导出当前可见单元或选中区域 | medium | 中（教学/海报） |
| **主题海报模板** | 固定布局、品牌元素的导出模板 | medium | 中（品牌呈现） |

### 推荐顺序

1. **分享能力增强**（small）— 复用现有 URL 状态，投入小、收益明显
2. 视需求择机：**局部截图** 或 **主题海报模板**

### 验收标准（分享增强）

- URL 支持精简参数（可选短格式）
- 分享链接跨设备可复现同一视图（已基本满足，可做可读性优化）
- 文档中明确分享最佳实践

### 依赖与约束

- 无后端；不改动核心 3D 逻辑
- 复用 `src/app3d/url-state.js` 与 `embed.html`

---

## 架构演进（目标架构）

Roadmap 目标架构见 [2026-03-05-iteration-roadmap.md](./2026-03-05-iteration-roadmap.md#目标架构迭代后)。当前 `src/app.js` 仍承担编排，目标拆分为：

| 目标域 | 职责 | 当前状态 | 估算 |
|--------|------|----------|------|
| `core/state` | 筛选、选中、视角、语言 | 部分在 `app3d/state.js` | small |
| `core/scene` | Three.js 生命周期、渲染更新 | 分散在 `app.js` | medium |
| `core/interaction` | 事件编排 | 已在 `app3d/interaction.js` | done |
| `core/export` | 导出裁剪、图片产出 | 已在 `app3d/export.js` | done |
| `domain/model-data` | 模型解析、准入映射、校验聚合 | 分散在 `app.js`、`layout.js` | medium |
| `ui/panels` | 筛选、详情、校验、view dock | 分散在 `app.js`、`app3d/ui.js` | medium |

### 推荐顺序

1. **domain/model-data** — 与数据治理（M5）强相关，抽离后便于测试与扩展
2. **core/state** 补全 — 将 `app.js` 中剩余状态逻辑迁入
3. **core/scene** — Three.js 生命周期集中管理
4. **ui/panels** — 最后统一面板层，依赖前序拆分

### 风险与缓解

- 风险：拆分引入行为回退  
  缓解：每步先跑 `npm run smoke:e2e`，小步提交

---

## 3D / 详情改版（可选）

已有设计文档，可择机落地：

| 文档 | 内容 | 建议 |
|------|------|------|
| [20260304-3d-visibility-redesign.md](../architecture/20260304-3d-visibility-redesign.md) | 单元优先导航、相机 LOD | 与 Phase 3 分享/截图协同考虑 |
| [20260304-model-details-ia-redesign.md](../architecture/20260304-model-details-ia-redesign.md) | 详情面板分层手风琴 | 独立于 3D 改版，可先行 |

---

## 综合优先级建议

| 优先级 | 项 | 理由 |
|--------|-----|------|
| 1 | 分享能力增强（Phase 3） | 投入小、价值高、复用现有 URL |
| 2 | domain/model-data 抽离 | 支撑数据治理演进，降低 app.js 复杂度 |
| 3 | 详情 IA 改版 | 独立、用户可感知 |
| 4 | core/state 补全 | 为 scene / ui 拆分打底 |
| 5 | 局部截图 / 海报模板 | 按业务需求择机 |

---

## 下一步

1. 确认本规划方向  
2. 若采纳「分享能力增强」，可产出实施任务拆解（类似 M5 Week 2 实施规划）  
3. 若优先架构演进，可产出 `domain/model-data` 抽离的详细设计

---

## 参考

- [Goals](../project-overview/goals.md)
- [Backlog Optional](../process-management/backlog.md#可选--后续optional)
- [Iteration Roadmap](./2026-03-05-iteration-roadmap.md)
