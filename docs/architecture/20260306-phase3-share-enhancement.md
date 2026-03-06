# Phase 3 分享能力增强

**Date:** 2026-03-06  
**Status:** Implemented  
**Scope:** 分享 URL 优化、复制分享链接、分享最佳实践文档  
**Traceability:** [Phase3 规划](../designs/2026-03-06-phase3-architecture-evolution.md)

---

## 1. 交付物

| 交付物 | 状态 |
|--------|------|
| URL 短格式解析 | parseUrlStateFromQuery 支持 l/v/m/c/t 等短键 |
| buildShareUrl(useShort) | url-state 控制器新增，生成短格式分享 URL |
| 复制分享链接按钮 | 顶栏 view-dock，点击复制短格式 URL 到剪贴板 |
| 分享最佳实践文档 | docs/guides/share-url-best-practices.md |

---

## 2. 短格式参数

| 短 | 长 | 含义 |
|----|----|------|
| l | lang | 语言 |
| v | view | 视角 |
| m | models | 选中模型 |
| c | cells | 空间单元 |
| t | tab | 工具栏标签 |
| ln | link | 连线开关 |
| g | grid | 网格开关 |
| n | neighbor | 最近邻开关 |
| tb | toolbar | 工具栏显隐 |
| d | detail | 详情显隐 |

---

## 3. 验收

- [x] smoke:e2e 通过
- [x] 复制按钮在 embed 模式下隐藏
