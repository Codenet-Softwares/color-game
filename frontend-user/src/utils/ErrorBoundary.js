import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Filter out ResizeObserver errors
    if (error.message && error.message.includes('ResizeObserver')) {
      console.log('Suppressed ResizeObserver error:', error);
      return;
    }
    
    // Log other errors
    console.error('ErrorBoundary caught:', error, errorInfo);
    // You can also log to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;