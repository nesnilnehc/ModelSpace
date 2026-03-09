/**
 * Cognitive Atlas v2 domain classifier.
 *
 * This module provides deterministic classification for every admitted object.
 * If an object cannot be classified, it must not enter the admitted dataset.
 */

export const OBJECT_TYPES = Object.freeze([
  "Theory",
  "Principle",
  "Framework",
  "Model",
  "Method",
  "Pattern",
  "Heuristic",
  "Tool",
  "Metric",
  "System"
]);

export const AXIS_ENUM = Object.freeze({
  lifecycle: Object.freeze({
    1: "Sensemaking",
    2: "Diagnosis",
    3: "Design",
    4: "Execution",
    5: "Adaptation"
  }),
  abstraction: Object.freeze({
    1: "Meta",
    2: "Conceptual",
    3: "Structural",
    4: "Procedural",
    5: "Instrumental"
  }),
  scale: Object.freeze({
    1: "Individual",
    2: "Team",
    3: "Organization",
    4: "Ecosystem",
    5: "Societal"
  })
});

export const CLASSIFICATION_RULES = Object.freeze({
  type: Object.freeze({
    byName: Object.freeze({
      SWOT: "Framework",
      AARRR: "Framework",
      OKR: "System",
      KPI: "Metric",
      "First Principles": "Principle",
      "Systems Thinking": "Framework",
      Flywheel: "Model",
      "Lean Startup": "Method"
    }),
    byPattern: Object.freeze([
      { pattern: /\b(metric|kpi|measure|indicator|score)\b/, result: "Metric" },
      { pattern: /\b(system|operating system|governance)\b/, result: "System" },
      { pattern: /\b(framework|canvas|matrix)\b/, result: "Framework" },
      { pattern: /\b(theory)\b/, result: "Theory" },
      { pattern: /\b(pattern|loop)\b/, result: "Pattern" },
      { pattern: /\b(heuristic|rule of thumb|razor)\b/, result: "Heuristic" },
      { pattern: /\b(principle)\b/, result: "Principle" },
      { pattern: /\b(method|process|step|cycle)\b/, result: "Method" },
      { pattern: /\b(model)\b/, result: "Model" },
      { pattern: /\b(template|tool|checklist)\b/, result: "Tool" }
    ]),
    byZOverride: Object.freeze({
      1: "Tool",
      2: "Method",
      3: "Principle",
      4: "Framework"
    }),
    byCategoryFallback: Object.freeze({
      Expression: "Method",
      Structure: "Framework",
      Diagnosis: "Method",
      Strategy: "Framework",
      Meta: "Principle"
    })
  }),
  lifecycle: Object.freeze({
    byPattern: Object.freeze([
      { pattern: /\b(retrospective|postmortem|root cause|diagnos)\b/, result: 2 },
      { pattern: /\b(plan|priorit|strategy|roadmap|design)\b/, result: 3 },
      { pattern: /\b(execute|action|operate|implementation)\b/, result: 4 },
      { pattern: /\b(learn|adapt|feedback|improve|iteration)\b/, result: 5 },
      { pattern: /\b(explain|sensemaking|understand)\b/, result: 1 }
    ]),
    byCategoryFallback: Object.freeze({
      Expression: 1,
      Structure: 2,
      Diagnosis: 2,
      Strategy: 3,
      Meta: 5
    })
  }),
  abstraction: Object.freeze({
    byType: Object.freeze({
      Theory: 2,
      Principle: 2,
      Framework: 3,
      Model: 3,
      Pattern: 3,
      Method: 4,
      Heuristic: 4,
      Tool: 5,
      Metric: 5,
      System: 3
    })
  }),
  scale: Object.freeze({
    byPattern: Object.freeze([
      { pattern: /\b(personal|individual|learning|memory)\b/, result: 1 },
      { pattern: /\b(team|meeting|collaborat)\b/, result: 2 },
      { pattern: /\b(organization|business|company|strategy|portfolio)\b/, result: 3 },
      { pattern: /\b(market|industry|ecosystem|customer)\b/, result: 4 },
      { pattern: /\b(policy|society|public|global)\b/, result: 5 }
    ]),
    byCategoryFallback: Object.freeze({
      Expression: 2,
      Structure: 2,
      Diagnosis: 3,
      Strategy: 3,
      Meta: 2
    })
  })
});

function compactText(value) {
  return String(value || "").trim().toLowerCase();
}

function matchRule(rules, text) {
  for (const rule of rules) {
    if (rule.pattern.test(text)) return rule.result;
  }
  return null;
}

function inferObjectType(row) {
  const { name, category, descriptionEn, zOverride } = row;
  const byName = CLASSIFICATION_RULES.type.byName[name];
  if (byName) return byName;

  const text = `${compactText(name)} ${compactText(descriptionEn)}`;
  const byPattern = matchRule(CLASSIFICATION_RULES.type.byPattern, text);
  if (byPattern) return byPattern;

  if (Number.isFinite(zOverride)) {
    const byZOverride = CLASSIFICATION_RULES.type.byZOverride[zOverride];
    if (byZOverride) return byZOverride;
  }

  return CLASSIFICATION_RULES.type.byCategoryFallback[category] || null;
}

function inferLifecycle(row) {
  const { category, name, descriptionEn } = row;
  const text = `${compactText(name)} ${compactText(descriptionEn)}`;
  const byPattern = matchRule(CLASSIFICATION_RULES.lifecycle.byPattern, text);
  if (byPattern) return byPattern;
  return CLASSIFICATION_RULES.lifecycle.byCategoryFallback[category] || 3;
}

function inferAbstraction(objectType) {
  return CLASSIFICATION_RULES.abstraction.byType[objectType] || 3;
}

function inferScale(row) {
  const { category, name, descriptionEn } = row;
  const text = `${compactText(name)} ${compactText(descriptionEn)}`;
  const byPattern = matchRule(CLASSIFICATION_RULES.scale.byPattern, text);
  if (byPattern) return byPattern;
  return CLASSIFICATION_RULES.scale.byCategoryFallback[category] || 3;
}

export function classifyKnowledgeObject(row, evaluation = {}) {
  const stageA = evaluation?.stageA || "纳入";
  if (stageA === "不纳入") {
    return {
      classificationStatus: "excluded",
      reason: "stageA_rejected",
      admitted: false
    };
  }

  const objectType = inferObjectType(row);
  const x = inferLifecycle(row);
  const y = inferAbstraction(objectType);
  const z = inferScale(row);
  const isClassified = Boolean(objectType && Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z));

  if (!isClassified) {
    return {
      classificationStatus: "unclassified",
      reason: "auto_classification_failed",
      admitted: false
    };
  }

  return {
    classificationStatus: "classified",
    admitted: true,
    objectType,
    coordinates: {
      primary: { x, y, z },
      axes: {
        xName: "DecisionLifecycle",
        yName: "AbstractionLevel",
        zName: "ApplicationScale"
      }
    },
    confidence: 1
  };
}
