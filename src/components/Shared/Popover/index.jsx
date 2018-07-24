import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'Shared/Tooltip'
import { cloneElement } from 'react'
import './index.styl'

class Popover extends React.PureComponent {
    constructor(props) {
        super(props)
        const { visible } = props
        this.newChildProps = this._handleTrigger(props)
        this.state = {
            visible: typeof visible !== 'undefined' ? visible : false
        }
    }
    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.visible !== 'undefined') {
            if (nextProps.visible) {
                this.setState({
                    visible: true
                })
            } else {
                this.setState({
                    visible: false
                })
            }
        }
    }

    render() {
        const { children, content, placement, getContainer } = this.props
        const newChildProps = this.newChildProps
        return (
            <Tooltip
                prefixCls="popover"
                overlay={content}
                visible={this.state.visible}
                placement={placement}
                onClose={this._hidePopover}
                getContainer={getContainer}>
                {cloneElement(children, newChildProps)}
            </Tooltip>
        )
    }

    _handleTrigger = props => {
        const { trigger } = props
        const newChildProps = {}

        if (trigger === 'click') {
            newChildProps.onClick = this._showPopover
        } else if (trigger === 'hover') {
            newChildProps.onMouseEnter = this._showPopover
            newChildProps.onMouseOut = this._hidePopover
        }
        return newChildProps
    }

    _showPopover = event => {
        this.setState({
            visible: true
        })
    }

    _hidePopover = event => {
        this.setState({
            visible: false
        })
    }
}

Popover.defaultProps = {
    trigger: 'click'
}

Popover.propTypes = {
    /**
     * [content description]
     * @type {[string, element]}
     * 弹出内容
     */
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    /**
     * [content description]
     * @type {[string]}
     * 弹出框位置，位置可选， 默认top
     * top left right bottom topLeft topRight bottomLeft
     * bottomRight leftTop leftBottom rightTop rightBottom
     */
    placement: PropTypes.string,
    /**
     * [trigger description]
     * @type {[string]}
     * 触发方式，click和hover，默认click
     */
    trigger: PropTypes.string,
    /**
     * [visible description]
     * @type {[bool]}
     * 也可使用 visible 属性控制浮层显示
     */
    visible: PropTypes.bool,
    /**
     * [getContainer description]
     * @type {[function]}
     * 浮层渲染父节点，默认渲染到 body 上
     */
    getContainer: PropTypes.func
}

export default Popover
