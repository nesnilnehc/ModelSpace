#!/usr/bin/env node
/**
 * Export creator script template for a single model (抖音视频脚本).
 *
 * Structure: 钩子(3s) → 定义(10s) → 例子(15s) → 关联(5s)
 * Content from v2 schema: summary, definition, whenToUse, relations.
 *
 * Usage:
 *   npm run export:script
 *   npm run export:script -- MECE
 *   node scripts/export-creator-script.mjs [modelName]
 *
 * Output: stdout (Markdown), or --out FILE to write to file.
 */
import fs from "node:fs";
import vm from "node:vm";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createAdmittedModelData } from "../src/domain/model-data.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dataPath = join(root, "data/model-library.js");

function loadModelLibrary() {
  const content = fs.readFileSync(dataPath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox);
  return {
    source: sandbox.window.COGNITIVE_ATLAS_OBJECTS || sandbox.window.MODEL_LIBRARY_ROWS,
    evaluationByName: sandbox.window.MODEL_EVALUATION_BY_NAME || {},
    relations: sandbox.window.COGNITIVE_ATLAS_RELATIONS || []
  };
}

function buildRelationIndexByName(relations) {
  const index = {};
  for (const edge of relations || []) {
    if (!edge?.source || !edge?.target || !edge?.type) continue;
    if (!index[edge.source]) index[edge.source] = [];
    index[edge.source].push({ type: edge.type, target: edge.target });
  }
  return index;
}

function formatRelations(model, modelData) {
  const ko = model.knowledgeObject;
  const lines = [];
  const formatTarget = (name) => {
    const m = modelData.find((c) => c.name === name);
    return m ? `${name}（${m.aliasZh}）` : name;
  };
  if ((ko.prerequisite?.length || 0) > 0) {
    lines.push(`前置：${ko.prerequisite.map(formatTarget).join("、")}`);
  }
  if ((ko.nextStep?.length || 0) > 0) {
    lines.push(`进阶：${ko.nextStep.map(formatTarget).join("、")}`);
  }
  if ((ko.pairWith?.length || 0) > 0) {
    lines.push(`搭配：${ko.pairWith.map(formatTarget).join("、")}`);
  }
  return lines.length ? lines.join("；") : "（无关联模型）";
}

function generateTemplate(model, modelData, baseUrl = "{{LANDING_URL}}") {
  const ko = model.knowledgeObject;
  const landing = baseUrl.replace("{{MODEL}}", model.name);
  const relationsText = formatRelations(model, modelData);

  return `# ${model.name}（${model.aliasZh}）— 抖音脚本模板

> CTA 落地页：${landing}

---

## 钩子（约 3 秒）

- 一句话吸引：${ko.summary || model.aliasZh || model.descriptionEn}

---

## 定义（约 10 秒）

- 核心定义：${ko.definition || model.descriptionEn || "-"}
- 适用场景：${ko.whenToUse || "-"}

---

## 例子（约 15 秒）

- 举例说明：（请补充具体业务/生活例子）

---

## 关联（约 5 秒）

- ${relationsText}
- 完整详情见评论链接

---
`;
}

async function main() {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  const outFile = outIdx >= 0 ? args[outIdx + 1] : null;
  if (outIdx >= 0) args.splice(outIdx, 2);

  const filterName = args[0] || null;

  const { source, evaluationByName, relations } = loadModelLibrary();
  const relationIndexByName = buildRelationIndexByName(relations);
  const modelData = createAdmittedModelData(source, evaluationByName, {
    relationIndexByName
  });

  const models = filterName
    ? modelData.filter((m) => m.name === filterName || m.aliasZh === filterName)
    : modelData;

  if (models.length === 0) {
    console.error(filterName ? `Model not found: ${filterName}` : "No admitted models.");
    process.exit(1);
  }

  const baseUrl = "https://cognitive-atlas.example.com/cognitive-model-3d.html?model={{MODEL}}";
  let output = "";
  for (const model of models) {
    output += generateTemplate(model, modelData, baseUrl);
  }

  if (outFile) {
    fs.writeFileSync(outFile, output, "utf8");
    console.log(`Written: ${outFile}`);
  } else {
    console.log(output);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
