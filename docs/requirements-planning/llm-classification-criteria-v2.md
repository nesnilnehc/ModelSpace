# Cognitive Atlas v2 坐标 MECE 判定标准

> 用于 AI 或人工对认知模型进行三维坐标分类。与 [cognitive-atlas-v2-system-spec.md](cognitive-atlas-v2-system-spec.md) 配套使用。

## 1. 坐标系统概要

| Axis | Name | 取值 1–5 |
|------|------|----------|
| X | DecisionLifecycle | 1 Sensemaking → 2 Diagnosis → 3 Design → 4 Execution → 5 Adaptation |
| Y | AbstractionLevel | 1 Meta → 2 Conceptual → 3 Structural → 4 Procedural → 5 Instrumental |
| Z | ApplicationScale | 1 Individual → 2 Team → 3 Organization → 4 Ecosystem → 5 Societal |

## 2. 判定顺序与冲突裁决

1. **判定顺序**：Y → Z → X（抽象层级最稳定，先定；生命周期相对易歧义，最后定）
2. **冲突裁决**：核心问题 > 主要产出 > 典型场景
3. **强制单值**：每轴仅一个主归属，若出现双归属则按上述优先级裁决
4. **歧义自检**：当某轴有歧义时，先查**边界规则**（§3.1、§4.1、§5.1），再比对**锚点模型**；若仍不确定，引用排除标准逐一排除

---

## 3. X 轴：DecisionLifecycle（决策生命周期）

**定义**：该模型在决策循环中的主要作用阶段。判定时以**主要产出形态**与**核心问题**为准。

### 3.1 边界规则（优先适用）

| 边界 | 判别规则 |
|------|----------|
| **1 vs 2** | 主要产出为**因果链、根因结论、风险清单、归因结论** → 2 Diagnosis；主要产出为**问题界定、结构/树/矩阵/清单（用于划分边界、穷尽分类、澄清范畴）** → 1 Sensemaking |
| **2 vs 3** | 核心问题为**定位根因、归因、识别风险** → 2；核心问题为**做取舍、排序、资源配置、路径规划** → 3 |
| **3 vs 4** | 产出为**策略组合、路线图、优先级**（规划层）→ 3；产出为**行动计划、执行节奏、可执行步骤**（操作层）→ 4 |
| **4 vs 5** | 单次执行闭环 → 4；持续改进、修正假设、学习迭代 → 5 |

### 3.2 取值表（含锚点）

| 值 | 名称 | 进入标准 | 排除标准 | 锚点模型 |
|----|------|----------|----------|----------|
| 1 | Sensemaking | 理解现状、澄清问题、建立共识；产出为问题界定、结构、矩阵、清单（非因果） | 不以根因/归因/风险为主；不以方案选择或执行为主 | MECE, Issue Tree, 5W1H, Systems Thinking, SCQA, PESTLE, Porter's Five Forces |
| 2 | Diagnosis | 定位根因、归因、识别风险或失效；产出为因果链、风险清单、归因结论 | 不以未来方案规划为主；不以执行落地为主 | 5 Whys, Fishbone, FMEA, SWOT, Swiss Cheese, 360 Feedback |
| 3 | Design | 方案选择、优先级、路径规划、资源配置；产出为策略组合、路线图、优先级 | 不以复盘归因为主；不以执行操作为主 | RICE, Eisenhower, BCG Matrix, Design Thinking, MVP |
| 4 | Execution | 指导行动、落地实施；产出为行动计划、执行节奏、可执行步骤 | 不以理解/分析为主；不以学习与适应为主 | OODA Loop, Lean Startup, OKR, Kotter's 8 Steps |
| 5 | Adaptation | 学习、反馈、迭代、校准假设；产出为改进规则、学习结论 | 不以单次决策或分析为主 | PDCA, Double Loop Learning |

---

## 4. Y 轴：AbstractionLevel（抽象层级）

**定义**：该模型的抽象程度，从元认知到可操作工具。判定时以**操作方式**与**产出形态**为准。

### 4.1 边界规则（优先适用）

| 边界 | 判别规则 |
|------|----------|
| **1 vs 2** | 用于**校准思维、选择/组合其他模型**、反思认知偏差 → 1 Meta；表达**单一概念/原则**，可直接用于判断 → 2 Conceptual |
| **2 vs 3** | 原则或概念但**无具体结构/矩阵** → 2；提供**树、矩阵、多维度框架**组织问题 → 3 Structural |
| **3 vs 4** | 有结构但**无明确时序步骤** → 3；有**步骤、流程、阶段**可依次执行 → 4 Procedural |
| **4 vs 5** | 有流程但需理解后执行 → 4；**可直接填写**的模板、清单、画布 → 5 Instrumental |

### 4.2 取值表（含锚点）

