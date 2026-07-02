import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Result } from 'antd';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo.componentStack);
  }

  handleReload = () => {
    window.location.assign('/');
  };

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Result
          status="error"
          title="Something went wrong"
          subTitle={error.message || 'An unexpected error occurred.'}
          extra={
            <Button type="primary" onClick={this.handleReload}>
              Back to Overview
            </Button>
          }
        />
      </div>
    );
  }
}
