import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { getContainer } from 'utils/common'
import cx from 'classnames'
import Dialog from './dialog'
import Mask from 'Shared/Mask'
import './index.styl'

let ins
let container
const ANIMATED_IN = 'fadeIn'
const ANIMATED_OUT = 'fadeOut'

class Modal extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            animatedOut: false,
            visible: true
        }
    }

    getChildContext() {
        return { dragDropManager: Modal.dragDropManager }
    }

    componentWillUnmount() {
        clearTimeout(this.cancelTimer)
    }

    render() {
        const { maskClosable, prefixCls } = this.props
        const { animatedOut, visible } = this.state
        const classNames = cx('modal', {
            animated: true,
            [`${prefixCls}-modal`]: !!prefixCls,
            [`${ANIMATED_IN}`]: true,
            [`${ANIMATED_OUT}`]: animatedOut && !!visible
        })

        const displayStyle = {}
        if (visible) {
            displayStyle.display = 'block'
        } else {
            displayStyle.display = 'none'
        }

        return (
            <div
                className={classNames}
                style={displayStyle}
                onAnimationEnd={this._animatedOut}>
                <Mask
                    style={{ backgroundColor: 'rgba(55, 55, 55, 0.6)' }}
                    className="modal__mask"
                />
                <div
                    className="modal__wrap"
                    onClick={maskClosable ? this._onMaskClick : undefined}>
                    <Dialog {...this.props} onClose={this._close} />
                </div>
            </div>
        )
    }

    _onMaskClick = e => {
        if (e.target === e.currentTarget) {
            this._close()
        }
    }

    _show = () => {
        this.setState({
            visible: true
        })
    }

    _close = () => {
        this.setState(
            {
                animatedOut: true
            },
            () => {
                this.cancelTimer = setTimeout(() => {
                    const { onCancel } = this.props
                    onCancel && onCancel()
                }, 500)
            }
        )
    }

    _animatedOut = e => {
        if (e.target.className.indexOf(ANIMATED_OUT) > -1) {
            this.setState({
                animatedOut: false,
                visible: false
            })
        }
    }
}

Modal.show = (properties, callback) => {
    container = getContainer('Modal15')
    ReactDOM.render(
        <Modal
            {...properties}
            ref={modal => {
                modal && modal._show()
                ins = modal
                callback && callback(ins)
            }}
        />,
        container
    )
}

Modal.close = () => {
    ins && ins._close()
}

Modal.destroy = () => {
    if (container) {
        const unmounted = ReactDOM.unmountComponentAtNode(container)
        unmounted && document.body.removeChild(container)
    }
}

Modal.defaultProps = {
    maskClosable: true,
    closable: true,
    style: {
        width: '520px'
    }
}

Modal.childContextTypes = {
    dragDropManager: PropTypes.object
}

Modal.propTypes = {
    /**
     * 标题
     */
    title: PropTypes.string,
    /**
     * 类名前缀
     */
    prefixCls: PropTypes.string,
    /**
     * 点击关闭回调
     */
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    /**
     * 点击蒙层是否允许关闭
     */
    maskClosable: PropTypes.bool,
    /**
     * 是否显示右上角的关闭按钮
     */
    closable: PropTypes.bool,
    /**
     * 浮层的样式
     */
    style: PropTypes.object,
    /**
     * 底部内容
     */
    renderFooter: PropTypes.func
}

export default Modal
export { default as Modal16 } from './Modal16'
