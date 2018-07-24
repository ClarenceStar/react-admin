import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { getContainer } from 'utils/common';
import Modal from 'Shared/Modal';
import Button from 'Shared/Button';
import './index.styl'

let ins;
const animatedOut = 'fadeOut';

class Confirm extends React.PureComponent{
    render(){}
};

function getFooter(props) {
    const { onCancel, onOk, cancelText, okText, cancelShow } = props;
    let footer = (
            <div className="content__footer">
                <Button 
                  type="primary"
                  onClick={() => {okClose(onOk)}}     
                 >
                    { okText || '确认'}
                </Button>
                {
                cancelShow
                    ?   <Button onClick={() => { cancelClose(onCancel) }} >
                            { cancelText || '取消'}
                        </Button>
                    :   null
                }
            </div>
        ); 
    return footer;
}

function cancelClose(onCancel)  {
    ins.setState({
        animatedOut: animatedOut,
    });
   
    onCancel && onCancel();
}

function okClose (onOk) {
    let close = true;
    if (onOk) {
        close = onOk();
        close = close === undefined ? true : !!close;
    }
    
    close && ins.setState({ animatedOut: animatedOut });
}

Confirm.show = (properties, callback) => {
    let { onOk: oriOnOk, onCancel: oriOnCancel } = properties;
    
    return new Promise((resolve, reject) => {
        properties.onOk = () => {
            oriOnOk && oriOnOk();
            resolve({status: 'ok'});
        }

        properties.onCancel = () => {
            oriOnCancel && oriOnCancel();
            resolve({status: 'cancel'});
        }
    
        let container = getContainer('Confirm15', properties);
        ReactDOM.render(
            <Modal 
                ref={(modal)=>{
                    if(modal) {
                        modal._show();
                        ins = modal;
                        callback && callback(ins);
                    }
                }}
                prefixCls='confirm'
                renderFooter={() => {return getFooter(properties)}}
                {...properties} />,
            container
        );
    });
}

Confirm.close = () => {
    ins && ins._close();
}

Confirm.defaultProps = {
    cancelShow: true,
}

Confirm.propTypes = {
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
    * 是否显示取消按钮
    */
    cancelShow: PropTypes.bool,
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
};



export default Confirm;
export { default as Confirm16 } from './Confirm16';