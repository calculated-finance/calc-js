import { ChartingLibraryFeatureset } from "charting_library";

export const widgetOverrides = {
  "paneProperties.backgroundGradientStartColor": "#161721",
  "paneProperties.backgroundGradientEndColor": "#161721",
  "paneProperties.vertGridProperties.color": "rgba(113, 144, 159, 0.125)",
  "paneProperties.horzGridProperties.color": "rgba(113, 144, 159, 0.125)",

  "scalesProperties.textColor": "#71909F",
  "scalesProperties.axisHighlightColor": "rgba(113, 144, 159, 0.25)",

  "scalesProperties.crosshairLabelBgColorDark": "rgba(113, 144, 159, 0.9)",
  "scalesProperties.axisLineToolLabelBackgroundColorActive":
    "rgba(113, 144, 159, 0.25)",

  "crossHair.horizontalLineProperties.color": "#71909F",
  "paneProperties.legendProperties.showSeriesTitle": false,
  // Ensure OHLC and Volume remain visible
  "paneProperties.legendProperties.showSeriesOHLC": true,
  "paneProperties.legendProperties.showVolume": true,

  "paneProperties.legendProperties.showLegend": false,
  "paneProperties.legendProperties.showBarChange": false,

  // White background — drawing is selected (static)
  "scalesProperties.axisLineToolLabelBackgroundColorCommon":
    "rgba(113, 144, 159, 0.5)",

  // White background — drawing is actively being moved/dragged
  //"scalesProperties.axisLineToolLabelBackgroundColorActive": "#ffffff",
};

export const customCssProperties = [
  ["--tv-color-platform-background", "#161721"],
  //["--tv-color-pane-background", "rgba(113, 144, 159, 0.1)"],
  ["--tv-color-pane-background", "rgba(22, 23, 33, 1)"],
  ["--tv-color-toolbar-button-background-hover", "rgba(113, 144, 159, 0.25)"],
  ["--tv-color-toolbar-button-text", "#71909F"],
  ["--tv-color-toolbar-button-text-hover", "#71909F"],
  ["--tv-color-toolbar-button-text-active", "#ffffff"],
  ["--tv-color-toolbar-button-text-active-hover", "#D615EB"],
  [
    "--tv-color-toolbar-toggle-button-background-active",
    "rgba(113, 144, 159, 0.375)",
  ],
  [
    "--tv-color-toolbar-toggle-button-background-active-hover",
    "rgba(113, 144, 159, 0.5)",
  ],
  ["--tv-color-toolbar-divider-background", "rgba(113, 144, 159, 0.375)"],
  // popup
  ["--tv-color-popup-background", "rgba(34, 36, 47, 0.95)"],
  ["--tv-color-popup-element-text", "#71909F"],
  ["--tv-color-popup-element-text-hover", "#71909F"],
  ["--tv-color-popup-element-background-hover", "rgba(113, 144, 159, 0.25)"],
  ["--tv-color-popup-element-divider-background", "rgba(113, 144, 159, 0.25)"],
  ["--tv-color-popup-element-secondary-text", "#ffffff"],
  ["--tv-color-popup-element-hint-text", "#ffffff"],
  ["--tv-color-popup-element-text-active", "#ffffff"],
  ["--tv-color-popup-element-background-active", "rgba(113, 144, 159, 0.375)"],
  ["--tv-color-popup-element-toolbox-text", "rgba(255, 169, 43, 0.75)"],
  ["--tv-color-popup-element-toolbox-text-hover", "#ffa92b"],
  ["--themed-color-favorite-checked", "#ffa92b"],
  ["--tv-color-popup-element-toolbox-text-active-hover", "#ffa92b"],
  [
    "--tv-color-popup-element-toolbox-background-hover",
    "rgba(255, 169, 43, 0.15)",
  ],
  [
    "--tv-color-popup-element-toolbox-background-active-hover",
    "rgba(255, 169, 43, 0.15)",
  ],
  // theme
  ["--themed-color-bg-primary", "#22242f"],
  ["--themed-color-properties-dialog-borders", "rgba(113, 144, 159, 0.25)"],
  ["--themed-color-properties-dialog-tab-bg", "rgba(113, 144, 159, 0.25)"],
  ["--themed-color-default-gray", "#71909F"],
  ["--themed-color-control-intent-default", "rgba(113, 144, 159, 0.5)"],
  ["--themed-color-control-border-hover", "rgba(113, 144, 159, 0.75)"],
  ["--themed-color-close-button-hover-bg", "rgba(113, 144, 159, 0.5)"],
  ["--themed-color-toolbar-opened-element-bg", "rgba(113, 144, 159, 0.5)"],
  ["--tv-color-toolbar-button-background-expanded", "rgba(113, 144, 159, 0.5)"],
];

export const disabledFeatures: ChartingLibraryFeatureset[] = [
  "border_around_the_chart",
  "control_bar",
  "edit_buttons_in_legend",
  "header_compare",
  "header_symbol_search",
  "popup_hints",
  "symbol_info",
  "timeframes_toolbar",
  window.innerWidth <= 600 ? "left_toolbar" : "hide_left_toolbar_by_default",
  //"legend_widget", // hides the entire symbol legend at the top-left
  //"header_widget", // removes the top header (which may include symbol)
  //"header_symbol_search", // removes the symbol search box
  "hide_main_series_symbol_from_indicator_legend", // hides main symbol label
  "main_series_scale_menu", // Removes the settings gear icon near price scale
  "legend_context_menu",
];
