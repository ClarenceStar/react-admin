import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { getContainer } from 'utils/common';
import Modal16 from 'Shared/Modal/Modal16';
import Button from 'Shared/Button';
import './index.styl'

let ins;
let container;
const animatedOut = 'fadeOut';

class Confirm16 extends React.PureComponent{
    constructor (props) {
        super(props);
    }


    render(){
        const { visible } = this.props;
        return ( 
            <Modal16
                {...this.props}
                prefixCls='system-scroll-bar confirm'
                containerId='Confirm'
                visible={visible}
                renderFooter={this._getFooter} /> 
        )
    }

    _getFooter = () => {
        const { onCancel, onOk, cancelText, okText} = this.props;
        let footer = (
                <div className="content__footer">
                    <Button 
                    type="primary"
                    onClick={this._onOkClick}     
                    >
                        { okText || '确认'}
                    </Button>
                    <Button onClick={this._onCancelClick} >
                        { cancelText || '取消'}
                    </Button>
                </div>
            ); 
        return footer;
    }

    _onCancelClick  = (e) => {
        e && e.stopPropagation();
        const { onCancel } = this.props;

        onCancel && onCancel()
        
    }

    _onOkClick = (e) => {
        e && e.stopPropagation();
        const { onOk } = this.props;
        onOk && onOk();
    }
};

Confirm16.propTypes = {
    /**
    * 标题
    */   
    title: PropTypes.string, 
    /**
    * 确认按钮文字
    */ 
    okText: PropTypes.string, 
    /**
    * 取消按钮文字
    */ 
    cancelText: PropTypes.string,
    /**
    * 点击确认回调
    */ 
    onOk: PropTypes.func,
    /**
    * 点击取消回调
    */ 
    onCancel: PropTypes.func,
    /**
    * 点击蒙层是否允许关闭
    */ 
    maskClosable:  PropTypes.bool,
    /**
    * 是否显示右上角的关闭按钮
    */ 
    closable: PropTypes.bool,
    /**
    * 浮层的样式
    */ 
    style: PropTypes.object,
    /**
     * 控制显示与关闭
     */
    visible: PropTypes.bool,
};



export default Confirm16;