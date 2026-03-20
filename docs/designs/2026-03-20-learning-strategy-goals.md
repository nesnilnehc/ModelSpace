# 可学习维度策略目标（Learning Strategy Goals）

**Date:** 2026-03-20  
**Status:** Draft  
**Traceability:** [Goals](../project-overview/goals.md) → [Phase 3 设计](2026-03-06-phase3-architecture-evolution.md) → [学习路径草图](2026-03-20-learning-path-sketches.md)

---

## 1. 策略定位

在「可展示」「可学习」「可传播」三件套中，**可学习** 对应：用户能快速找到并理解对象，形成学习路径。

本策略回答：我们为何做学习路径？为谁做？做到什么程度算成功？

---

## 2. 目标用户与场景

| 用户类型 | 场景 | 核心诉求 |
|----------|------|----------|
| **内容消费者** | 从抖音/链接进入落地页 | 被单点吸引后，想知道「接下来学什么」「怎么系统学」 |
| **自学者** | 在 Atlas 内浏览 | 不想漫无目的逛，希望有明确路径可跟 |
| **创作者/讲师** | 备课或设计课程 | 需要可引用的路径结构、练习建议，支撑输出 |

---

## 3. 策略目标

| 目标 ID | 目标 | 说明 |
|---------|------|------|
| **LS-1** | 路径可见 | 用户能在 Atlas 或落地页看到 2–3 条命名学习路径（如「结构思维入门」「Strategy 入门」），并理解路径意图 |
| **LS-2** | 顺序可跟 | 路径内节点有清晰 prerequisite/next_step，用户能按顺序逐步学习，不迷路 |
| **LS-3** | 练习可做 | 路径内每个模型至少有 1 个 practice 练习建议，用户能「学了就用」 |
| **LS-4** | 内容可带走 | 用户能按路径导出学习手册（Markdown），在 Notion/Obsidian 等工具中离线学习 |
| **LS-5** | 与传播闭环 | 抖音 CTA → 落地页 → 选择路径 → 体系化学习，形成「吸引→深化」的漏斗 |

---

## 4. 成功指标（如何衡量）

| 指标 | 定义 | 当前基线 | 目标 |
|------|------|----------|------|
| 路径覆盖 | 已定义的路径数 | 0（草图有，未产品化） | ≥ 2 条 |
| 关系完整度 | 路径内 prerequisite/next_step 边数 / 理论应有边数 | 15/15（数据已有） | 100% |
| practice 覆盖 | 路径内模型有 practice 的数量 / 路径内模型总数 | 0/16 | 100% |
| 导出手册 | 是否支持按路径导出 Markdown | 不支持 | 支持 |

*注：暂无流量/转化数据，优先用「能力是否到位」衡量。*

---

## 5. 非目标（边界）

| 不做 | 理由 |
|------|------|
| Atlas 内 SRS 间隔重复系统 | YAGNI；复习节奏可写在手册中，由用户自行执行 |
| 多用户学习进度追踪 | 无后端；静态前端 |
| 自动推荐路径 | 路径数量少，手动选择即可 |
| 与外部 LMS 集成 | 非当前范围 |

---

## 6. 与已有工作的衔接

| 产出 | 衔接 |
|------|------|
| [学习路径草图](2026-03-20-learning-path-sketches.md) | 路径定义 → 支撑 LS-1、LS-2 |
| COGNITIVE_ATLAS_RELATIONS 中的 prerequisite/next_step | 数据就绪 → 需 UI 显式展示 |
| [学习路径与练习设计](process-management/project-board/backlog/2026-03-09-learning-path-practice-design.md) | 执行 work item → 实现 LS-2、LS-3 |
| [学习手册 Markdown 导出](process-management/project-board/backlog/2026-03-09-learning-handbook-markdown-export.md) | 执行 work item → 实现 LS-4 |
| 落地页 URL、竖卡、脚本 | 传播入口 → 支撑 LS-5 |

---

## 7. 推荐执行顺序

1. **确认本策略** — 目标、非目标、指标是否接受  
2. **补 practice** — 为路径内 16 个模型补充 practice，达成 LS-3  
3. **路径入口** — 在落地页或 Atlas 增加「学习路径」入口，展示 2–3 条路径（LS-1）  
4. **详情区展示 prerequisite/next_step** — 让用户在看单模型时知道「先学/后学」（LS-2）  
5. **学习手册导出** — 按路径导出 Markdown（LS-4）

---

## 8. 参考

- [Goals 可学习补充](../project-overview/goals.md#可学习补充)
- [可传播认知资产与体系化学习需求](../requirements-planning/spreadable-cognitive-assets-requirements.md)
- [Phase 3 设计：体系化学习](2026-03-06-phase3-architecture-evolution.md#体系化学习2026-03-09-新增)
