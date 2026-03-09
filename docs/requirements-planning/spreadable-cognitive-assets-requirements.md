# 可传播认知资产与体系化学习需求

**Date:** 2026-03-09  
**Status:** Draft  
**Traceability:** [Goals](../project-overview/goals.md) → [Phase 3 设计](../designs/2026-03-06-phase3-architecture-evolution.md) → [Backlog](../process-management/backlog.md)

---

## 1. 问题陈述

- **可传播**：创作者与用户需要将 Cognitive Atlas 中的认知对象以抖音原生形态分享；当前 Phase 3 以 cell 裁剪、主题海报为主，仅产出像素资产，不承载认知结构（定义、坐标、关系）。
- **可学习**：用户从抖音落地页进入后缺乏体系化学习入口；当前 Atlas 已有 prerequisite/next_step 关系，但未显式组织为路径，且 practice、复习节奏未结构化。

---

## 2. 可传播认知资产需求

### 2.1 模型落地页 URL 规范

| 需求 ID | 描述 | 验收 |
|---------|------|------|
| REQ-G-1 | 每个认知对象具备稳定、可书签的 URL | 如 `/model/MECE` 或 `?model=MECE` |
| REQ-G-2 | 落地页展示完整定义、坐标、relations、references | 与现有详情面板结构一致 |
| REQ-G-3 | 与 url-state.js 兼容 | 支持叠加筛选、语言等参数 |
| REQ-G-4 | 规范写入 docs/guides | 与 share-url-best-practices 统一 |

### 2.2 抖音竖卡导出

| 需求 ID | 描述 | 验收 |
|---------|------|------|
| REQ-D-1 | 支持按单模型导出 9:16 竖卡 | 图像或可复制布局 |
| REQ-D-2 | 竖卡含：名称、summary、坐标提示、CTA | CTA 引导至落地页 |
| REQ-D-3 | 输出适配抖音发布格式 | 分辨率、3 秒可读 |
| REQ-D-4 | 内容源自 v2 schema | 保证准确 |

### 2.3 创作者脚本模板导出

| 需求 ID | 描述 | 验收 |
|---------|------|------|
| REQ-E-1 | 按单模型导出脚本：钩子(3s)→定义(10s)→例子(15s)→关联(5s) | 结构固定 |
| REQ-E-2 | 内容源自 summary、definition、whenToUse、relations | v2 schema |
| REQ-E-3 | 输出 Markdown 或纯文本 | 便于复制 |
| REQ-E-4 | 含落地页 URL 占位符 | 供 CTA 使用 |

### 2.4 系列化路径（P2）

| 需求 ID | 描述 | 验收 |
|---------|------|------|
| REQ-F-1 | 支持按路径（如 MECE→Issue Tree→5 Whys）导出系列脚本 | 3 集结构统一 |
| REQ-F-2 | 与 E 脚本模板复用 | DRY |

---

## 3. 体系化学习需求

### 3.1 学习路径设计

| 需求 ID | 描述 | 验收 |
|---------|------|------|
| REQ-LP-1 | 至少 2–3 条可追溯学习路径 | 如 Strategy 入门、结构思维入门 |
| REQ-LP-2 | 路径与 prerequisite/next_step 一致 | 可导出验证 |
| REQ-LP-3 | 路径内模型补充 practice 字段 | 每模型至少一个练习 |

### 3.2 学习手册 Markdown 导出

| 需求 ID | 描述 | 验收 |
|---------|------|------|
| REQ-LH-1 | 按选定路径导出 Markdown | 含路径名称、模型列表 |
| REQ-LH-2 | 含 summary、whenToUse、practice | 复习节奏提醒（1 天/3 天/1 周） |
| REQ-LH-3 | 格式兼容 Notion/Obsidian | 可选含落地页 URL |

---

## 4. 约束与依赖

- 无后端；静态导出
- 复用 `src/app3d/export.js`、`url-state.js`、model-library
- YAGNI：Atlas 内学习模式、SRS 集成为可选后续
