import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ISubscription,
  ISymbolValueFormatter,
  LibrarySymbolInfo,
  ResolutionString,
  SymbolValueFormatterFormatOptions,
  TimeFrameValue,
  widget as Widget,
} from "charting_library";
import { FC, MutableRefObject, useEffect, useRef } from "react";
import { priceFormatter } from "rujira.js";
import { useLocalStorage } from "rujira.ui";
import { LocalStorageSaveLoadAdapter } from "./storage";
import {
  customCssProperties,
  disabledFeatures,
  widgetOverrides,
} from "./styles";

const locale = "en";

export const Chart: FC<
  Pick<ChartingLibraryWidgetOptions, "datafeed" | "interval" | "symbol"> & {
    className?: string;
    tick: number;
    extension?: (w: IChartingLibraryWidget) => void;
  }
> = (props) => {
  const { className, tick, extension, ...rest } = props;
  const [resolution, setResolution] = useLocalStorage<ResolutionString>(
    "chart-resolution",
    "1D" as ResolutionString
  );

  const ref = useRef<HTMLDivElement>() as MutableRefObject<HTMLInputElement>;
  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      ...rest,
      container: ref.current,
      library_path: "/charting-library/",
      locale,
      enabled_features: ["study_templates"],
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      disabled_features: disabledFeatures,
      custom_formatters: {
        priceFormatterFactory: (
          _symbolInfo: LibrarySymbolInfo | null,
          _minTick: string
        ): ISymbolValueFormatter | null => {
          return {
            format: (
              price: number,
              _options: SymbolValueFormatterFormatOptions
            ): string =>
              priceFormatter(BigInt(Math.round(price)), {
                trim: false,
                precision: tick,
              }),
          };
        },
      },
      interval: resolution,
      theme: "dark",
      overrides: widgetOverrides,
      save_load_adapter: new LocalStorageSaveLoadAdapter(),
    };

    const widget = new Widget(widgetOptions);
    let sub:
      | ISubscription<
          (
            interval: ResolutionString,
            timeFrameParameters: {
              timeframe?: TimeFrameValue;
            }
          ) => void
        >
      | undefined;
    widget.onChartReady(() => {
      widget.applyOverrides(widgetOverrides);
      customCssProperties.map(([k, v]) => widget.setCSSCustomProperty(k, v));
      sub = widget.activeChart().onIntervalChanged();
      sub.subscribe(null, setResolution);
      setTimeout((ref.current.style.opacity = "1"), 150);
      extension?.(widget);
    });

    return () => {
      sub?.unsubscribeAll(null);
      widget.remove();
    };
  }, [ref.current, props.symbol]);

  return <div className={className} ref={ref} style={{ opacity: 0 }} />;
};
