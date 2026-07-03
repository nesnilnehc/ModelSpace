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

# 抖音竖卡导出能力

## Problem / Need

创作者和运营需要将 Cognitive Atlas 中的认知对象以抖音原生格式分享，但现有导出（推广图、局部截图）为横版或通用尺寸，不适用于抖音 9:16 竖屏、3 秒可读的传播场景。抖音用户需要在快速滚动中识别模型名称、一句话定义，并通过 CTA 跳转落地页获取完整内容。

## Acceptance Criteria

- [x] 支持按单模型导出 9:16 竖卡
- [x] 信息层级：模型名称 → 概念 → 应用场景/适用领域 → 获取更多（引导）
- [x] 设计原则：第一次输出核心价值，引导指向更多价值（关联模型·学习路径·练习 → 评论置顶）
- [x] 输出适配抖音发布格式（1080×1920）

## Notes

- 与创作者脚本模板、落地页 URL 规范配合使用
- 放弃 cell 裁剪、主题海报作为主传播资产

## Verification (2026-03-20)

- `scripts/export-douyin-card.mjs` supports single-model 9:16 card export.
- The top-level backlog marks Phase 3 D/E/G as complete.
- Follow-up visual feedback was addressed in `fix(export): douyin card feedback; fix(illustration): FMEA redesign and centering`.
