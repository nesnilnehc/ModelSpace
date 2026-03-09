# Cognitive Atlas M4 质量基线交付说明

**Date:** 2026-03-05  
**Status:** Implemented

## 目标

为后续迭代建立可持续的工程与体验基线，覆盖 4 项能力：

1. `app.js` 继续解耦（URL 状态、详情渲染编排抽离）
2. E2E 回归扩展到关键路径
3. 100+ 节点性能预算基线
4. 默认 UI 优化（连线默认关闭、模型筛选分组折叠）

## 交付内容

### 1) `app.js` 解耦

- 新增 `src/app3d/url-state.js`
  - 负责 query 解析、URL 状态应用、URL 同步
- 新增 `src/app3d/details.js`
  - 负责详情面板编排与相关模型分组
- `src/app.js` 调整为编排层，保留流程串联

### 2) E2E 回归增强

- `scripts/smoke-e2e.mjs` 扩展为关键路径回归，覆盖：
  - 语言切换
  - 模型筛选与 URL 同步
  - URL 重放恢复
  - 单元聚焦学习路径
  - 相关模型跳转
  - 嵌入模式
  - 导出 hook

### 3) 性能预算基线

- 新增 `scripts/perf-budget.mjs` 与 `npm run perf:budget`
- 通过路由补丁把运行样本扩展到 `120` 条模型（100+ 节点）
- 预算阈值：
  - 首屏时间 `<= 6000ms`
  - 平均 FPS `>= 20`
  - 导出耗时 `<= 4000ms`

### 4) UI 默认优化

- `linkToggle` 默认改为关闭（减少初始视觉密度）
- 模型筛选改为按分类分组折叠展示，并支持“展开全部/收起全部”

## 验证命令

```bash
npm run validate
npm run smoke:e2e
npm run perf:budget
```

