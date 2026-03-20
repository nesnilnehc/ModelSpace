---
artifact_type: backlog-item
created_by: plan-next
lifecycle: living
type: plan
subtype: snapshot
date: 2026-03-20
status: captured
source: plan-next
trace_id: cognitive-atlas-path-driven-collection
---

# 工作快照：路径驱动收集 + 适度扩容

## 策略

**适度扩容 + 同步建路径**（非二选一）：路径设计与对象收集并行，互为输入。

---

## 1. 定义「适度」

先选定 2–3 条主路径，明确每条路径所需对象集合。

| 路径候选 | 预期对象 | 当前覆盖 | 待确认 |
|----------|----------|----------|--------|
| Strategy 入门 | 战略/决策类（SWOT、BCG、Porter、OKR 等） | ~43 Strategy 类别 | prerequisite/next_step 链是否完整 |
| 结构思维入门 | MECE、Issue Tree、5 Whys、Pyramid 等 | Structure + 部分 Diagnosis | 关系边是否连续 |
| 诊断/问题拆解 | 5 Whys、Fishbone、Root Cause 等 | Diagnosis 类别 | 与结构思维的衔接 |

**动作**：对照 `data/model-library.js` 与 `relations` 边，梳理每条路径的节点与 prerequisite/next_step 缺口。

---

## 2. 路径驱动收集

- **原则**：为补全路径而收集，不做泛泛扩充
- **输入**：路径设计暴露的缺节点、缺关系
- **输出**：按路径维度的补充清单（对象名、建议坐标、relations）

**动作**：在「学习路径与练习设计」work item 中，先产出路径草图，再推导补全清单。

---

## 3. 设定节奏

| 阶段 | 内容 |
|------|------|
| 路径 1 | 选定 Strategy 入门或结构思维之一，完成路径定义 → 补充对象 → 验证 |
| 路径 2 | 在前一条路径闭环后，启动第二条 |
| 路径 3 | 同上 |

**原则**：每完成一条路径，再做一轮对象补充，避免一次铺开过多。

---

## 4. 与既有 work item 的衔接

| Work Item | 衔接方式 |
|-----------|----------|
| [学习路径与练习设计](2026-03-09-learning-path-practice-design.md) | 产出路径草图 + 对象缺口清单；路径设计先行 |
| [学习手册 Markdown 导出](2026-03-09-learning-handbook-markdown-export.md) | 依赖路径设计完成；可对单条路径先实现导出 |
| 模型准入 | 新增对象沿用 model-admission-template、classify-cognitive-model |

---

## 5. 推荐执行顺序

1. ~~**学习路径与练习设计**~~ — 路径草图已产出（2026-03-20）
2. ~~**缺口分析**~~ — 已完成，见 [2026-03-20-learning-path-sketches.md](../../designs/2026-03-20-learning-path-sketches.md)
3. **补 relations** — 在 COGNITIVE_ATLAS_RELATIONS 中新增 prerequisite/next_step 边
4. **补 practice** — 为路径内 16 个模型补充 practice 字段
5. **验证路径** — 确保 prerequisite/next_step 链闭合
6. **学习手册导出** — 对路径 1 实现 Markdown 导出
7. **重复** — 路径 2、路径 3

---

## Notes

- 当前 ~94 对象，Strategy 43、Meta 28、Expression 11、Structure 6、Diagnosis 6；Strategy 与 Meta 较密，Structure/Diagnosis 可适度扩充以支撑路径
- 关系词表见 `cognitive-atlas-v2-system-spec.md`：prerequisite、next_step、pair_with
- 本快照为 plan-next 策略产出，可随执行更新
