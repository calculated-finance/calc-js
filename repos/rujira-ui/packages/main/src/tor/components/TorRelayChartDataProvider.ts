import { Buffer } from "buffer";
import {
  Bar,
  DatafeedConfiguration,
  DatafeedErrorCallback,
  DOMCallback,
  GetMarksCallback,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  Mark,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SearchSymbolsCallback,
  ServerTimeCallback,
  SubscribeBarsCallback,
  SymbolResolveExtension,
  TimescaleMark,
} from "charting_library";
import {
  Disposable,
  Environment,
  fetchQuery,
  graphql,
  requestSubscription,
} from "react-relay";
import { TorRelayChartDataProviderQuery } from "./__generated__/TorRelayChartDataProviderQuery.graphql";
import { TorRelayChartDataProviderSubscription } from "./__generated__/TorRelayChartDataProviderSubscription.graphql";

const CONFIG: DatafeedConfiguration = {
  supported_resolutions: [
    "1",
    "3",
    "5",
    "15",
    "30",
    "60",
    "120",
    "180",
    "240",
    "1D",
    "1M",
    "12M",
  ] as ResolutionString[],
  // supports_marks: true,
};

const query = graphql`
  query TorRelayChartDataProviderQuery(
    $pair: ID!
    $after: String!
    $before: String!
    $resolution: String!
  ) {
    node(id: $pair) {
      ... on ThorchainPool {
        asset {
          asset
        }
        candles(after: $after, before: $before, resolution: $resolution) {
          __id
          edges {
            cursor
            node {
              id
              open
              close
              high
              low
              bin
            }
          }
        }
      }
    }
  }
`;

const subscription = graphql`
  subscription TorRelayChartDataProviderSubscription($prefix: String!) {
    edge(prefix: $prefix) {
      cursor
      node {
        ... on ThorchainTorCandle {
          id
          open
          close
          high
          low
          bin
        }
      }
    }
  }
`;
export class RelayChartDataProvider implements IBasicDataFeed {
  private subscriptions: Record<string, Disposable> = {};
  constructor(
    private environment: Environment,
    private asset: string
  ) {}

  getMarks?(
    _symbolInfo: LibrarySymbolInfo,
    _from: number,
    _to: number,
    _onDataCallback: GetMarksCallback<Mark>,
    _resolution: ResolutionString
  ): void {
    throw new Error("Method not implemented.");
  }
  getTimescaleMarks?(
    _symbolInfo: LibrarySymbolInfo,
    _from: number,
    _to: number,
    _onDataCallback: GetMarksCallback<TimescaleMark>,
    _resolution: ResolutionString
  ): void {
    throw new Error("Method not implemented.");
  }
  getServerTime?(callback: ServerTimeCallback): void {
    callback(new Date().getTime() / 1000);
  }
  searchSymbols(
    _userInput: string,
    _exchange: string,
    _symbolType: string,
    _onResult: SearchSymbolsCallback
  ): void {
    throw new Error("Method not implemented.");
  }
  resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    _onError: DatafeedErrorCallback,
    _extension?: SymbolResolveExtension
  ): void {
    setTimeout(() => {
      onResolve({
        name: symbolName,
        description: "",
        type: "crypto",
        session: "24x7",
        exchange: "THORChain",
        listed_exchange: "RUJI",
        timezone: "Etc/UTC",
        format: "price",
        pricescale: 1,
        minmov: 0.1,
        has_intraday: true,
      });
    }, 0);
  }
  getBars(
    _symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    _onError: DatafeedErrorCallback
  ): void {
    setTimeout(() => {
      const id = Buffer.from(`ThorchainPool:${this.asset}`).toString("base64");
      const from =
        periodParams.from < 10000000000
          ? periodParams.from * 1000
          : periodParams.from;

      const to =
        periodParams.to < 10000000000
          ? periodParams.to * 1000
          : periodParams.to;

      const o = fetchQuery<TorRelayChartDataProviderQuery>(
        this.environment,
        query,
        {
          pair: id,
          after: new Date(from).toISOString(),
          before: new Date(to).toISOString(),
          resolution,
        }
      );
      o.toPromise().then((x) => {
        const bars =
          x?.node?.candles?.edges?.reduce((agg: Bar[], res): Bar[] => {
            if (!res?.node) return agg;
            const time = new Date(res.node.bin);
            return [
              ...agg,

              {
                open: Number(res.node.open),
                time: time.getTime(),
                high: Number(res.node.high),
                low: Number(res.node.low),
                close: Number(res.node.close),
              },
            ];
          }, []) || [];

        onResult(bars, { noData: !bars.length });
      });
    }, 0);
  }
  subscribeBars(
    _symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    _onResetCacheNeededCallback: () => void
  ): void {
    setTimeout(() => {
      const prefix = Buffer.from(
        `ThorchainTorCandle:${this.asset}/${resolution}`
      ).toString("base64");
      this.subscriptions[listenerGuid] =
        requestSubscription<TorRelayChartDataProviderSubscription>(
          this.environment,
          {
            subscription,
            variables: { prefix },
            onNext: (next) => {
              const node = next?.edge?.node;
              if (!node) return;
              const bar = {
                open: Number(node.open),
                time: new Date(node.bin).getTime(),
                high: Number(node.high),
                low: Number(node.low),
                close: Number(node.close),
              };

              onTick(bar);
            },
          }
        );
    }, 0);
  }
  unsubscribeBars(listenerGuid: string): void {
    this.subscriptions[listenerGuid]?.dispose();
  }
  subscribeDepth?(_symbol: string, _callback: DOMCallback): string {
    throw new Error("Method not implemented.");
  }
  unsubscribeDepth?(_subscriberUID: string): void {
    throw new Error("Method not implemented.");
  }
  getVolumeProfileResolutionForPeriod?(
    _currentResolution: ResolutionString,
    _from: number,
    _to: number,
    _symbolInfo: LibrarySymbolInfo
  ): ResolutionString {
    throw new Error("Method not implemented.");
  }
  onReady(callback: OnReadyCallback): void {
    setTimeout(() => callback(CONFIG), 0);
  }
}
