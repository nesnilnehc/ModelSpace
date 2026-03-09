export function renderValidationPanelContent(validationPanel, t, snapshot, getCellShortLabel) {
  if (!validationPanel) return;

  const toolLayerOk = snapshot.toolLayerCount > 0;
  const classificationGateOk = snapshot.unclassifiedCount === 0;
  const denseRatioOk = snapshot.denseRatio >= 0.7;
  const densePercent = `${(snapshot.denseRatio * 100).toFixed(0)}%`;
  const topCellsText = snapshot.topCells.length > 0
    ? snapshot.topCells.map(([key, cellStats]) => `${getCellShortLabel(key)} (${cellStats.count})`).join(" / ")
    : "-";

  validationPanel.replaceChildren();

  const title = document.createElement("div");
  title.className = "validation-title";
  title.textContent = t.validationTitle;
  validationPanel.appendChild(title);

  const toolLine = document.createElement("div");
  toolLine.className = toolLayerOk ? "validation-ok" : "validation-error";
  toolLine.textContent = `${toolLayerOk ? "✓" : "✗"} ${toolLayerOk ? t.validationToolLayerOk : t.validationToolLayerMissing} (${snapshot.toolLayerCount})`;
  validationPanel.appendChild(toolLine);

  const gateLine = document.createElement("div");
  gateLine.className = classificationGateOk ? "validation-ok" : "validation-error";
  gateLine.textContent = `${classificationGateOk ? "✓" : "✗"} ${classificationGateOk ? t.validationClassificationGateOk : t.validationClassificationGateFail} (${snapshot.unclassifiedCount}/${snapshot.admittedCount})`;
  validationPanel.appendChild(gateLine);

  const densityLine = document.createElement("div");
  densityLine.className = denseRatioOk ? "validation-ok" : "validation-warn";
  densityLine.textContent = `${denseRatioOk ? "✓" : "!"} ${denseRatioOk ? t.validationDensityOk : t.validationDensityWarn} (${snapshot.denseCells}/${snapshot.filledCells}, ${densePercent})`;
  validationPanel.appendChild(densityLine);

  const evalLine = document.createElement("div");
  if (snapshot.evalSummary) {
    const { admitted = 0, observing = 0, rejected = 0 } = snapshot.evalSummary;
    evalLine.textContent = `${t.validationEvalSummary}: ${t.validationAdmittedLabel} ${admitted} / ${t.validationObservingLabel} ${observing} / ${t.validationRejectedLabel} ${rejected}`;
  } else {
    evalLine.textContent = `${t.validationEvalSummary}: -`;
  }
  validationPanel.appendChild(evalLine);

  const topLine = document.createElement("div");
  topLine.textContent = `${t.validationTopCells}: ${topCellsText}`;
  validationPanel.appendChild(topLine);
}

const DETAIL_SECTIONS_STORAGE_KEYS = ["cognitive-atlas-detail-sections"];

