# 学习路径草图（Path Sketches）

**Date:** 2026-03-20  
**Status:** Draft  
**Traceability:** [学习路径与练习设计](process-management/project-board/backlog/2026-03-09-learning-path-practice-design.md) → [路径驱动收集快照](process-management/project-board/backlog/2026-03-20-snapshot-path-driven-collection.md)

---

## 1. 路径一：结构思维入门

**目标**：掌握「拆解问题、不重不漏、根因向下」的结构化思维基础。  
**适用**：咨询/分析/问题解决场景的入门者。

### 节点列表与顺序

| 序号 | 模型 | 类别 | 说明 |
|------|------|------|------|
| 1 | MECE | Structure | 相互独立、完全穷尽；结构化拆解的基础原则 |
| 2 | Issue Tree | Structure | 将 MECE 应用于问题分解；逻辑树/问题树 |
| 3 | 5 Whys | Diagnosis | 向下追问根因；与 Issue Tree 配合做纵向深挖 |
| 4 | 5W1H | Structure | 横向 completeness 检查；补齐 What/Why/Who/When/Where/How |
| 5 | Fishbone Diagram | Diagnosis | 多维度因果分析；与 5 Whys 互补 |

### 提议的 prerequisite / next_step 关系

| Source | Type | Target | 理由 |
|--------|------|--------|------|
| MECE | prerequisite | Issue Tree | 学 Issue Tree 前需理解 MECE 原则 |
| Issue Tree | prerequisite | 5 Whys | 先会拆问题，再学纵向根因追问 |
| MECE | prerequisite | 5W1H | 5W1H 是 MECE 的横向应用之一 |
| 5 Whys | next_step | Fishbone Diagram | 5 Whys 单线追问后，可用鱼骨做多因分析 |
| Issue Tree | next_step | 5 Whys | 问题树拆解后，对关键分支做 5 Whys |

### 当前 COGNITIVE_ATLAS_RELATIONS 中的相关边

- 无 prerequisite / next_step（需新增）
- 已有：SWOT pair_with PESTLE、Porter 等（与本路径无关）

---

## 2. 路径二：Strategy 入门

**目标**：掌握「外部分析 → 内部盘点 → 战略选择 → 目标落地」的决策链路。  
**适用**：产品/创业/战略场景入门者。

### 节点列表与顺序

| 序号 | 模型 | 类别 | 说明 |
|------|------|------|------|
| 1 | SWOT | Strategy | 内外部优劣势与机会威胁；最易上手 |
| 2 | PESTLE | Strategy | 宏观环境分析；SWOT 外部维度的细化 |
| 3 | Porter's Five Forces | Strategy | 行业竞争五力；外部分析深入 |
| 4 | VRIO / Core Competence | Strategy | 内部资源与能力；SWOT 内部维度 |
| 5 | Generic Strategies | Strategy | 成本/差异化/聚焦；战略选择 |
| 6 | OKR | Strategy | 目标与关键成果；战略落地 |

### 提议的 prerequisite / next_step 关系

| Source | Type | Target | 理由 |
|--------|------|--------|------|
| SWOT | prerequisite | PESTLE | PESTLE 细化 SWOT 的 O/T |
| SWOT | prerequisite | Porter's Five Forces | 五力细化行业竞争面 |
| SWOT | prerequisite | VRIO | VRIO 细化 SWOT 的 S/W |
| PESTLE | next_step | Porter's Five Forces | 宏观→行业，递进 |
| Porter's Five Forces | next_step | Generic Strategies | 分析完竞争后做战略选择 |
| Generic Strategies | next_step | OKR | 战略选定后做目标分解 |

### 当前 COGNITIVE_ATLAS_RELATIONS 中的相关边

- SWOT pair_with PESTLE ✓
- SWOT pair_with Porter's Five Forces ✓
- 无 prerequisite / next_step（需新增）

---

## 3. 路径三：诊断 / 问题拆解

**目标**：掌握「根因追问、多因分析、失效预防」的诊断思维。  
**适用**：质量/运维/事故分析场景。

### 节点列表与顺序

| 序号 | 模型 | 类别 | 说明 |
|------|------|------|------|
| 1 | 5 Whys | Diagnosis | 纵向根因追问 |
| 2 | Fishbone Diagram | Diagnosis | 多维度因果（人机料法环等） |
| 3 | FMEA | Diagnosis | 失效模式与影响分析；事前预防 |
| 4 | Swiss Cheese Model | Diagnosis | 层层防御视角；与 FMEA 互补 |
| 5 | Red Teaming | Diagnosis | 对抗性测试思维 |

