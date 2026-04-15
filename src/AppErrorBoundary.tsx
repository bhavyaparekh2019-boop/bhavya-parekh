import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * AppErrorBoundary
 * A robust React Error Boundary to catch and display runtime errors gracefully.
 */
export default class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-[2.5rem] text-center space-y-6">
            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-rose-500 font-black">!</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">Something went wrong</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              The application encountered an unexpected error. We've been notified and are working to fix it.
            </p>
            <div className="p-4 bg-black/40 rounded-2xl text-left overflow-auto max-h-60">
              <code className="text-rose-400 text-[10px] break-all whitespace-pre-wrap">
                {this.state.error?.toString()}
                {"\n\n"}
                {this.state.error?.stack}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
