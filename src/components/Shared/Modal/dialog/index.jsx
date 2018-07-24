import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Button from 'Shared/Button'
import Icon from 'Shared/Icon'
import './index.styl'

class Dialog extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const { style, renderFooter } = this.props
        return (
            <div className="dialog" style={style}>
                <div className="content">
                    {this._getheader()}

                    <div className="content__body">{this.props.children}</div>

                    {renderFooter ? renderFooter() : null}
                </div>
            </div>
        )
    }

    _getheader = () => {
        const { title, renderHeader } = this.props
        let header
        header = renderHeader ? (
            renderHeader()
        ) : (
            <div className="content__header">
                {this._getCloser()}
                <div className="content__title">{title}</div>
            </div>
        )
        return header
    }

    _getCloser = () => {
        const { closable, onClose } = this.props
        let closer
        if (closable) {
            closer = (
                <a className="content__close" onClick={onClose}>
                    <Icon name="close" />
                </a>
            )
        }
        return closer
    }
}

Dialog.propTypes = {
    /**
     * 是否显示右上角的关闭按钮
     */
    closable: PropTypes.bool,
    /**
     * 关闭模态框
     */
    onClose: PropTypes.func,

    /**
     * 底部内容
     */
    renderFooter: PropTypes.func
}

export default Dialog
