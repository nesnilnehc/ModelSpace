---
artifact_type: work-items-snapshot
created_by: capture-work-items
lifecycle: snapshot
date: 2026-03-10
trace_id: work-items-snapshot-2026-03-10
---

# 工作项快照（未完成事项）

**快照时间：** 2026-03-10  
**来源：** [backlog.md](../process-management/backlog.md) + [project-board/backlog/](../process-management/project-board/backlog/)  
**用途：** 记录当前未完成工作项，供 execution-alignment 与规划使用

---

## 1. 高优先级待办（Todo）

| 序号 | 工作项 | 追溯 | 说明 |
|------|--------|------|------|
| 1 | 架构演进收尾 | [Roadmap](../designs/2026-03-05-iteration-roadmap.md) | domain/core/ui 已抽离完成；下一里程碑后更新 docs/architecture 与 project-file-map |
| 2 | 文档同步 | [backlog.md § 文档同步](../process-management/backlog.md) | 下一里程碑完成后更新 `docs/architecture` 与 `project-file-map` |

---

## 2. Phase 3 可传播资产 — 未完成

| 序号 | 工作项 | 追溯 | 状态 |
|------|--------|------|------|
| 1 | 学习路径与练习设计 | [2026-03-09-learning-path-practice-design](../process-management/project-board/backlog/2026-03-09-learning-path-practice-design.md) | captured |
| 2 | 学习手册 Markdown 导出 | [2026-03-09-learning-handbook-markdown-export](../process-management/project-board/backlog/2026-03-09-learning-handbook-markdown-export.md) | captured，依赖学习路径设计 |

---

## 3. project-board 其他待办（未排入 backlog 主表）

| 工作项 | 路径 |
|--------|------|
| 竖卡 Logo 与品牌资产 | [2026-03-09-douyin-card-logo-brand](../process-management/project-board/backlog/2026-03-09-douyin-card-logo-brand.md) |
| 插图资产与使用场景 | [2026-03-09-illustration-assets-use-cases](../process-management/project-board/backlog/2026-03-09-illustration-assets-use-cases.md) |
| 落地页 URL 规范深化 | [2026-03-09-model-landing-page-url-spec](../process-management/project-board/backlog/2026-03-09-model-landing-page-url-spec.md) |
| SEO 落地页结构 | [2026-03-09-seo-landing-page-structure](../process-management/project-board/backlog/2026-03-09-seo-landing-page-structure.md) |
| Phase 3 可传播资产设计更新 | [2026-03-09-update-phase3-design-spreadable-assets](../process-management/project-board/backlog/2026-03-09-update-phase3-design-spreadable-assets.md) |
| 路径可检查进度 | [2026-03-09-path-checkable-progress](../process-management/project-board/backlog/2026-03-09-path-checkable-progress.md) |
| 路径清单导出 | [2026-03-09-path-checklist-export](../process-management/project-board/backlog/2026-03-09-path-checklist-export.md) |
| Newsletter 订阅考量 | [2026-03-09-newsletter-signup-consideration](../process-management/project-board/backlog/2026-03-09-newsletter-signup-consideration.md) |

---

## 4. 可选 / 降级项

| 工作项 | 说明 |
|--------|------|
| 局部截图（cell 裁剪）、主题海报模板 | 降级，按需求择机 |
| 3D 可见性改版 | [20260304-3d-visibility-redesign](../architecture/20260304-3d-visibility-redesign.md) — Proposed |
| Phase 3 3D 优化计划 | [20260306-phase3-3d-optimization-plan](../architecture/20260306-phase3-3d-optimization-plan.md) |

---

## 5. 本次会话完成项（2026-03-10）

| 完成项 | 说明 |
|--------|------|
| fix(export): 竖卡插图 cache-busting | 为 loadImage 增加 `?v=timestamp`，避免浏览器缓存导致导出旧图；commit e3d7820 |

---

## 维护说明

- 本快照为点状记录，不做持续维护。
- 下次快照时新建文档，或由 execution-alignment / project-cognitive-loop 触发更新。
- 主待办清单以 [backlog.md](../process-management/backlog.md) 为准。
