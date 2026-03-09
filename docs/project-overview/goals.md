# Cognitive Atlas 项目目标

**Date:** 2026-03-06  
**Status:** Active  
**Traceability:** [Backlog](../process-management/backlog.md) → [Roadmap](../designs/2026-03-05-iteration-roadmap.md)

---

## 项目定义

| 项 | 内容 |
|---|---|
| 主名称 | Cognitive Atlas |
| 一句话描述 | 面向思维模型与认知对象的知识地图，帮助人和 AI 更快查找、理解、连接与引用。 |
| 当前产品形态 | 以静态前端 3D Explorer 展示 Cognitive Atlas v2 的核心对象与关系。 |

---

## 目标（三件套）

| 目标 | 含义 | 当前状态 |
|------|------|----------|
| **可展示** | 以 Atlas 视图呈现知识对象、坐标与关系 | 3D 场景、轴标签、筛选、详情已实现 |
| **可学习** | 用户能快速找到并理解对象，形成学习路径 | M2 学习路径、详情相关对象分组已实现 |
| **可传播** | Atlas 可被分享、嵌入、复用 | M3 分发能力（URL 同步、embed）已实现 |

### 可传播（补充）

- **抖音场景可传播认知资产**：竖卡、创作者脚本模板、落地页 URL，供短视频 CTA 链接；放弃 cell 裁剪、主题海报作为主传播资产（仅像素，不承载认知结构）。

### 可学习（补充）

- **体系化学习**：基于 prerequisite/next_step 的学习路径、每模型 practice 练习、复习节奏（1 天/3 天/1 周）、学习手册 Markdown 导出。

---

## 数据治理目标（M5）

在保持静态前端的前提下，将知识对象库推进到**可持续维护**：

1. **数据变更可追踪**：版本化 + 变更日志（changelog）
2. **对象准入可复核**：流程化 + 可审计（准入模板）
3. **质量门槛可验证**：结构 + 内容校验，CI 阻断

M5 已完成，见 [backlog](../process-management/backlog.md#m5-week-2变更可追踪)。

---

## 非目标（YAGNI 约束）

- 不引入后端、数据库、CMS
- 不做多用户协作、在线编辑后台
- 不做复杂图算法、自动抓取入库
- 优先「拆分重组」而非「重写」

---

## 参考

- [Project File Map](./project-file-map.md)
- [Iteration Roadmap](../designs/2026-03-05-iteration-roadmap.md)
- [M5 内容运营设计](../designs/2026-03-05-m5-content-operations.md)
