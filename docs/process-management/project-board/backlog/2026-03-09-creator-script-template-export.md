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

# 创作者脚本模板导出

## Problem / Need

创作者希望制作抖音视频讲解认知模型，但缺乏结构化脚本模板，容易遗漏定义、适用场景或关联模型。需要按 v2 schema 导出标准脚本结构，确保视频内容准确、可追溯，并便于批量生产（如钩子→定义→例子→关联）的短视频系列。

## Acceptance Criteria

- [ ] 支持按单模型导出脚本模板，结构：钩子(3s) → 定义(10s) → 例子(15s) → 关联(5s)
- [ ] 内容源自 v2 schema：summary、definition、whenToUse、relations（prerequisite/next_step/pair_with）
- [ ] 输出格式便于创作者复制使用（Markdown 或纯文本）
- [ ] 脚本中可含落地页 URL 占位符，供 CTA 使用

## Notes

- 与抖音竖卡、落地页 URL 规范配合
- 支撑系列化路径（F）的批量生产
