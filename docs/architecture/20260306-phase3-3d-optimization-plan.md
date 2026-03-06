# Phase 3 可选项 & 3D / 详情改版 — 详细优化计划

**Date:** 2026-03-06  
**Status:** Draft  
**Scope:** 实施规划（任务拆解、优先级、验收标准）  
**Traceability:** [Phase 3 规划](../designs/2026-03-06-phase3-architecture-evolution.md) → [Backlog](../process-management/backlog.md) → [3D 可见性设计](./20260304-3d-visibility-redesign.md)

---

## 1. 当前状态

| 方向 | 状态 | 说明 |
|------|------|------|
| 架构演进 | done | domain/model-data、core/state、core/scene、ui/panels 已完成 |
| Phase 3 分享能力增强 | done | 短链、复制分享链接、最佳实践文档 |
| 详情 IA 改版 | done | Phase 1–3（分层手风琴、Expand All/Collapse All、section 会话记忆） |
| 局部截图 | in-progress | viewport 模式已实现，cell 裁剪待实施 |
| 主题海报模板 | todo | 待实施 |
| 3D 可见性改版 | todo | Proposed，待实施 |

---

## 2. 方向概览与推荐顺序

| 顺序 | 方向 | 估算 | 收益 | 依赖 | 建议 |
|------|------|------|------|------|------|
| 1 | 局部截图 | medium | 教学/分享时只导出感兴趣区域，减少裁剪后处理，所见即所得 | export.js、cell 状态 | 可先做「当前视口」模式 |
| 2 | 3D 可见性改版 | medium–large | 80+ 模型时减少认知负荷，快速定位 dense cell，提升首屏可读性 | state、scene | 用户感知强 |
| 3 | 主题海报模板 | medium | 分享到社交/PPT 时自带品牌、标题，减少二次设计 | 局部截图、export | 依赖裁剪能力 |

**说明：** 详情 IA 已全部完成，本计划不再拆解。

---

## 3. 方向一：局部截图

### 3.1 目标

支持仅导出「当前可见区域」或「选中 cell 包围盒」，用于教学、海报、分享场景。

### 3.2 收益（为什么改）

| 收益 | 说明 |
|------|------|
| **减少后处理** | 当前导出整认知空间，用户需用图片工具裁剪感兴趣部分；局部导出可直接用 |
| **所见即所得** | 用户调整好视角后再导出，输出与屏幕一致，避免「导出后发现角度不对」 |
| **适合分享** | 教学、博客、PPT 插入时，只需某单元或某视角的图，文件更小、更聚焦 |

### 3.3 现状

- 当前 `export.js` 的 `getCognitiveSpaceBoundsInPixels` 基于**整认知空间**三轴包围盒裁剪
- 无「按当前相机可见区域」或「按选中 cell 子集」裁剪的能力

### 3.4 实施选项

#### 选项 A：当前视口裁剪（推荐先做）

- **描述：** 导出时仅截取当前 canvas 可见区域
- **实现：** 使用 `(0,0,canvas.width,canvas.height)` 或 camera frustum 投影到 2D 的可见区域
- **估算：** small
- **收益：** 用户自由调整视角后导出，所见即所得；无需再裁剪，适合任意视角分享

#### 选项 B：选中 cell 裁剪

- **描述：** 当 `selectedCellKeys` 非空时，仅导出这些 cell 的 3D 包围盒在 2D 的投影
- **实现：** `getCognitiveSpaceBoundsInPixels` 增加 `cellKeys?: string[]` 参数
- **估算：** medium
- **收益：** 教学时聚焦某单元（如 Tool layer）导出，图更干净、语义清晰

#### 选项 C：选中模型裁剪

- **描述：** 仅导出当前选中节点及其邻域的包围盒
- **估算：** small
- **收益：** 单模型或小范围分享，适合「介绍某个模型」的场景

### 3.5 推荐实施顺序

| 步骤 | 动作 | 产出 | 估算 |
|------|------|------|------|
| 1 | 在 `createExportService` 增加 `mode: 'full' \| 'viewport'` 参数 | 支持 viewport 模式 | small |
| 2 | viewport 模式：直接使用 canvas 全区域裁剪（或可选边距） | 导出当前视口 | small |
| 3 | 在顶栏或导出弹窗增加「导出方式」选择：全认知空间 / 当前视口 | 用户可选 | small |
| 4 | （可选）实现 cell 裁剪模式：传入 selectedCellKeys 与 layout 信息 | 按 cell 子集裁剪 | medium |

### 3.6 验收标准

- [x] 用户可选择「导出当前视口」，输出与屏幕所见一致的 PNG（2026-03-06 已实现）
- [ ] 全认知空间模式行为不变
- [ ] 导出时仍隐藏 overlay、dock、tooltip
- [ ] 不影响 `npm run smoke:e2e`

### 3.7 依赖与约束

- 复用 `src/app3d/export.js`，不引入新模块
- 保持 `createExportService` 的接口向后兼容

---

## 4. 方向二：3D 可见性改版

### 4.1 目标

采用 **Cell-first 导航（Option B）**，提升密集 3D 场景可读性：默认 Overview 模式显示 cell 徽标，聚焦后只渲染选中 cell 内节点。

### 4.2 收益（为什么改）

| 收益 | 说明 |
|------|------|
| **减轻认知负荷** | 80+ 模型时，全量 label 导致遮挡与信息过载；默认隐藏 label、突出 cell 徽标，用户 3 秒内可回答「哪个 cell 密集」「从哪开始」 |
| **提升可读性** | 聚焦 cell 后只渲染该单元内节点，label 重叠显著减少，学习路径更清晰 |
| **支持教学/演示** | 概览→聚焦的节奏更符合「先看结构、再看细节」的认知习惯，适合 workshop、培训 |

