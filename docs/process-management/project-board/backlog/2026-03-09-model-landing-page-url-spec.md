---
artifact_type: backlog-item
created_by: capture-work-items
lifecycle: closed
type: requirement
date: 2026-03-09
closed_date: 2026-03-20
status: done
source: plan
trace_id: cognitive-atlas-landing-plan
---

# 模型落地页 URL 规范

## Problem / Need

抖音等短视频的 CTA 需要稳定、可复制的链接，供用户跳转至 Cognitive Atlas 获取完整认知对象信息（定义、坐标、关系、参考资料）。当前 URL 主要承载视图状态（筛选、视角、语言），缺少按模型 ID 或名称直达详情页的规范，不利于视频评论区置顶链接的维护和传播。

## Acceptance Criteria

- [x] 每个认知对象具备稳定、可书签的 URL（如 /model/MECE 或 ?model=MECE）
- [x] 落地页展示完整定义、坐标、relations、references
- [x] URL 规范写入 docs/guides 或与 share-url-best-practices 统一
- [x] 与现有 url-state.js 兼容，支持叠加筛选/语言等参数

## Verification (2026-03-20)

- `url-state.js` 支持 `model`/`mo` 参数；`app.js` 初始化时应用 `landingModel` 聚焦并展开详情
- 详情面板展示定义、坐标、relations、references
- `docs/guides/share-url-best-practices.md` 已文档化模型落地页 URL 用法
- 支持叠加 `l`、`embed`、`simple` 等参数

## Notes

- 与抖音竖卡、脚本模板中的 CTA 配合
- 支撑抖音 CTA → 落地页 → 体系化学习路径的衔接
