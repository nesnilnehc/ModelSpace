---
artifact_type: backlog-item
created_by: capture-work-items
lifecycle: living
type: requirement
date: 2026-03-09
status: captured
source: plan
trace_id: cognitive-atlas-landing-plan
---

# 学习路径与练习设计

## Problem / Need

用户从抖音落地页进入后，缺乏体系化学习入口。当前 Atlas 已有 prerequisite/next_step/pair_with 关系，但未显式组织为「路径」（如 Strategy 入门、结构思维入门）。同时，每个模型的 practice 字段可支撑练习，但复习节奏（Spaced Repetition）未结构化。需要设计路径形态与练习/复习节奏，支撑体系化学习。

## Acceptance Criteria

- [x] 基于 prerequisite/next_step 定义至少 2–3 条可追溯学习路径（如 Strategy 入门、结构思维入门）
- [ ] 路径内节点与 relations 一致，可导出为学习手册
- [ ] 为路径内模型补充或验证 practice 字段（每模型至少一个练习建议）
- [x] 定义复习节奏建议（如 1 天/3 天/1 周），可写入导出手册

## 2026-03-20 策略与路径

- **策略目标**：见 [2026-03-20-learning-strategy-goals.md](../../designs/2026-03-20-learning-strategy-goals.md)
- **路径草图**：见 [2026-03-20-learning-path-sketches.md](../../designs/2026-03-20-learning-path-sketches.md)

- **路径一**：结构思维入门 — MECE → Issue Tree → 5 Whys → 5W1H → Fishbone
- **路径二**：Strategy 入门 — SWOT → PESTLE / Porter / VRIO → Generic Strategies → OKR
- **路径三**：诊断/问题拆解 — 5 Whys → Fishbone → FMEA → Swiss Cheese → Red Teaming

**缺口**：需新增 ~15–20 条 prerequisite/next_step 关系；需为 16 个路径内模型补充 practice。

## Notes

- 与学习手册 Markdown 导出配合
- 支撑 Atlas 内学习模式（可选后续）
