import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { getContainer } from 'utils/common';
import cx from 'classnames';
import Dialog from './dialog';
import './index.styl'

let ins;
let container;
const animatedIn = 'fadeIn';
const animatedOut = 'fadeOut';

class Modaless extends React.PureComponent{
    constructor(props){
        super(props);
        this.state={
            animatedOut: '',
            visible: true,
        }
    }

    render(){     
        const props = this.props; 
        const classNames = `modaless animated ${animatedIn} ${this.state.animatedOut}`

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
                        {...props} 
                        onClose={this._close}
                    />
           
            </div>
        );
    }

    _onMaskClick = (e) => {  
        if (e.target === e.currentTarget) {
            this._close();
        }   
    }

    _show = () => {
        this.setState({
            visible: true,
        })
    }

    _close = () => {
        this.setState({
             animatedOut: animatedOut,
        });

        const { onCancel } = this.props;
        onCancel && onCancel();
    } 

    _animatedOut = (e) =>{
        if (e.target.className.indexOf(animatedOut) > -1 ){
            this.setState({
                animatedOut: '',
                visible: false
            })
        }
    } 
}

Modaless.show = (properties) => {
    container = getContainer('Modaless', properties);
    ins = ReactDOM.render(
        <Modaless 
            {...properties}
            ref={(modaless)=>{modaless&&modaless._show()}} />, container);
    return ins;
}

Modaless.destroy = () => {
    if (container) {
        const unmounted = ReactDOM.unmountComponentAtNode(container);   
        unmounted && document.body.removeChild(container);
    }
}

Modaless.defaultProps = {
    prefixCls: 'modaless',
    maskClosable: true,
    closable: true,
    style: {
    }
}

Modaless.propTypes = {
    /**
    * 标题
    */   
    title: PropTypes.string,
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
};



export default Modaless;
export { default as Modaless16 } from './Modaless16';