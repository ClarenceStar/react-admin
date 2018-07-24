import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { getContainer } from 'utils/common';
import cx from 'classnames';
import Dialog from './dialog';
import './index.styl'

let ins;
let container;
const ANIMATED_IN = 'fadeIn';
const ANIMATED_OUT = 'fadeOut';

class Modaless16 extends React.PureComponent{
    constructor(props){
        super(props);
        this.state={
            animatedOut: false,
            visible: props.visible
        }
    }

    componentWillReceiveProps(nextProps) {
        const { visible: cVisible } = this.props;
        const { visible: nVisible } = nextProps;

        if(cVisible !== nVisible) {
            if(!nVisible) {
                this._close();
            } else {
                this._show();
            }
        }
    }

    render() {
        container = getContainer('Modaless', this.props.getContainer);
        return ReactDOM.createPortal(this._renderModalessContent(), container);
    }

    _renderModalessContent() {
        const { prefixCls } = this.props;
        const { animatedOut, visible } = this.state;

        const classNames = cx('modaless',{
            "animated": true,
            [`${prefixCls}-modaless`]: !!prefixCls,
            [`${ANIMATED_IN}`]: true,
            [`${ANIMATED_OUT}`]: animatedOut && !!visible,
        });

        const displayStyle = {};
        if (this.state.visible) {
            displayStyle.display = 'block';
        }else{
            displayStyle.display = 'none';
        }
        
        return (
            <div className={classNames} 
                style={displayStyle}
                onAnimationEnd={this._animatedOut} >
                <Dialog 
                    {...this.props} 
                    onClose={this._onCancel}
                />
            </div>
        );
    }

    _show = () => {
        this.setState({
            visible: true,
        })
    }

    _onCancel = (e) => {
       e && e.stopPropagation();

        const { onCancel } = this.props;
        onCancel && onCancel();
    } 

    // 淡出效果之后再关闭整个模态框
    _close = () => {
        this.setState({
             animatedOut: true,
        });
    } 

    _animatedOut = (e) =>{
        e && e.stopPropagation();
        if (e.target.className.indexOf(ANIMATED_OUT) > -1 ){
            this.setState({
                animatedOut: false,
                visible: false
            })
        }
    } 
}

Modaless16.defaultProps = {
    prefixCls: 'modaless',
    maskClosable: true,
    closable: true,
    style: {
        width: '520px'
    },
    visible: false
}

Modaless16.propTypes = {
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
    /**
    * 是否显示右上角的关闭按钮
    */ 
    closable: PropTypes.bool,
    /**
    * 浮层的样式
    */ 
    style: PropTypes.object,
    /**
    * 头部内容
    */ 
    renderHeader: PropTypes.func,
    /**
    * 底部内容
    */ 
    renderFooter: PropTypes.func,
    /**
     * 获取容器函数
     */
    getContainer: PropTypes.func,
    /**
     * 控制Modaless的显示与关闭
     */
    visible: PropTypes.bool
};

export default Modaless16;