| 值 | 名称 | 进入标准 | 排除标准 | 锚点模型 |
|----|------|----------|----------|----------|
| 1 | Meta | 校准思维方式、选择/组合模型、反思认知偏差；产出为思维规则 | 不提供可直接执行的步骤或工具 | Meta-Cognition, Cognitive Bias, Double Loop Learning, Systems Thinking |
| 2 | Conceptual | 概念、原则、判断规则；可迁移但无固定步骤或结构 | 不提供具体结构或矩阵；不提供可直接套用流程 | MECE, First Principles, Occam's Razor, Pareto Principle |
| 3 | Structural | 组织问题维度；产出为树、矩阵、结构图（非填表） | 不提供时序步骤；不提供可直接填写模板 | SWOT, BCG Matrix, Issue Tree, Fishbone, Flywheel |
| 4 | Procedural | 有明确步骤或流程；产出为流程、方法 | 不提供可直接填写模板 | 5 Whys, PDCA, Design Thinking, OODA Loop |
| 5 | Instrumental | 可直接套用的模板、清单、画布；迁移性有限 | 不依赖抽象原则 | PREP, SCQA, Business Model Canvas, RACI, Eisenhower Matrix |

---

## 5. Z 轴：ApplicationScale（应用尺度）

**定义**：该模型主要作用的系统尺度。判定时以**典型场景**与**主要作用对象**为准。

### 5.1 边界规则（优先适用）

| 边界 | 判别规则 |
|------|----------|
| **1 vs 2** | 典型场景为**自学、个人决策、个人知识管理** → 1 Individual；典型场景为**会议、工作坊、小组共创** → 2 Team |
| **2 vs 3** | 作用对象为**项目组、会议、工作坊** → 2；作用对象为**组织战略、绩效、变革、资源配置** → 3 Organization |
| **3 vs 4** | 聚焦**单一组织内部**能力与策略 → 3；聚焦**市场、产业、客户、竞争** → 4 Ecosystem |
| **4 vs 5** | 市场/产业/生态层面 → 4；**公共政策、社会治理、全球**层面 → 5 Societal |

### 5.2 取值表（含锚点）

| 值 | 名称 | 进入标准 | 排除标准 | 锚点模型 |
|----|------|----------|----------|----------|
| 1 | Individual | 个人学习、记忆、思考、自我管理；自学、个人决策 | 不涉及协作或组织 | First Principles, Feynman Technique, Spaced Repetition, P.A.R.A. |
| 2 | Team | 小组协作、会议、团队执行；会议引导、团队决策 | 不聚焦组织战略或生态 | MECE, 5 Whys, ORID, RICE, Lean Startup |
| 3 | Organization | 组织战略、资源配置、组织能力；战略规划、绩效管理 | 不聚焦市场或社会 | OKR, SWOT, Kotter's 8 Steps, BCG Matrix |
| 4 | Ecosystem | 市场、产业、客户、竞争；生态分析、市场定位 | 不聚焦单一组织内部 | Porter's Five Forces, PESTLE, JTBD, AARRR |
| 5 | Societal | 政策、公共、社会或全球；公共政策、社会治理 | 不聚焦组织或市场 | Tragedy of the Commons, Black Swan |

---

## 6. 证据输入要求

分类时至少需要以下输入之一：

- **完整证据卡**：核心问题、主要产出、典型场景、操作方式
- **最小输入**：name、descriptionEn、category（无完整证据卡时在 axisRationale 中注明「无完整证据卡」）

---

## Appendix: Prompt Template

以下提示词用于在对话中调用 AI 进行模型分类。执行时请读取本文档前述 MECE 标准。

---

**复制以下内容作为调用提示词：**

你正在对 Cognitive Atlas 中的认知模型进行 v2 三维坐标分类。

**任务**：根据提供的模型信息，按 `docs/requirements-planning/llm-classification-criteria-v2.md` 中的 MECE 判定标准，输出该模型的 (x, y, z) 坐标及每轴的判定依据。

**判定顺序**：先 Y，再 Z，最后 X。**歧义时**：查边界规则（§3.1、§4.1、§5.1），比对锚点模型。冲突时按：核心问题 > 主要产出 > 典型场景。

**输入**（每条模型）：name, aliasZh, descriptionEn, category；若有证据卡则含：核心问题、主要产出、典型场景、操作方式。

**输出格式**（JSON，每模型一条）：

```json
{
  "name": "模型名",
  "coordinates": { "x": 1-5, "y": 1-5, "z": 1-5 },
  "axisRationale": {
    "x": "X 轴判定依据",
    "y": "Y 轴判定依据",
    "z": "Z 轴判定依据"
  }
}
```

**单模型**：直接输出上述 JSON。**批量**：输出 JSON 数组，每批建议不超过 20 个。
