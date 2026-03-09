# Cognitive Atlas v2 规范（实施版）

## 1. 项目重定义

| 项 | 内容 |
|---|---|
| 主名称 | Cognitive Atlas |
| 一句话定义 | Cognitive Atlas 是一张面向思维模型与认知对象的知识地图，前台帮助人快速查找与学习，底层为 AI 提供稳定结构。 |
| 核心理念 | 对人简单进入，对 AI 保持稳定结构。 |
| 解决问题 | 解决传统知识库“难以查找、难以持续学习、难以被 AI 稳定引用”的问题。 |
| 与普通知识库差异 | 普通知识库以文档和标签为主；Cognitive Atlas 以可导航对象、学习路径和结构化关系为主。 |

## 2. 知识对象类型系统（10类）

| Type | Definition | Purpose | Typical Usage |
|---|---|---|---|
| Theory | 解释机制与因果规律的命题体系 | 解释与预测 | 解释复杂现象 |
| Principle | 跨场景的规范性判断规则 | 决策约束 | 做取舍时校准 |
| Framework | 组织问题维度的分析框架 | 结构化问题 | 建模问题边界 |
| Model | 对系统或机制的简化表征 | 推演/比较 | 预判结果 |
| Method | 可重复执行的步骤流程 | 执行落地 | 解决任务 |
| Pattern | 可复用的结构化解法形态 | 复用经验 | 设计结构 |
| Heuristic | 快速近似的经验法则 | 快速决策 | 不确定下快速筛选 |
| Tool | 承载方法执行的具体工具 | 操作实现 | 模板、软件、清单 |
| Metric | 度量状态与结果的指标 | 监控评估 | 跟踪改进 |
| System | 由角色/流程/反馈构成的运行整体 | 组织能力 | 端到端治理 |

### 相近类型边界

| Pair | 区分规则 |
|---|---|
| Framework vs Model | Framework 组织“看什么”；Model 表达“如何运作” |
| Method vs Tool | Method 是步骤逻辑；Tool 是执行载体 |
| Principle vs Heuristic | Principle 更稳定且规范；Heuristic 更快更近似 |
| Pattern vs Method | Pattern 是结构形态；Method 是时序流程 |

## 3. 三维坐标系统（v2）

| Axis | Name | Definition | Enum(有序) |
|---|---|---|---|
| X | DecisionLifecycle | 工件在决策循环中的主要作用阶段 | 1 Sensemaking, 2 Diagnosis, 3 Design, 4 Execution, 5 Adaptation |
| Y | AbstractionLevel | 工件的抽象层级 | 1 Meta, 2 Conceptual, 3 Structural, 4 Procedural, 5 Instrumental |
| Z | ApplicationScale | 工件主要作用的系统尺度 | 1 Individual, 2 Team, 3 Organization, 4 Ecosystem, 5 Societal |

### 正交性说明

| 轴对 | 独立性解释 |
|---|---|
| X vs Y | 使用阶段与抽象层级可独立变化 |
| X vs Z | 使用阶段与应用尺度不互相决定 |
| Y vs Z | 抽象层级与组织尺度不构成包含关系 |

## 4. 知识对象标准 Schema

规范采用三层对象视图，同一对象同时服务人类快读、学习路径与 AI 引用。

### 4.1 快读层（默认面向人）

| Field | Required | 作用 |
|---|---:|---|
| summary | Yes | 一句话定义 |
| problem | Yes | 主要解决的问题 |
| whenToUse | Yes | 适用场景 |
| whenNotToUse | No | 不适用边界 |
| commonMisuse | No | 常见误用 |

### 4.2 学习层（自我提升路径）

| Field | Required | 作用 |
|---|---:|---|
| whyLearn | No | 为什么值得学 |
| prerequisite | No | 前置对象，建议 0-2 个 |
| nextStep | No | 后续对象，建议 0-3 个 |
| pairWith | No | 搭配使用对象 |
| practice | No | 一个练习或行动建议 |

