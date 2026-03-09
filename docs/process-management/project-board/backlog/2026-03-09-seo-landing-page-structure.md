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

# 单模型/路径 SEO 落地页结构

## Problem / Need

roadmap.sh 为每个技能/路线提供独立页面，利于 SEO 与分享。Cognitive Atlas 落地页 URL 规范（G）已规划，但未明确页面结构。需要定义单模型页、单路径页的 HTML 结构（title、meta description、结构化数据），确保搜索引擎可索引、社交媒体可预览。

## Acceptance Criteria

- [ ] 单模型落地页：含 `<title>`、`<meta name="description">`、可选 Open Graph / Twitter Card
- [ ] 单路径落地页：同上，路径名称与模型列表可被爬取
- [ ] 与模型落地页 URL 规范（2026-03-09-model-landing-page-url-spec）配合
- [ ] 无后端；可静态生成或 SPA + 预渲染

## Notes

- 参考 roadmap.sh 的 per-skill 页面结构
- 利于抖音 CTA 链接的预览展示
