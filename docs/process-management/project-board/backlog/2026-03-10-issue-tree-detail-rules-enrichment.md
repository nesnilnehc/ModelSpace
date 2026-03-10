---
artifact_type: backlog-item
created_by: capture-work-items
lifecycle: living
type: requirement
date: 2026-03-10
status: captured
source: plan
trace_id: issue-tree-wikipedia-integration
---

# Issue Tree 详情面板展示「类型」与「四条规则」

## Problem / Need

Issue Tree Wikipedia 融入计划已落地（模型数据、参考来源、竖卡、抖音文案、issue-tree-reference.md）；竖卡已展示「四条规则」。落地页/详情面板目前仅显示参考来源，未展示 Issue tree 的**类型**（诊断树 vs 方案树）与**四条规则**（Chevallier/McKinsey），用户需跳转 docs 或维基才能获取。

## Acceptance Criteria

- [ ] 详情面板可展示模型专属的「类型」或「规则」字段（以 Issue Tree 为首例）
- [ ] 需扩展知识对象或新增 `MODEL_KNOWLEDGE_ENRICHMENT` 机制
- [ ] 规则表述与 `docs/guides/issue-tree-reference.md` 及维基一致

## Notes

- 计划中建议：先完成参考来源与竖卡，详情规则为后续增强
- 相关：`src/app.js` 详情构建、`src/domain/model-data.js` knowledgeObject
- 参考：`src/app3d/export.js` 竖卡 `extra.rules` 渲染逻辑
