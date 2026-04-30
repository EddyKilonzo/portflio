"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Custom fallback. If omitted, a styled card is shown. */
  fallback?: ReactNode;
  /** Section label shown in the default fallback card. */
  label?: string;
};

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    const { children, fallback, label } = this.props;

    if (!error) return children;
    if (fallback) return fallback;

    return (
      <div className="flex min-h-[200px] items-center justify-center px-6 py-16">
        <div className="glass-card max-w-md rounded-2xl p-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent/70">
            {label ?? "Section"} — render error
          </p>
          <p className="mt-3 font-display text-xl text-highlight">Something went wrong</p>
          <p className="mt-2 font-sans text-sm text-highlight/65">
            {error.message || "An unexpected error occurred in this section."}
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="btn-ghost mt-5 text-xs"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}
