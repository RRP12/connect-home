"use client"
import { Component } from "react"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          Something went wrong.
          {/* Optionally display more detailed error info in development */}
          {process.env.NODE_ENV === "development" && (
            <pre>{this.state.error.toString()}</pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