function getDetailSectionStateFromStorage() {
  try {
    if (typeof sessionStorage === "undefined") return null;
    for (const storageKey of DETAIL_SECTIONS_STORAGE_KEYS) {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function persistDetailSectionState(modelContent) {
  if (!(modelContent instanceof HTMLElement)) return;
  const triggers = [...modelContent.querySelectorAll(".accordion-trigger")];
  const state = {};
  for (const trigger of triggers) {
    const section = trigger.closest(".accordion-section");
    if (!section) continue;
    const key = [...section.classList].find((c) =>
      ["overview-card", "definition-card", "judgement-card", "resource-card", "related-card", "tag-card"].includes(c)
    );
    if (key) state[key] = trigger.getAttribute("aria-expanded") === "true";
  }
  try {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(DETAIL_SECTIONS_STORAGE_KEYS[0], JSON.stringify(state));
    }
  } catch {}
}

function restoreDetailSectionState(modelContent) {
  if (!(modelContent instanceof HTMLElement)) return;
  const stored = getDetailSectionStateFromStorage();
  if (!stored) return;
  const triggers = [...modelContent.querySelectorAll(".accordion-trigger")];
  for (const trigger of triggers) {
    const section = trigger.closest(".accordion-section");
    if (!section) continue;
    const key = [...section.classList].find((c) =>
      ["overview-card", "definition-card", "judgement-card", "resource-card", "related-card", "tag-card"].includes(c)
    );
    if (key && key in stored) setAccordionExpanded(trigger, Boolean(stored[key]));
  }
}

export function persistDetailSections(modelContent) {
  persistDetailSectionState(modelContent);
}

function isAccordionTrigger(element) {
  return element instanceof HTMLElement && element.classList.contains("accordion-trigger");
}

function setAccordionExpanded(trigger, expanded) {
  if (!isAccordionTrigger(trigger)) return;
  const section = trigger.closest(".accordion-section");
  const panelId = trigger.getAttribute("aria-controls");
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!(section instanceof HTMLElement) || !(panel instanceof HTMLElement)) return;

  trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
  section.classList.toggle("collapsed", !expanded);
  panel.hidden = !expanded;
}

export function setAllDetailSectionsExpanded(modelContent, expanded) {
  if (!(modelContent instanceof HTMLElement)) return 0;
  const triggers = [...modelContent.querySelectorAll(".accordion-trigger")];
  triggers.forEach((trigger) => setAccordionExpanded(trigger, expanded));
  modelContent.dispatchEvent(new CustomEvent("detail-sections-change"));
  return triggers.length;
}

export function getDetailSectionSummary(modelContent) {
  if (!(modelContent instanceof HTMLElement)) {
    return { total: 0, expanded: 0, collapsed: 0 };
  }
  const triggers = [...modelContent.querySelectorAll(".accordion-trigger")].filter(isAccordionTrigger);
  const expanded = triggers.filter((trigger) => trigger.getAttribute("aria-expanded") === "true").length;
  return {
    total: triggers.length,
    expanded,
    collapsed: Math.max(0, triggers.length - expanded)
  };
}

export function renderModelDetailsContent(modelContent, payload) {
  const {
    displayName,
    summaryLine,
    overviewTitle,
    overviewRows,
    descriptionTitle,
    descriptionText,
    tagsTitle,
    tags,
    judgementTitle,
    judgementStatus,
    judgementStatusClass,
    judgementRows,
    referenceTitle,
    referenceSections,
    referenceLinks,
    relatedTitle,
    relatedGroups,
    relatedHint,
    detailNoneText,
    sectionEmptyText
  } = payload;

  modelContent.replaceChildren();

  const title = document.createElement("h3");
  title.className = "model-name";
  title.textContent = displayName;
  modelContent.appendChild(title);

  if (summaryLine && String(summaryLine).trim()) {
    const summary = document.createElement("p");
    summary.className = "model-summary";
    summary.textContent = summaryLine.trim();
    modelContent.appendChild(summary);
  }

  let accordionId = 0;
  const fallbackNone = detailNoneText || "-";
  const fallbackEmpty = sectionEmptyText || fallbackNone;

  function appendAccordionSection(titleText, options, renderContent) {
    const { expanded = true, className = "" } = options || {};
    const section = document.createElement("section");
    section.className = `explain-card accordion-section ${className}`.trim();

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "accordion-trigger";

    const triggerTitle = document.createElement("span");
    triggerTitle.className = "explain-title";
    triggerTitle.textContent = titleText || fallbackNone;
    trigger.appendChild(triggerTitle);

    const indicator = document.createElement("span");
    indicator.className = "accordion-indicator";
    indicator.textContent = "▾";
    trigger.appendChild(indicator);

    accordionId += 1;
    const panelId = `detail-accordion-panel-${accordionId}`;
    const panel = document.createElement("div");
    panel.className = "accordion-content";
    panel.id = panelId;
    trigger.setAttribute("aria-controls", panelId);

    setAccordionExpanded(trigger, Boolean(expanded));
    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      setAccordionExpanded(trigger, !isExpanded);
      modelContent.dispatchEvent(new CustomEvent("detail-sections-change"));
    });

    renderContent(panel);
    if (!panel.childNodes.length) {
      const empty = document.createElement("div");
      empty.className = "explain-value";
      empty.textContent = fallbackEmpty;
      panel.appendChild(empty);
    }

    section.append(trigger, panel);
    modelContent.appendChild(section);
  }

  appendAccordionSection(overviewTitle, { expanded: true, className: "overview-card" }, (panel) => {
    const overviewGrid = document.createElement("div");
    overviewGrid.className = "overview-grid";
    const rows = overviewRows || [];
    if (!rows.length) {
      const empty = document.createElement("div");
      empty.className = "overview-value";
      empty.textContent = fallbackNone;
      panel.appendChild(empty);
      return;
    }
    for (const row of rows) {
      const item = document.createElement("div");
      item.className = "overview-item";

      const key = document.createElement("div");
      key.className = "explain-key";
      key.textContent = row.label;
      item.appendChild(key);

      const value = document.createElement("div");
      value.className = "overview-value";
      value.textContent = row.value || fallbackNone;
      item.appendChild(value);

      overviewGrid.appendChild(item);
    }
    panel.appendChild(overviewGrid);
  });

  if (descriptionText && String(descriptionText).trim() && descriptionText.trim() !== (detailNoneText || "-")) {
    appendAccordionSection(descriptionTitle, { expanded: true, className: "definition-card" }, (panel) => {
    const definitionText = document.createElement("p");
    definitionText.className = "definition-text";
    definitionText.textContent = descriptionText || fallbackEmpty;
    panel.appendChild(definitionText);
  });
  }

  const hasJudgement = judgementStatus || (judgementRows && judgementRows.length > 0);
  if (hasJudgement) {
    appendAccordionSection(judgementTitle, { expanded: false, className: "judgement-card" }, (panel) => {
    if (judgementStatus) {
      const statusRow = document.createElement("div");
      statusRow.className = "explain-status-row";

      const statusPill = document.createElement("span");
      statusPill.className = `pill status-pill ${judgementStatusClass || ""}`.trim();
      statusPill.textContent = judgementStatus;
      statusRow.appendChild(statusPill);
      panel.appendChild(statusRow);
    }

    const detailGrid = document.createElement("div");
    detailGrid.className = "explain-grid";
    const rows = judgementRows || [];
    if (!rows.length) {
      const empty = document.createElement("div");
      empty.className = "explain-value";
      empty.textContent = fallbackEmpty;
      panel.appendChild(empty);
      return;
    }

    for (const row of rows) {
      const rowEl = document.createElement("div");
      rowEl.className = "explain-row";

      const label = document.createElement("div");
      label.className = "explain-key";
      label.textContent = row.label;
      rowEl.appendChild(label);

      const value = document.createElement("div");
      value.className = "explain-value";
      value.textContent = row.value || fallbackNone;
      rowEl.appendChild(value);

      detailGrid.appendChild(rowEl);
    }
    panel.appendChild(detailGrid);
  });
  }

  const hasReferenceContent = (referenceSections && referenceSections.some((s) => s.items && s.items.length > 0)) ||
    (referenceLinks && referenceLinks.length > 0);
  if (hasReferenceContent) {
    appendAccordionSection(referenceTitle, { expanded: true, className: "resource-card" }, (panel) => {
    const sections = referenceSections || [];
    if (!sections.length && (!referenceLinks || !referenceLinks.length)) {
      const empty = document.createElement("div");
      empty.className = "explain-value";
      empty.textContent = fallbackEmpty;
      panel.appendChild(empty);
      return;
    }

    for (const section of sections) {
      if (!section.items || section.items.length === 0) continue;

      const sectionEl = document.createElement("div");
      sectionEl.className = "resource-section";

      const label = document.createElement("div");
      label.className = "explain-key";
      label.textContent = section.label;
      sectionEl.appendChild(label);

      const list = document.createElement("ul");
      list.className = "resource-list";
      for (const item of section.items) {
        const listItem = document.createElement("li");
        if (item.url) {
          const link = document.createElement("a");
          link.className = "resource-inline-link";
          link.href = item.url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = item.text;
          listItem.appendChild(link);
        } else {
          listItem.textContent = item.text;
        }
        list.appendChild(listItem);
      }
      sectionEl.appendChild(list);
      panel.appendChild(sectionEl);
    }

    if (referenceLinks && referenceLinks.length > 0) {
      const linksRow = document.createElement("div");
      linksRow.className = "resource-links";
      for (const linkItem of referenceLinks) {
        const link = document.createElement("a");
        link.className = "resource-link";
        link.href = linkItem.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = linkItem.label;
        linksRow.appendChild(link);
      }
      panel.appendChild(linksRow);
    }
  });
  }

  const hasRelatedGroups = Array.isArray(relatedGroups) && relatedGroups.some((group) => group.items?.length > 0);
  if (hasRelatedGroups) {
    appendAccordionSection(relatedTitle, { expanded: false, className: "related-card" }, (panel) => {
      for (const group of relatedGroups) {
        if (!group.items || group.items.length === 0) continue;
        const sectionEl = document.createElement("div");
        sectionEl.className = "resource-section";

        const label = document.createElement("div");
        label.className = "explain-key";
        label.textContent = group.label;
        sectionEl.appendChild(label);

        const actionList = document.createElement("div");
        actionList.className = "model-action-list";
        for (const item of group.items) {
          const actionButton = document.createElement("button");
          actionButton.type = "button";
          actionButton.className = "model-action-btn";
          actionButton.dataset.modelName = item.name;
          actionButton.textContent = item.label || item.name;
          if (item.title) actionButton.title = item.title;
          actionList.appendChild(actionButton);
        }
        sectionEl.appendChild(actionList);
        panel.appendChild(sectionEl);
      }

      if (relatedHint) {
        const hint = document.createElement("div");
        hint.className = "explain-value";
        hint.textContent = relatedHint;
        panel.appendChild(hint);
      }
    });
  }

  const hasTags = Array.isArray(tags) && tags.length > 0;
  if (hasTags) {
    appendAccordionSection(tagsTitle, { expanded: true, className: "tag-card" }, (panel) => {
    const tagRow = document.createElement("div");
    tagRow.className = "pill-row";
    for (const tag of tags) {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = tag;
      tagRow.appendChild(pill);
    }
    panel.appendChild(tagRow);
  });
  }

  const triggers = [...modelContent.querySelectorAll(".accordion-trigger")];
  triggers.forEach((trigger, index) => {
    trigger.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

      let nextIndex = index;
      if (event.key === "ArrowDown") nextIndex = (index + 1) % triggers.length;
      if (event.key === "ArrowUp") nextIndex = (index - 1 + triggers.length) % triggers.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = triggers.length - 1;

      triggers[nextIndex]?.focus();
      event.preventDefault();
    });
  });

  restoreDetailSectionState(modelContent);
}

