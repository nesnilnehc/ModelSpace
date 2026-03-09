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

# 学习路径清单导出（可勾选格式）

## Problem / Need

roadmap.sh 的路线图以可勾选清单形式呈现，便于用户复制到 Notion/Obsidian 后自行打勾。当前学习手册导出为静态 Markdown，未强调「可勾选」格式。需要导出时默认使用 `- [ ] 模型名` 的 checklist 格式，与 roadmap.sh 的可用性一致。

## Acceptance Criteria

- [ ] 学习手册 Markdown 导出中，路径内模型以 `- [ ] 模型名` 或 `- [x] 模型名` 格式呈现
- [ ] 可选：支持导出「带勾选状态」的版本（用户已标记完成的保留 `[x]`）
- [ ] 与学习路径设计、学习手册导出需求一致
- [ ] 便于粘贴至 Notion/Obsidian 等工具后继续勾选

## Notes

- 与 2026-03-09-learning-handbook-markdown-export 配合，可合并或作为其子需求
