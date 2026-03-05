function parseList(raw, separator) {
  if (!raw) return [];
  return raw
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseUrlStateFromQuery(search = "") {
  const params = new URLSearchParams(search || "");
  return {
    lang: params.get("lang") || "",
    view: params.get("view") || "",
    models: parseList(params.get("models"), ","),
    cells: parseList(params.get("cells"), ";"),
    keyword: params.get("q") || "",
    cellKeyword: params.get("cq") || "",
    link: params.get("link"),
    grid: params.get("grid"),
    neighbor: params.get("neighbor"),
    toolbar: params.get("toolbar"),
    detail: params.get("detail"),
    tab: params.get("tab") || ""
  };
}

export function createUrlStateController(options) {
  const {
    windowRef = typeof window === "undefined" ? null : window,
    cameraViewDirections,
    modelData,
    modelMeshByName,
    filterSelectionState,
    viewUiState,
    linkToggle,
    pyramidToggle,
    neighborToggle,
    modelMultiSearchInput,
    cellMultiSearchInput,
    setToolbarHidden,
    setInfoHidden,
    setActiveToolbarTab,
    applyUILanguage,
    rebuildCellFilterOptions,
    applyFilters,
    focusCameraOnView,
    sortCellKey
  } = options;

  let suppressUrlSync = false;

  function applyUrlState(state) {
    if (!state || typeof state !== "object") return;
    suppressUrlSync = true;
    try {
      if (state.lang === "zh" || state.lang === "en") {
        viewUiState.uiLanguage = state.lang;
      }

      if (state.link === "0") linkToggle.checked = false;
      if (state.grid === "0") pyramidToggle.checked = false;
      if (state.neighbor === "0") neighborToggle.checked = false;
      if (state.toolbar === "0") setToolbarHidden(true);
      if (state.detail === "0") setInfoHidden(true);
      if (state.tab) setActiveToolbarTab(state.tab);

      if (Array.isArray(state.models) && state.models.length > 0) {
        filterSelectionState.selectedModelNames.clear();
        state.models.forEach((name) => {
          if (modelMeshByName.has(name)) {
            filterSelectionState.selectedModelNames.add(name);
          }
        });
      }

      if (state.keyword) {
        filterSelectionState.keyword = state.keyword.toLowerCase();
        modelMultiSearchInput.value = state.keyword;
      }
      if (state.cellKeyword) {
        filterSelectionState.cellKeyword = state.cellKeyword.toLowerCase();
        cellMultiSearchInput.value = state.cellKeyword;
      }

      applyUILanguage();

      if (Array.isArray(state.cells) && state.cells.length > 0) {
        const validCellKeys = new Set(filterSelectionState.allCellKeys);
        filterSelectionState.selectedCellKeys.clear();
        state.cells.forEach((cellKey) => {
          if (validCellKeys.has(cellKey)) filterSelectionState.selectedCellKeys.add(cellKey);
        });
        if (filterSelectionState.selectedCellKeys.size === 0) {
          filterSelectionState.allCellKeys.forEach((cellKey) => filterSelectionState.selectedCellKeys.add(cellKey));
        }
        rebuildCellFilterOptions();
        applyFilters();
      }

      if (state.view && cameraViewDirections[state.view]) {
        focusCameraOnView(state.view, { keepSelection: true });
      }
    } finally {
      suppressUrlSync = false;
      syncUrlState();
    }
  }

  function syncUrlState() {
    if (!windowRef || suppressUrlSync) return;
    const params = new URLSearchParams();
    const currentParams = new URLSearchParams(windowRef.location.search);

    if (viewUiState.uiLanguage !== "zh") params.set("lang", viewUiState.uiLanguage);
    if (viewUiState.activeCameraView !== "default") params.set("view", viewUiState.activeCameraView);
    if (viewUiState.activeToolbarTab !== "models") params.set("tab", viewUiState.activeToolbarTab);

    // Preserve embed/simple mode flags so URL sync does not break embed workflows.
    if (currentParams.has("embed")) params.set("embed", currentParams.get("embed") || "1");
    if (currentParams.has("simple")) params.set("simple", currentParams.get("simple") || "1");

    if (!linkToggle.checked) params.set("link", "0");
    if (!pyramidToggle.checked) params.set("grid", "0");
    if (!neighborToggle.checked) params.set("neighbor", "0");
    if (viewUiState.toolbarHidden) params.set("toolbar", "0");
    if (viewUiState.infoHidden) params.set("detail", "0");

    if (filterSelectionState.keyword) params.set("q", filterSelectionState.keyword);
    if (filterSelectionState.cellKeyword) params.set("cq", filterSelectionState.cellKeyword);

    if (filterSelectionState.selectedModelNames.size > 0
      && filterSelectionState.selectedModelNames.size < modelData.length) {
      params.set("models", [...filterSelectionState.selectedModelNames].sort().join(","));
    }

    if (filterSelectionState.allCellKeys.length > 0
      && filterSelectionState.selectedCellKeys.size > 0
      && filterSelectionState.selectedCellKeys.size < filterSelectionState.allCellKeys.length) {
      params.set("cells", [...filterSelectionState.selectedCellKeys].sort(sortCellKey).join(";"));
    }

    const query = params.toString();
    const nextUrl = `${windowRef.location.pathname}${query ? `?${query}` : ""}${windowRef.location.hash}`;
    windowRef.history.replaceState(null, "", nextUrl);
  }

  return {
    applyUrlState,
    syncUrlState
  };
}
