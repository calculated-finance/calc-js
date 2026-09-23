import { Component, FC, PropsWithChildren, ReactNode, Suspense } from "react";
import { Loader, Warning } from "rujira.ui";
import { AnalyticsRelayProvider } from "../services/relayAnalytics";

const DefaultFallback: FC = () => (
  <Warning color="orange" msg="Analytics unavailable" />
);

type State = { error: Error | null };

class AnalyticsErrorBoundary extends Component<
  PropsWithChildren<{ fallback: ReactNode }>,
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}

type Props = PropsWithChildren<{
  fallback?: ReactNode;
  loading?: ReactNode;
}>;

// Isolates analytics data-fetching from the rest of the page: a failed or
// slow analytics query must never take down non-analytics content, so this
// owns its own error boundary and Suspense instead of relying on the
// app-wide ones.
export const AnalyticsBoundary: FC<Props> = ({
  children,
  fallback = <DefaultFallback />,
  loading = <Loader className="w-4 h-4" />,
}) => (
  <AnalyticsErrorBoundary fallback={fallback}>
    <AnalyticsRelayProvider>
      <Suspense fallback={loading}>{children}</Suspense>
    </AnalyticsRelayProvider>
  </AnalyticsErrorBoundary>
);
