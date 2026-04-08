import React, { type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary:', error, errorInfo.componentStack);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            style={{
              padding: '1rem',
              margin: '0.5rem',
              borderRadius: '0.5rem',
              background: 'var(--color-surface-elevated, #fee2e2)',
              border: '1px solid var(--color-error, #b91c1c)',
              color: 'var(--color-text, #b91c1c)',
            }}
          >
            <strong>Сообщения временно недоступны.</strong>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
              {this.state.error?.message ?? 'Ошибка отображения'}
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