export function renderCellFocusContent(modelContent, payload) {
  const {
    title,
    summaryLine,
    guideTitle,
    guideRows,
    pathTitle,
    pathModels,
    hintText,
    detailNoneText
  } = payload;

  const fallbackNone = detailNoneText || "-";
  modelContent.replaceChildren();

  const titleEl = document.createElement("h3");
  titleEl.className = "model-name";
  titleEl.textContent = title || fallbackNone;
  modelContent.appendChild(titleEl);

  if (summaryLine && String(summaryLine).trim()) {
    const summary = document.createElement("p");
    summary.className = "model-summary";
    summary.textContent = summaryLine.trim();
    modelContent.appendChild(summary);
  }

  const guideCard = document.createElement("section");
  guideCard.className = "explain-card overview-card";

  const guideHeader = document.createElement("div");
  guideHeader.className = "explain-title";
  guideHeader.textContent = guideTitle || fallbackNone;
  guideCard.appendChild(guideHeader);

  const guideGrid = document.createElement("div");
  guideGrid.className = "overview-grid";
  for (const row of guideRows || []) {
    const item = document.createElement("div");
    item.className = "overview-item";

    const key = document.createElement("div");
    key.className = "explain-key";
    key.textContent = row.label || fallbackNone;
    item.appendChild(key);

    const value = document.createElement("div");
    value.className = "overview-value";
    value.textContent = row.value || fallbackNone;
    item.appendChild(value);
    guideGrid.appendChild(item);
  }
  guideCard.appendChild(guideGrid);
  modelContent.appendChild(guideCard);

  const pathCard = document.createElement("section");
  pathCard.className = "explain-card related-card";

  const pathHeader = document.createElement("div");
  pathHeader.className = "explain-title";
  pathHeader.textContent = pathTitle || fallbackNone;
  pathCard.appendChild(pathHeader);

  const actionList = document.createElement("div");
  actionList.className = "model-action-list";
  for (const modelItem of pathModels || []) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "model-action-btn";
    button.dataset.modelName = modelItem.name;
    button.textContent = modelItem.label || modelItem.name;
    if (modelItem.title) button.title = modelItem.title;
    actionList.appendChild(button);
  }
  pathCard.appendChild(actionList);

  if (hintText) {
    const hint = document.createElement("div");
    hint.className = "explain-value";
    hint.textContent = hintText;
    pathCard.appendChild(hint);
  }

  modelContent.appendChild(pathCard);
}
