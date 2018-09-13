import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'Shared/Tooltip';
import { cloneElement } from 'react';
import Button from 'Shared/Button';
import Icon from 'Shared/Icon';
import { GENERAL } from 'constants/text';
import './index.styl';

class Popconfirm extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    render() {
        const { children, getContainer } = this.props;
        const newChildProps = {};
        newChildProps.onClick = this._showPopconfirm;
        return (
            <Tooltip 
              prefixCls="popconfirm"
              overlay={ this._getOverlay }
              visible={ this.state.visible }
              placement={this.props.placement}
              animatedName={this.props.animatedName}
              onClose={this._onTooltipClose}
              getContainer={getContainer} >
                { cloneElement(children, newChildProps) }
            </Tooltip>
        );
    }

    _getOverlay = () => {
        return (
            <div className="confirm__content">
                { this._getMessage() }
                { this._getFooter() }
            </div>
        )
    }

    _getMessage = () => {
        const { title } = this.props;
        return (
            <div className="confirm__innerMessage">
                <Icon name={'info-circle'} className="confirm__icon" />
                <div className="confirm__msg">
                    { title }
                </div>
            </div>
        )
    }

    _getFooter = () => {
        const { okText, cancelText} = this.props;
        return (
            <div className={"confirm__footer"}>
                <Button
                onClick={this._cancelClose}>
                   {cancelText || GENERAL.CANCEL}
                </Button>
                <Button
                type="primary"
                onClick={this._okClose}>
                    {okText || GENERAL.CONFIRM}
                </Button>
            </div>
        )
    }

    _onTooltipClose = () => {
        this.setState({
            visible: false
        });
    }

    _cancelClose = (e) => {
        this.setState({
            visible: false
        });
        const onCancel = this.props.onCancel;
        if (onCancel){
             onCancel();
        }
    }

    _okClose = (e) => {
        const onOk = this.props.onOk;
        let close = true;
        if (onOk) {
            close = onOk();
            close = close === undefined ? true : !!close;
        }
        close && this.setState({ visible: false });
    }

    _showPopconfirm = (event) => {
        event.stopPropagation();
        this.setState({
            visible: true
        })
    }


}

Popconfirm.defaultProps = {

}

Popconfirm.propTypes = {
    /**
    * 提示内容
    */
    title: PropTypes.string.isRequired,
    /**
    * 关闭时触发的回调函数
    */
    onCancel: PropTypes.func,
    /**
    * 点击确定回调函数
    */
    onOk: PropTypes.func,
    /**
    * 确认文字
    */
    okText: PropTypes.string,
    /**
    * 取消文字
    */
    cancelText: PropTypes.string,
    /**
    * 弹出框位置，位置可选， 默认top
    * top left right bottom topLeft topRight bottomLeft 
    * bottomRight leftTop leftBottom rightTop rightBottom
    */
    placement: PropTypes.string,
    /**
    * 动画名称
    */ 
    animatedName: PropTypes.string,
    /**
    * 浮层渲染父节点，默认渲染到 body 上
    */ 
    getContainer: PropTypes.func, 
};

export default Popconfirm;
