export function createFilterSelectionState(modelData) {
  return {
    keyword: "",
    cellKeyword: "",
    selectedModelNames: new Set(modelData.map((model) => model.name)),
    selectedCellKeys: new Set(),
    allCellKeys: [],
    cellEntries: [],
    initializedCellSelection: false
  };
}

export function createViewUiState(options = {}) {
  const { defaultLanguage = "zh" } = options;
  return {
    hoveredMesh: null,
    selectedMesh: null,
    neighborMeshes: [],
    uiLanguage: defaultLanguage,
    toolbarHidden: false,
    infoHidden: false,
    detailTechnicalViewEnabled: false,
    activeToolbarTab: "models",
    activeCameraView: "default",
    baseCameraCenter: null,
    baseCameraDistance: 128
  };
}
