import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

class TabPane extends React.PureComponent {
    render() {
        const { active, mode } = this.props
        const classNames = cx(
            'tab-pane',
            {
                'tab-pane--active': active
            },
            'system-scroll-bar'
        )

        /**
         * ToThink 所有Tab下的内容是否有必要显示
         * { active? this.props.children: null }
         */

        return <div className={classNames}>{this._renderTabContent()}</div>
    }

    _renderTabContent() {
        const { mode, active } = this.props
        if (mode === 'active') {
            return active ? this.props.children : null
        } else {
            return this.props.children
        }
    }
}

TabPane.defaultProps = {
    mode: 'active'
}

TabPane.propTypes = {
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    active: PropTypes.bool,
    /**
     * mode TabPane渲染模式
     * 1. active 激活是渲染 default
     * 2. always 总是渲染
     */
    mode: PropTypes.string
}

export default TabPane