### 4.3 设计依据

详见 [20260304-3d-visibility-redesign.md](./20260304-3d-visibility-redesign.md)。

### 4.4 模式定义

| 模式 | 描述 | 当前状态 |
|------|------|----------|
| Overview | 显示 cell 徽标（数量/热力图），大部分 node 标签隐藏 | 部分实现（有 cell 筛选、徽标，但默认仍全量展示） |
| Focus | 只渲染选中 cell 内节点，label 全开 | 部分实现（单元聚焦时 detail 切换，3D 渲染逻辑未完全隔离） |

### 4.5 实施任务拆解

| 任务 | 描述 | 估算 | 依赖 |
|------|------|------|------|
| T1 | 引入 `viewMode: 'overview' \| 'focus'` 状态，默认 overview | small | state |
| T2 | Overview：node 默认低透明度、label 隐藏；cell badge 高亮 | medium | scene、state |
| T3 | Focus：仅渲染 selectedCellKeys 对应 cell 内 nodes，非 focus cell 隐藏或弱化 | medium | scene、layout |
| T4 | 入口：cell 下拉、点击 cell badge、搜索自动切 focus | small | interaction、panels |
| T5 | 启动校验：z=1 非空、单模型 cell 警告、最密 top-3 cell 报告（可选面板） | small | domain、ui |
| T6 | 性能：避免每帧重建 label，复用 sprite | small | scene |

### 4.6 推荐实施顺序

1. T1（状态）+ T2（Overview 渲染规则）
2. T3（Focus 渲染规则）
3. T4（入口统一）
4. T5、T6（校验与性能优化）

### 4.7 验收标准

- [ ] 默认 overview 下，用户 3 秒内可识别密集 cell
- [ ] 聚焦 cell 后，仅显示该 cell 内模型，label 重叠显著改善
- [ ] Tool layer（z=1）非空
- [ ] 语言切换、搜索、cell 切换无 console 报错

### 4.8 风险与缓解

| 风险 | 缓解 |
|------|------|
| 现有用户习惯全量展示 | 提供「全量展示」快捷切换，或默认 overview 可配置 |
| 渲染逻辑侵入 app.js | 封装在 scene 或新建 visibility 模块，最小化 app.js 改动 |

---

## 5. 方向三：主题海报模板

### 5.1 目标

提供固定布局、品牌元素的导出模板，用于对外展示、海报、PPT 插入。

### 5.2 收益（为什么改）

| 收益 | 说明 |
|------|------|
| **即用即发** | 分享到社交/博客/PPT 时，导出图自带标题、logo、品牌色，无需再用 Figma/PS 二次设计 |
| **统一呈现** | 预设模板保证对外素材风格一致，提升项目品牌识别度 |
| **降低门槛** | 非设计背景的维护者也能产出规范海报，减少沟通与返工 |

### 5.3 描述

- 在 3D 导出图周围叠加：标题、副标题、logo、边框
- 输出为 PNG，尺寸可预设（如 1200×630 社交图、16:9 演讲图）

### 5.4 实施任务拆解

| 任务 | 描述 | 估算 | 依赖 |
|------|------|------|------|
| T1 | 定义海报模板配置：尺寸、边距、标题区、logo 区 | small | - |
| T2 | 使用 Canvas 2D 将 3D 导出图与 overlay 合成 | medium | export |
| T3 | 支持 1–2 个预设模板（如「社交图」「演讲图」） | small | - |
| T4 | 在顶栏或导出流程中增加「海报模板」入口 | small | ui |

### 5.5 推荐实施顺序

1. T1（配置结构）
2. T2（合成逻辑，复用 `getExportDataUrl`）
3. T3 + T4（预设与入口）

### 5.6 验收标准

- [ ] 用户可选择「导出为海报」，输出带标题区/logo 的 PNG
- [ ] 至少支持 1 个预设尺寸
- [ ] 品牌文案可配置（或写死在 config）

### 5.7 依赖与约束

- 依赖「局部截图」的裁剪能力（建议先完成方向一）
- 无后端，模板与品牌资源为前端静态配置

---

## 6. 综合排期建议

| 阶段 | 范围 | 估算 | 产出 |
|------|------|------|------|
| 第 1 周 | 局部截图：viewport 模式 + 用户选择 | 0.5–1d | 导出当前视口 |
| 第 2–3 周 | 3D 可见性：T1–T4 | 3–5d | Overview/Focus 模式 |
| 第 4 周 | 3D 可见性：T5–T6；局部截图：可选 cell 裁剪 | 2d | 校验、性能、cell 裁剪 |
| 第 5 周+ | 主题海报模板 | 2d | 1 个预设模板 |

**说明：** 可按实际节奏裁剪，优先「局部截图 viewport」与「3D 可见性 T1–T4」。

---

## 7. 依赖关系图

```
局部截图 viewport ────────────────────────────────────┐
                                                      │
3D 可见性 (Overview/Focus) ──┬── 局部截图 cell 裁剪    │
                             │                        │
                             └── 主题海报模板 ────────┘
```

---

## 8. 下一步

1. 确认本计划方向与优先级
2. 若采纳「局部截图 viewport」为首项，可产出 Task 级实施卡（类似 M5 Week 2）
3. 若优先 3D 可见性，可先细化 T1–T2 的接口与数据结构

---

## 9. 参考

- [3D 可见性改版设计](./20260304-3d-visibility-redesign.md)
- [详情 IA 改版](./20260304-model-details-ia-redesign.md)（已完成）
- [Phase 3 规划](../designs/2026-03-06-phase3-architecture-evolution.md)
- [推广图导出流程](./promo-export-flow.md)
- [Backlog Optional](../process-management/backlog.md#可选--后续optional)
