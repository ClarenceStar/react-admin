import React from 'react'
import PropTypes from 'prop-types'
import JSAgent from '@jmfe/js-agent'

import './index.styl'

class ErrorBoundary extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true })
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
        JSAgent.reportException(error, info)
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div className="error-boundary">{this.props.errorTip}</div>
        }
        return this.props.children
    }
}

ErrorBoundary.propTypes = {
    errorTip: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
}

export default ErrorBoundary
