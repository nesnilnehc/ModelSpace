/**
 * domain/model-data — 模型解析、准入映射、校验聚合
 *
 * 职责：从遗留 rows 或知识对象输入构建 v2 Atlas 运行时数据，聚合准入、关系与显示元数据。
 * Traceability: M5 数据治理、Phase3 架构演进
 */
import { classifyKnowledgeObject } from "./cognitive-atlas-v2.js";

export const CATEGORY_COLOR_MAP = {
  Expression: 0x79d4ff,
  Structure: 0xffc677,
  Diagnosis: 0xff8f98,
  Strategy: 0x84f4b4,
  Meta: 0xd2a0ff
};

export const CATEGORY_ORDER = ["Expression", "Structure", "Diagnosis", "Strategy", "Meta"];

export const TYPICAL_MODEL_PRIORITY = {
  Expression: ["SCQA", "PREP", "STAR", "AIDA", "Elevator Pitch"],
  Structure: ["MECE", "Issue Tree", "5W1H", "Decision Tree"],
  Diagnosis: ["5 Whys", "Fishbone Diagram", "FMEA", "Red Teaming"],
  Strategy: ["OKR", "SWOT", "RICE", "OODA Loop", "Porter's Five Forces"],
  Meta: ["First Principles", "Systems Thinking", "Meta-Cognition", "Double Loop Learning"]
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function compactEnglishAnnotation(text) {
  const trimmed = (text || "").replace(/\.$/, "").trim();
  if (!trimmed) return "";
  return trimmed.length > 50 ? `${trimmed.slice(0, 47)}...` : trimmed;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeLegacyRow(row) {
  const [name, aliasZh, descriptionEn, category, yOverride, zOverride] = row;
  return { name, aliasZh, descriptionEn, category, yOverride, zOverride };
}

function buildRelationIndex(relationEdges = []) {
  return relationEdges.reduce((acc, edge) => {
    if (!edge?.source || !edge?.target || !edge?.type) return acc;
    if (!acc[edge.source]) acc[edge.source] = [];
    acc[edge.source].push({
      type: edge.type,
      target: edge.target
    });
    return acc;
  }, {});
}

export function createRelationIndex(relationEdges = []) {
  return buildRelationIndex(relationEdges);
}

function getRelationTargetsByType(relations, type) {
  return relations
    .filter((relation) => relation?.type === type && relation?.target)
    .map((relation) => relation.target);
}

function toRuntimeModel(entry, evaluationByName, relationIndexByName, opts = {}) {
  const normalized = Array.isArray(entry) ? normalizeLegacyRow(entry) : entry;
  const coordinatesByName = opts.coordinatesByName || {};
  const {
    name,
    aliasZh,
    descriptionEn,
    category,
    yOverride,
    zOverride,
    aliases = [],
    relationEdges = []
  } = normalized;
  const evaluation = normalized.evaluation || evaluationByName?.[name]?.evaluation || null;
  const explicitCoords = coordinatesByName[name];

  let atlasV2 = normalized.atlasV2;
  let axisRationale = normalized.axisRationale;

  if (!atlasV2) {
    const inferred = classifyKnowledgeObject(
      { name, aliasZh, descriptionEn, category, yOverride, zOverride },
      evaluation
    );
    if (explicitCoords?.coordinates && inferred?.coordinates) {
      atlasV2 = {
        ...inferred,
        coordinates: {
          ...inferred.coordinates,
          primary: explicitCoords.coordinates
        }
      };
      axisRationale = explicitCoords.axisRationale ?? axisRationale;
    } else {
      atlasV2 = inferred;
    }
  }

  const primary = atlasV2?.coordinates?.primary || { x: 3, y: 3, z: 3 };
  const effectiveAxisRationale = axisRationale ?? normalized.axisRationale ?? null;
  const indexedRelations = relationIndexByName?.[name] || [];
  const relations = relationEdges.length > 0 ? relationEdges : indexedRelations;
  const objectType = atlasV2?.objectType || "Framework";
  const summary = normalized.summary || aliasZh || descriptionEn || name;
  const problem = normalized.problem || normalized.purpose || descriptionEn || aliasZh || name;
  const whenToUse = normalized.whenToUse || normalized.purpose || descriptionEn || aliasZh || name;
  const whyLearn = normalized.whyLearn || normalized.purpose || descriptionEn || aliasZh || name;
  const tags = {
    Expression: ["表达", "沟通", "叙事"],
    Structure: ["结构化", "拆解", "框架"],
    Diagnosis: ["诊断", "根因", "风险"],
    Strategy: ["战略", "决策", "执行"],
    Meta: ["元认知", "原则", "系统"]
  }[category] || ["认知", "知识对象"];
  const tagsEn = {
    Expression: ["Expression", "Communication", "Narrative"],
    Structure: ["Structure", "Decomposition", "Framework"],
    Diagnosis: ["Diagnosis", "Root Cause", "Risk"],
    Strategy: ["Strategy", "Decision", "Execution"],
    Meta: ["Meta-Cognition", "Principle", "Systems"]
  }[category] || ["Cognition", "Knowledge Object"];

  return {
    id: normalized.id || `ca.${slugify(objectType)}.${slugify(name)}.v1`,
    name,
    aliasZh,
    aliasEn: compactEnglishAnnotation(descriptionEn),
    aliases: [aliasZh, ...aliases].filter(Boolean),
    x: primary.x,
    y: primary.y,
    z: primary.z,
    category,
    description: aliasZh,
    descriptionEn,
    evaluation,
    atlasV2,
    relations,
    objectType,
    tags,
    tagsEn,
    knowledgeObject: {
      id: normalized.id || `ca.${slugify(objectType)}.${slugify(name)}.v1`,
      name,
      aliases: [aliasZh, ...aliases].filter(Boolean),
      objectType,
      summary,
      problem,
      whenToUse,
      whenNotToUse: normalized.whenNotToUse || null,
      commonMisuse: normalized.commonMisuse || null,
      whyLearn,
      prerequisite: getRelationTargetsByType(relations, "prerequisite"),
      nextStep: getRelationTargetsByType(relations, "next_step"),
      pairWith: getRelationTargetsByType(relations, "pair_with"),
      practice: normalized.practice || null,
      coordinates: atlasV2?.coordinates || { primary },
      axisRationale: effectiveAxisRationale,
      definition: descriptionEn,
      purpose: normalized.purpose || descriptionEn,
      origin: normalized.origin || null,
      relations,
      confidence: atlasV2?.confidence ?? 1,
      status: evaluation?.stageA === "不纳入" ? "deprecated" : "active",
      version: "v2.0.0"
    }
  };
}

/**
 * 从遗留 rows 或知识对象构建 v2 运行时模型数据
 * @param {Array<Array>|Array<Object>} source - 兼容 MODEL_LIBRARY_ROWS 或显式知识对象输入
 * @param {Object} [evaluationByName]
 * @param {Object} [options]
 * @param {Object} [options.relationIndexByName]
 * @param {Object} [options.coordinatesByName] - 显式坐标覆盖 { name: { coordinates, axisRationale } }
 * @returns {Array}
 */
export function buildModelData(source, evaluationByName = {}, options = {}) {
  const relationIndexByName = options.relationIndexByName || {};
  const coordinatesByName = options.coordinatesByName || {};
  return source.map((entry) =>
    toRuntimeModel(entry, evaluationByName, relationIndexByName, { coordinatesByName })
  );
}

/**
 * 构建已准入模型数据（排除 stageA === "不纳入"）
 */
export function createAdmittedModelData(source, evaluationByName = {}, options = {}) {
  return buildModelData(source, evaluationByName, options)
    .filter((model) => model?.evaluation?.stageA !== "不纳入")
    .filter((model) => model?.atlasV2?.classificationStatus === "classified");
}
