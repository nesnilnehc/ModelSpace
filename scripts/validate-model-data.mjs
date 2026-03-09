import fs from "node:fs";
import vm from "node:vm";
import { classifyKnowledgeObject } from "../src/domain/cognitive-atlas-v2.js";

const file = "data/model-library.js";
const content = fs.readFileSync(file, "utf8");

const rowRegex = /\[\s*"([^"]+)"\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"\s*,\s*"([^"]+)"(?:\s*,\s*([0-9-]+)\s*,\s*([0-9-]+))?\s*\]/g;
const rows = [];
let match;
while ((match = rowRegex.exec(content)) !== null) {
  rows.push({
    name: match[1],
    aliasZh: match[2],
    descriptionEn: match[3],
    category: match[4],
    y: match[5] ? Number(match[5]) : null,
    z: match[6] ? Number(match[6]) : null
  });
}

if (rows.length === 0) {
  console.error("No model rows found in data/model-library.js");
  process.exit(1);
}

const sandbox = { window: {} };
vm.createContext(sandbox);
try {
  vm.runInContext(content, sandbox);
} catch (err) {
  console.error("Failed to evaluate data/model-library.js:", err.message);
  process.exit(1);
}

const evaluationByName = sandbox.window.MODEL_EVALUATION_BY_NAME || {};
const relationTypes = sandbox.window.COGNITIVE_ATLAS_RELATION_TYPES || [];
const relations = sandbox.window.COGNITIVE_ATLAS_RELATIONS || [];

const errors = [];
const allowedCategories = new Set(["Expression", "Structure", "Diagnosis", "Strategy", "Meta"]);
const allowedRelationTypes = new Set(relationTypes);
let unclassifiedCount = 0;

const seen = new Set();
for (const row of rows) {
  if (seen.has(row.name)) errors.push(`Duplicate model name: ${row.name}`);
  seen.add(row.name);

  if (!allowedCategories.has(row.category)) {
    errors.push(`Invalid category for ${row.name}: ${row.category}`);
  }

  if ((row.y === null) !== (row.z === null)) {
    errors.push(`Invalid override pair for ${row.name}: y=${row.y}, z=${row.z}`);
  }

  if (row.y !== null && (row.y < 1 || row.y > 4)) {
    errors.push(`Y override out of range for ${row.name}: ${row.y}`);
  }

  if (row.z !== null && (row.z < 1 || row.z > 4)) {
    errors.push(`Z override out of range for ${row.name}: ${row.z}`);
  }

  const evaluation = evaluationByName?.[row.name]?.evaluation || {};
  const classification = classifyKnowledgeObject({
    name: row.name,
    aliasZh: row.aliasZh,
    descriptionEn: row.descriptionEn,
    category: row.category,
    yOverride: row.y,
    zOverride: row.z
  }, evaluation);
  if (classification.classificationStatus === "excluded") continue;

  if (classification.classificationStatus !== "classified") {
    unclassifiedCount += 1;
    errors.push(`Auto classification failed for admitted model: ${row.name}`);
  }
}

for (const edge of relations) {
  if (!edge?.source || !seen.has(edge.source)) {
    errors.push(`Relation source missing or unknown: ${edge?.source || "-"}`);
  }
  if (!edge?.target || !seen.has(edge.target)) {
    errors.push(`Relation target missing or unknown: ${edge?.target || "-"}`);
  }
  if (!allowedRelationTypes.has(edge?.type)) {
    errors.push(`Invalid relation type: ${edge?.type || "-"}`);
  }
  if (edge?.source && edge?.target && edge.source === edge.target) {
    errors.push(`Self relation is not allowed: ${edge.source}`);
  }
}

const toolLayerCount = rows.filter((row) => {
  const evaluation = evaluationByName?.[row.name]?.evaluation || {};
  const classification = classifyKnowledgeObject({
    name: row.name,
    aliasZh: row.aliasZh,
    descriptionEn: row.descriptionEn,
    category: row.category,
    yOverride: row.y,
    zOverride: row.z
  }, evaluation);
  return classification.objectType === "Tool";
}).length;
const admittedCount = rows.filter((row) => (evaluationByName?.[row.name]?.evaluation?.stageA || "纳入") !== "不纳入").length;

if (errors.length > 0) {
  console.error("Model data validation failed:");
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

const categoryCount = rows.reduce((acc, row) => {
  acc[row.category] = (acc[row.category] || 0) + 1;
  return acc;
}, {});

console.log("Model data validation passed.");
console.log(`Rows: ${rows.length}`);
console.log(`Admitted rows (must be auto-classified): ${admittedCount}`);
console.log(`Unclassified admitted rows (must be 0): ${unclassifiedCount}`);
console.log(`Tool-type objects: ${toolLayerCount}`);
console.log(`Relation edges: ${relations.length}`);
if (toolLayerCount === 0) {
  console.log("Warning: no Tool-type objects are currently present in the admitted set.");
}
console.log(`Categories: ${JSON.stringify(categoryCount)}`);