### 提议的 prerequisite / next_step 关系

| Source | Type | Target | 理由 |
|--------|------|--------|------|
| 5 Whys | prerequisite | Fishbone Diagram | 先会单线追问，再学多因展开 |
| Fishbone Diagram | next_step | FMEA | 因果分析后做系统性失效预防 |
| FMEA | pair_with | Swiss Cheese Model | 事前预防与层层防御视角互补 |
| Fishbone Diagram | next_step | Red Teaming | 理解因果后，用红队做对抗验证 |

### 当前 COGNITIVE_ATLAS_RELATIONS 中的相关边

- 无 Diagnosis 类别相关边（需新增）

---

## 4. 路径间衔接（可选）

| 路径 | 衔接点 | 目标路径 |
|------|--------|----------|
| 结构思维 | Issue Tree | Strategy（问题拆解后做战略分析） |
| 结构思维 | 5 Whys | 诊断路径（同节点，可自然过渡） |
| Strategy | OKR | 可选接 PDCA、RICE 等执行/优先级 |

---

## 5. 复习节奏建议

| 节点类型 | 建议节奏 | 说明 |
|----------|----------|------|
| 路径入口（如 MECE、SWOT） | 1 天 | 初次学习后次日回顾 |
| 路径中段 | 3 天 | 巩固理解 |
| 路径出口 / 综合应用 | 1 周 | 综合复习 |

（可写入学习手册 Markdown 导出时的复习提醒模板）

---

## 6. 缺口分析（Gap Analysis）

### 6.1 关系缺口

| 路径 | 需新增 prerequisite | 需新增 next_step | 需新增 pair_with |
|------|---------------------|------------------|------------------|
| 结构思维 | MECE→Issue Tree, MECE→5W1H, Issue Tree→5 Whys | Issue Tree→5 Whys, 5 Whys→Fishbone | — |
| Strategy | SWOT→PESTLE, SWOT→Porter, SWOT→VRIO | PESTLE→Porter, Porter→Generic, Generic→OKR | — |
| 诊断 | 5 Whys→Fishbone | Fishbone→FMEA, Fishbone→Red Teaming | FMEA↔Swiss Cheese |

**汇总**：当前 `COGNITIVE_ATLAS_RELATIONS` 共 20 条边，**无 prerequisite / next_step**。需新增约 15–20 条学习路径关系。

### 6.2 对象缺口

| 路径 | 当前节点数 | 可能缺失对象 | 优先级 |
|------|------------|--------------|--------|
| 结构思维 | 5 | Pyramid Principle（金字塔原理）— 若希望显式纳入表达与结构衔接 | optional |
| Strategy | 6 | 已覆盖主要入门模型 | 无 |
| 诊断 | 5 | Root Cause Analysis（根因分析）— 可作为 5 Whys/Fishbone 的上位概念 | optional |

**结论**：现有 94 对象已足够支撑 3 条路径；对象缺口为可选补充。

### 6.3 practice 字段缺口

| 路径 | 节点数 | 有 practice 的节点 | 缺口 |
|------|--------|---------------------|------|
| 结构思维 | 5 | 0 | 5 个需补充 |
| Strategy | 6 | 0 | 6 个需补充 |
| 诊断 | 5 | 0 | 5 个需补充 |

**结论**：`model-mece-extensions.js` 与 model-library 中 **practice 字段普遍缺失**。需为路径内 16 个模型补充至少各一个练习建议。

### 6.4 执行优先级

1. **P0**：在 `COGNITIVE_ATLAS_RELATIONS` 中新增 prerequisite / next_step 边（路径草图→数据）
2. **P0**：为路径内模型补充 practice 字段
3. **P1**：验证路径可导出为学习手册（与 relations 一致）
4. **P2**：可选对象补充（Pyramid、RCA）

---

## 7. 下一步

1. 评审本草图：确认路径顺序与关系是否符合学习逻辑
2. 将提议的 relations 写入 `data/model-library.js` 的 `COGNITIVE_ATLAS_RELATIONS`
3. 为路径内模型设计 practice 文案，写入 model-mece-extensions 或 model-library
4. 对接学习手册 Markdown 导出 work item
