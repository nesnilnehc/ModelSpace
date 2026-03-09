---
artifact_type: backlog-item
created_by: capture-work-items
lifecycle: living
type: requirement
date: 2026-03-09
status: captured
source: roadmap.sh-benchmark
trace_id: roadmap-sh-inspiration
---

# 学习路径可勾选进度

## Problem / Need

roadmap.sh 的路线图支持用户逐项勾选进度，降低学习门槛、提升完成感。Cognitive Atlas 当前学习路径（prerequisite/next_step）仅展示关系，缺少「我已学完」的进度可见性。用户需要能在 Atlas 内或导出手册中勾选完成状态，形成可追踪的学习清单。

## Acceptance Criteria

- [ ] 学习路径内每个模型支持「已学/未学」标记（可在 Atlas 内或导出手册中体现）
- [ ] 进度可持久化（localStorage 或导出为含勾选状态的 Markdown）
- [ ] 与学习手册导出配合：导出的 Markdown 含 `- [ ] 模型名` 可勾选格式
- [ ] 可选：在 3D 或详情中显示路径完成度（如 3/7）

## Notes

- 参考 roadmap.sh 的 checkbox 交互
- 与学习手册 Markdown 导出、学习路径设计配合
