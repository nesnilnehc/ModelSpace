# ModelSpace 项目目标

**Date:** 2026-03-06  
**Status:** Active  
**Traceability:** [Backlog](../process-management/backlog.md) → [Roadmap](../designs/2026-03-05-iteration-roadmap.md)

---

## 目标（三件套）

| 目标 | 含义 | 当前状态 |
|------|------|----------|
| **可展示** | 三维坐标系呈现，浏览、筛选、理解模型 | 3D 场景、坐标轴、筛选、详情已实现 |
| **可学习** | 用户能快速找到并理解模型，形成学习路径 | M2 学习路径、详情相关模型分组已实现 |
| **可传播** | 模型空间可被分享、嵌入、复用 | M3 分发能力（URL 同步、embed）已实现 |

---

## 数据治理目标（M5）

在保持静态前端的前提下，将模型库推进到**可持续维护**：

1. **数据变更可追踪**：版本化 + 变更日志（changelog）
2. **模型准入可复核**：流程化 + 可审计（准入模板）
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
