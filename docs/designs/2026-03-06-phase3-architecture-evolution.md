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

提高外部触达与复用率，将「浏览器内体验」扩展为「可传播认知资产」。优先结构资产（承载定义、坐标、关系），放弃纯像素资产（cell 裁剪、主题海报）作为主方向。

### 可传播认知资产（2026-03-09 更新）

| 方向 | 描述 | 估算 | 价值 |
|------|------|------|------|
| **D 抖音竖卡** | 9:16 单模型卡：名称、定义、坐标、CTA「详情见评论」 | small | 高 |
| **E 创作者脚本模板** | 按 v2 schema 导出：钩子(3s)→定义(10s)→例子(15s)→关联(5s) | small | 高 |
| **G 落地页 URL** | 每个模型固定 URL，视频 CTA 指向，承载完整定义/坐标/关系 | small | 高 |
| **F 系列化路径** | 如 MECE→Issue Tree→5 Whys 做 3 集系列（P2） | medium | 中 |

### 已实现（保留）

| 选项 | 描述 | 状态 |
|------|------|------|
| 分享能力增强 | URL 优化、短链、分享最佳实践 | done |
| 局部截图（当前视口） | 导出当前可见区域 | done |

### 降级（不作为主方向）

- **局部截图（cell 裁剪）**、**主题海报模板**：仅像素，不承载认知结构；按业务需求择机。

### 推荐顺序

1. **G 落地页 URL** — 支撑 D/E 的 CTA
2. **D 抖音竖卡** + **E 脚本模板** — 复用 export、model-library
3. **F 系列路径** — P2，视需求推进

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

## 体系化学习（2026-03-09 新增）

| 方向 | 描述 |
|------|------|
| 学习路径设计 | 基于 prerequisite/next_step 定义路径（Strategy 入门、结构思维入门） |
| 练习与复习 | practice 字段、复习节奏 1 天/3 天/1 周 |
| 学习手册导出 | 按路径导出 Markdown：模型列表、定义、练习、复习提醒 |

衔接：抖音 CTA → 落地页(G) → 选择路径 → 体系化学习。

---

## 综合优先级建议

| 优先级 | 项 | 理由 |
|--------|-----|------|
| 1 | 可传播认知资产（D/E/G） | 抖音场景主方向，投入小、价值高 |
| 2 | 体系化学习（路径+手册导出） | 衔接落地页，形成学习闭环 |
| 3 | domain/model-data 抽离 | 架构演进已完成 |
| 4 | 详情 IA 改版 | 独立、用户可感知 |
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
