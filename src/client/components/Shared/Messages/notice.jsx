import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

const animatedIn = 'zoomIn';
const animatedOut = 'zoomOut';

class Notice extends React.PureComponent{

    constructor(props){
        super(props)
        this.state= {
            animatedOut:'',
        };
    }

    componentDidMount () {
        if ( this.props.duration) {
            this._animatedOutFunc = setTimeout(()=>{
                this.setState({
                    animatedOut:animatedOut,
                });
            }, this.props.duration);
        }
    }

    componentWillUnmount(){
        if ( this._animatedOutFunc ){
            clearTimeout(this._animatedOutFunc)
            this._animatedOutFunc = null
        }
    }

    render(){
        const { prefixCls, message } = this.props;
        const clx = `${prefixCls}--animated animated ${animatedIn} ${this.state.animatedOut}`
        return(
            <div className={clx} 
                onAnimationEnd={this._animatedOut}>
                { this._getHeader() }
                { this._getMessage() }
            </div>
        )
    }

    _getHeader = () => {
        const { prefixCls, closable } = this.props;
        if (closable){
            return (
                <div className={`${prefixCls}__header`}>
                    <a className={`${prefixCls}__close`} onClick={this._close} >
                        <Icon name="close"/>
                    </a>
                </div>
            )
        }
    }

    _getMessage = () => {
       const { prefixCls, message } = this.props;
        if (message){
            return (
                <div className={`${prefixCls}__msg`}>
                    { this._getIconType() }
                    {message}
                </div>
            )
        }
    }

    _getIconType = () => {
        const { prefixCls, type } = this.props;
        if (type){
        let iconName;
        let loadingCls;
            switch ( type.toLowerCase() ) {
                case 'info':
                    iconName = 'info-circle';
                    break;
                case 'success':
                    iconName = 'check-circle-o';
                    break;
                case 'warning':
                    iconName = 'warning';
                    break;
                case 'error':
                    iconName = 'window-close';
                    break;
                case 'loading':
                    iconName = 'spinner';
                    loadingCls = 'fa-spin fa-fw'
                    break;
                default:
                    break;
            }
            if (iconName) {
                return <Icon name={iconName} className={`${prefixCls}__icon--${type} ${loadingCls}`} />
            }      
        }
    }

    _close = () => {
        this.setState({
            animatedOut: animatedOut
        })
        
    }

    _removeCurrentNotice = () => {
        const { onRemove, onClose } = this.props;
        onRemove && onRemove();
        onClose && onClose();
    }

    _animatedOut= (e) => {
        if ( e.target.className.indexOf(animatedOut) > -1 ){
            this._removeCurrentNotice();
        }
    }  
}

Notice.propTypes = {
    /**
    * 指定notice提示的样式
    *有四种选择 success、info、warning、error
    */   
    type: PropTypes.string,
    /**
    * 固定类名
    */
    prefixCls: PropTypes.string,
    /**
    * 移除当前message
    */
    onRemove: PropTypes.func,
    /**
    * 关闭时的回调函数
    */
    onClose: PropTypes.func,
    /**
    * 是否显示右上角的关闭按钮
    */   
    closable: PropTypes.bool,
   /**
    * message内容
    */   
    message: PropTypes.string.isRequired,
    /**
    * message持续秒数，单位为ms
    */
    duration: PropTypes.number,
}

export default Notice;