### 4.3 结构层（AI 与规范引用）

| Field | Required | 作用 |
|---|---:|---|
| id | Yes | 稳定唯一标识 |
| name | Yes | 对象名称 |
| aliases | No | 兼容别名 |
| objectType | Yes | 本体类型 |
| coordinates.primary | Yes | 主坐标 (x,y,z) |
| coordinates.secondary | No | 次坐标及权重 |
| axisRationale | Yes | 三轴判定理由 |
| definition | Yes | 严格定义 |
| references | No | 来源与参考资料 |
| relations | Yes | 与其他对象的关系边 |
| confidence | Yes | 分类置信度 |
| status | Yes | draft/active/deprecated |
| version | Yes | 语义版本 |

## 5. 关系系统（图谱）

第一阶段仅保留最小关系词表，目标是先保证低歧义，再逐步扩展。

| Relation | Meaning | Example |
|---|---|---|
| prerequisite | 学这个之前最好先懂 B | Issue Tree prerequisite MECE |
| next_step | 学完 A 之后最自然继续到 B | MECE next_step Issue Tree |
| pair_with | A 与 B 搭配使用更有效 | SWOT pair_with PESTLE |
| related | 两者确实相关，但不属于前三类 | Systems Thinking related Feedback Loop |
| contrast_with | 两者容易混淆，适合并排比较 | RICE contrast_with Eisenhower Matrix |

补充原则：

- 内容关系应尽量附带理由，避免泛化。
- `sameCell`、`sameCategory`、`nearestNeighbor` 属于派生关系，不属于主关系词表。
- 图谱不是树状分类：同一对象可拥有少量多向关系，但禁止把 `related` 当作默认垃圾桶。

## 6. 分类决策规则（强制）

### 6.1 类型判定规则

按“主要功能”判定主类型，必须单值输出。  
若多个类型并存，按优先级裁决：`核心问题 > 主要产出 > 典型场景`。

### 6.2 坐标判定规则

1. 输出主坐标 `(x,y,z)`（必填）。  
2. 可输出次坐标与权重（可选）。  
3. 低置信度对象必须先重写定义再重跑分类。  

### 6.3 门禁规则（本版本新增硬约束）

| 规则 | 约束 |
|---|---|
| R1 | 所有纳入对象必须自动分类成功（100%） |
| R2 | 自动分类失败对象不得进入主库 |
| R3 | 主库中不允许出现 unknown/unclassified |
| R4 | 入库前必须通过类型+坐标+关系最小校验 |

## 7. 示例映射（最小集）

| Object | Type | Coordinates (X,Y,Z) | 说明 |
|---|---|---|---|
| SWOT | Framework | (2,3,3) | 组织层诊断框架 |
| AARRR | Framework | (4,3,3) | 增长执行漏斗结构 |
| OKR | System | (4,4,3) | 组织目标管理系统 |
| First Principles Thinking | Principle | (2,2,1) | 基础真理驱动判断 |
| Systems Thinking | Framework | (1,2,2) | 识别系统互依关系 |
| Flywheel Model | Model | (3,3,3) | 强化循环机制表征 |
| Lean Startup | Method | (4,4,2) | Build-Measure-Learn 流程 |
| OODA Loop | Method | (4,4,2) | 快速决策行动循环 |
| JTBD | Framework | (2,3,2) | 需求与任务分析框架 |
| RICE | Heuristic | (3,4,2) | 快速优先级启发法 |

## 8. 治理与扩展原则

| Principle | 落地规则 |
|---|---|
| 防分类膨胀 | 不满足“显著不可表达”不得新增 Type |
| 简洁与表达平衡 | 优先使用关系扩展，不先新增本体 |
| AI 友好 | 所有关键字段结构化，便于检索和推理 |
| 长期可扩展 | 字段版本化、关系白名单、语义变更留痕 |
| 数据健康 | `draft -> active -> deprecated` 生命周期治理 |
