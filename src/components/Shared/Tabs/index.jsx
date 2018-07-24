import './index.styl'
import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

class Tabs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: props.activeKey
        }
    }

    render() {
        const classNames = cx('tabs', this.props.className)
        return (
            <div className={classNames}>
                {this._getTabBar()}
                {this._getTabContent()}
            </div>
        )
    }

    _getTabBar() {
        const items = []
        React.Children.forEach(this.props.children, (child, idx) => {
            if (child) {
                const classNames = cx('tabbar__item', {
                    'tabbar__item--active': idx == this.state.activeKey
                })
                items.push(
                    <li
                        className={classNames}
                        key={idx}
                        onClick={this._onTabClick.bind(
                            this,
                            idx,
                            child.props.name
                        )}>
                        {child.props.name}
                    </li>
                )
            }
        })
        return <ul className="tabbar">{items}</ul>
    }
    _getTabContent() {
        //console.log(this.props.activeKey, this.state.activeKey)
        const items = []
        React.Children.forEach(this.props.children, (child, idx) => {
            if (child) {
                items.push(
                    React.cloneElement(child, {
                        active: idx == this.state.activeKey,
                        key: idx
                    })
                )
            }
        })
        return items
    }

    _onTabClick(key, name) {
        const { onBeforeChange } = this.props

        if (onBeforeChange) {
            onBeforeChange({ key, name }, this._activateTab)
        } else {
            this._activateTab(key)
        }
    }

    _activateTab = (key, propsKey) => {
        this.setState({ activeKey: propsKey || key })

        if (this.props.onChange) this.props.onChange(key)
    }
}

Tabs.defaultProps = {
    activeKey: 0
}

Tabs.propTypes = {
    activeKey: PropTypes.number,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onBeforeChange: PropTypes.func
}

export default Tabs
export { default as TabPane } from './TabPane'
