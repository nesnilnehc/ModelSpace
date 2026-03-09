# 认知模型 3D 可视化设计原则优化方案

**Date:** 2026-03-05  
**Status:** Implemented (Phase 1)  
**Scope:** 3D scene, node rendering, attention guidance

## 目标

依据数据可视化、认知负荷、注意力引导等设计原则，降低视觉冗余、提升可读性与可维护性。

---

## 设计原则与对应措施

### 1. Data–ink Ratio（Tufte）

**原则**：墨水应优先用于传达数据，减少装饰性元素。

| 措施 | 状态 | 说明 |
|------|------|------|
| 移除 Halo 光晕 | ✅ 已实施 | 去掉 BackSide 半透明球，减少视觉噪声 |
| 移除 Orbit 环绕环 | ✅ 已实施 | 去掉旋转环，降低元素重叠 |
| 简化节点材质 | ✅ 已实施 | MeshPhysicalMaterial → MeshStandardMaterial，去掉 clearcoat |

### 2. 认知负荷（Cognitive Load Theory）

**原则**：降低外在负荷（界面干扰），保留必要支架（结构、轴）。

| 措施 | 状态 | 说明 |
|------|------|------|
| 简化节点材质 | ✅ 已实施 | 降低 roughness/metalness，弱化玻璃效果 |
| 图层开关（渐进披露） | ✅ 已有 | 连线、网格、最近邻高亮已支持 toggle |
| 默认精简视图 | 建议 | 可考虑默认关闭连线，用户按需开启 |

### 3. 注意力引导（Attention-Guided Visualization）

**原则**：焦点（选中/hover）突出，非焦点弱化，减少干扰。

| 措施 | 状态 | 说明 |
|------|------|------|
| 非焦点节点弱化 | ✅ 已实施 | 选中或 hover 时，非焦点节点 opacity→0.42，emissive→0.08 |
| 焦点节点强化 | ✅ 已有 | 选中/hover/邻居：scale、emissive、opacity 增强 |
| 详情按需显示 | ✅ 已有 | 标签仅 hover/选中/邻居时显示 |

### 4. 格式塔（Gestalt）

**原则**：接近性、相似性、简洁性，帮助形成空间分组。

| 措施 | 状态 | 说明 |
|------|------|------|
| 颜色编码类别 | ✅ 已有 | 按 Expression / Structure / Diagnosis / Strategy / Meta 着色 |
| 网格单元 | ✅ 已有 | 认知长方体网格作为空间边界 |
| 连线表示同类 | ✅ 已有 | 同类对象连线，形成视觉分组 |

### 5. 层次信息（Layered Information）

**原则**：常驻层简洁，按需层可切换。

| Layer | 内容 | 可关 |
|-------|------|------|
| L1 | 轴、空间单元、节点 | 否 |
| L2 | 连线、网格、节点标签 | 是（toggle） |
| L3 | 详情面板、最近邻高亮 | 是（toggle） |

---

## 已实施变更摘要

1. **移除 Halo 与 Orbit 环**  
   节点仅保留球体本体，界面更干净。

2. **MeshStandardMaterial**  
   替代 MeshPhysicalMaterial，去掉 clearcoat/clearcoatRoughness，降低材质复杂度。

3. **注意力引导**  
   当存在 selectedMesh 或 hoveredMesh 时，非焦点节点 opacity=0.42、emissiveIntensity=0.08，突出当前焦点。

4. **移除 Orbit 环动画**  
   animate 中不再更新 ring.rotation，减轻每帧计算和视觉动效。

---

## 后续建议（原有）

1. **默认关闭连线**：可考虑默认关闭「显示同类对象连线」，减少初始视觉负荷。  
2. **可选 Halo**：增加「高亮光晕」开关，供需要强调单节点时使用。  
3. **色盲模式**：提供形状/纹理辅助区分类别，不依赖单一颜色。  
4. **减少动效**：如提供「减少动画」偏好，降低晕动症风险。

---

## 进一步优化点（代码与截图分析 2026-03-05）

### 3D 场景

| 项目 | 现状 | 建议 | 优先级 |
|------|------|------|--------|
| 连线默认开启 | linkToggle 默认 checked | 默认 unchecked，降低初始视觉密度 | 高 |
| 节点 emissive | emissiveIntensity 0.28，仍有发光感 | 可再降至 0.18–0.22，进一步弱化光晕 | 中 |
| 网格默认 | pyramidToggle 默认 checked | 可默认 off，按需打开 | 中 |
| 星场 + 地面网格 | 多层星点 + 远处网格线 | 低端设备可简化为一层星点 | 低 |

### 2D 面板 / UI

| 项目 | 现状 | 建议 | 优先级 |
|------|------|------|--------|
| 对象标签列表 | 80+ 个 tag 同时展示，需滚动 | 增加「按类别折叠」或「仅显示已选」视图 | 高 |
| View dock 按钮 | 9 个按钮并排 | 将「沿 X/Y/Z 轴看」收入下拉，减少横向占用 | 中 |
| 图例说明 | 「拖拽旋转…」常驻显示 | 改为 tooltip 或 ? 帮助入口 | 低 |
| 空间筛选 Tab | 与对象筛选并列 | 使用频率低可合并或收起到「高级筛选」 | 低 |

### 性能与可访问性

| 项目 | 现状 | 建议 | 优先级 |
|------|------|------|--------|
| refreshNodeStyles | 相机移动时每帧遍历所有节点 | 仅在有 selected/hover 时应用弱化，减少遍历 | 中 |
| 类别色板 | 5 色，色盲友好性未知 | 引入色盲安全色板或形状/纹理辅助 | 中 |
| Tooltip 对比度 | background rgba(8,12,24,0.92) | 提高背景不透明度或加描边，增强可读性 | 低 |

### 布局与响应式

| 项目 | 现状 | 建议 | 优先级 |
|------|------|------|------|
| 移动端 | 默认隐藏工具栏和详情 | 已合理，可增加「快速恢复」浮动按钮 | 低 |
| 小屏 | 面板 max-height 受限 | 已使用 scroll，可考虑优先展示筛选，折叠「这是什么」 | 低 |

---

## 参考

- Edward Tufte, *The Visual Display of Quantitative Information*
- John Sweller, Cognitive Load Theory
- Ben Shneiderman, Visual Information-Seeking Mantra (Overview first, zoom and filter, details on demand)
