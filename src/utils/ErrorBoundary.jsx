// ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
    componentDidCatch(error, errorInfo) {
        console.error("Error Boundary caught an error:", error, errorInfo);
    }

    render() {
        return this.props.children;
    }
}

export default ErrorBoundary;