---
name: classify-cognitive-model
description: 对 Cognitive Atlas 知识对象进行 v2 三维坐标分类，输出 coordinates 与 axisRationale。
tags: [cognitive-atlas, classification, mece, modelspace]
version: 1.0.0
license: MIT
recommended_scope: project
metadata:
  author: ModelSpace
input_schema:
  type: model-info
  description: 单个或一批模型信息（name, aliasZh, descriptionEn, category，若有则含证据卡四字段）
output_schema:
  type: classification-json
  description: coordinates + axisRationale 的 JSON，单模型为对象，批量为数组
---

# Skill: Classify Cognitive Model

## Purpose

对 Cognitive Atlas 中的认知模型进行 v2 三维坐标分类，按 MECE 判定标准输出 `(x, y, z)` 及每轴依据，供写入 `MODEL_COORDINATES_BY_NAME` 或 `model-coordinates.json`。

---

## Core Objective

**Primary Goal**: 根据 `docs/requirements-planning/llm-classification-criteria-v2.md` 的 MECE 标准，对给定模型输出主坐标 `(x,y,z)` 与 `axisRationale`，形成可审计、可提交的 JSON。

**Success Criteria**:

1. 读取 `llm-classification-criteria-v2.md`（含边界规则、锚点、Prompt Template）
2. 按判定顺序 Y → Z → X 输出
3. **歧义时**：查边界规则（§3.1、§4.1、§5.1），比对锚点模型；冲突时按：核心问题 > 主要产出 > 典型场景
4. 输出符合约定 JSON 格式

---

## Use Cases

- "Classify MECE"
- "按 skill 给 MECE、5 Whys、SWOT 分类"
- "给这批模型做 v2 坐标分类"

---

## Behavior

### 1. 读取标准

- 打开 `docs/requirements-planning/llm-classification-criteria-v2.md`
- 使用其中 MECE 进入/排除标准及 Appendix: Prompt Template

### 2. 分类执行

- **输入**：用户提供的模型信息（name, aliasZh, descriptionEn, category；若有证据卡则含核心问题、主要产出、典型场景、操作方式）
- **判定顺序**：Y → Z → X
- **歧义处理**：当某轴有歧义时，查边界规则（如 X 轴 1vs2：主要产出为因果链/根因→2，为结构/清单（划分边界）→1），比对锚点模型
- **输出**：每个模型的 JSON：

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

### 3. 批量处理

- 若一次请求含多个模型，输出 JSON 数组
- 建议每批不超过 20 个，以控制上下文

---

## Input & Output

### Input

- **单模型**：`{ name, aliasZh, descriptionEn, category[, 核心问题, 主要产出, 典型场景, 操作方式 ] }`
- **批量**：上述对象的数组

### Output

- **单模型**：上述 JSON 对象
- **批量**：上述 JSON 对象的数组

---

## Restrictions

- 不修改仓库文件；仅输出分类结果，由用户审核后自行写入
- 仅使用 v2 坐标（1–5），不采用 model-classification-standard v1.2 的旧轴
- 无完整证据卡时，在 axisRationale 中注明「无完整证据卡」
