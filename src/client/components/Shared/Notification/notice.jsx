import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'Shared/Icon';
import cx from 'classnames';

const animatedInRight = 'slideInRight';
const animatedInLeft = 'slideInLeft';
const animatedOutRight = 'slideOutRight';
const animatedOutLeft = 'slideOutLeft';
const defaultDuration = 5000;

class Notice extends React.PureComponent{

    constructor(props){
        super(props)
        const placement = props.placement;

        this.animatedIn = placement.indexOf('Right') > -1 ?
                            animatedInRight : animatedInLeft;
        this.animatedOut = placement.indexOf('Right') > -1 ?
                            animatedOutRight : animatedOutLeft;
        this.state= {
            animatedOut:'',
        };
    }

    componentWillReceiveProps(nextProps) {
        // 传入key相同 但duration发生改变时  
        if ( this.props.duration !== nextProps.duration ){
            this._animatedOutFunc = setTimeout(()=>{
                this.setState({
                    animatedOut:this.animatedOut,
                });
            }, nextProps.duration);       
        }
    }
    
    componentDidMount () {
        if ( this.props.duration) {
        
            this._animatedOutFunc = setTimeout(()=>{
                this.setState({
                    animatedOut:this.animatedOut,
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
        const { prefixCls, message, type, placement } = this.props;
                      
        const cls = `${prefixCls}__notice animated ${this.animatedIn} ${this.state.animatedOut}`

        const contentCls = cx({
            [`${prefixCls}__content--icon`]: type,
            [`${prefixCls}__content`]: !type,
        })
        return(
            <div className={cls} 
                onAnimationEnd={this._animatedOut}>
                <div className={contentCls}>
                    { this._getIconType() }
                    { this._getHeader() }
                    { this._getMessage() }
                    { this._getFooter() }
                </div>
            </div>
        )
    }

    _getHeader = () => {
        const { prefixCls, title } = this.props;
        return (
            <div className={`${prefixCls}__header`}>
                { this._getCloseIcon() }
                {title}
             </div>
        )
    }

    _getCloseIcon = () => {
        const { prefixCls } = this.props;
        return (
            <a className={`${prefixCls}__close`} onClick={this._close} >
                <Icon name="close"/>
            </a>
        )
    }

    _getMessage = () => {
       const { prefixCls, message } = this.props;
        return (
            <div className={`${prefixCls}__msg`}>
                {message}
            </div>
        )
    }

    _getFooter = () => {
        const { prefixCls, btn } = this.props;
        if (btn) {
            return (
                <div className={`${prefixCls}__footer`}>
                    { btn }
                </div>
            )
        }
    }

    _getIconType = () => {
        const { prefixCls, type } = this.props;
        if (type){
        let iconName;
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
                default:
                    break;
            }
            if (iconName) {
                return <Icon name={iconName} className={`${prefixCls}__icon--${type} fa-2x`} />
            }      
        }
    }

    _close = () => {
        this.setState({
            animatedOut: this.animatedOut
        });
    }

    _removeCurrentNotice = () => {
        const { onRemove, onClose } = this.props;
        onRemove && onRemove();
        onClose && onClose();
    }

    _animatedOut= (e) => {
        if ( e.target.className.indexOf(`${this.animatedOut}`) > -1 ){
            this._removeCurrentNotice();
        }
    }
    
}

Notice.defaultProps = {
    duration: defaultDuration,
};


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
    * 通知标题
    */
    title: PropTypes.string, 
    /**
    * 通知内容
    */   
    message: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    /**
    * 点击关闭按钮的回调函数
    */   
    onClose: PropTypes.func,
    /**
    * 移除当前notice
    */   
    onRemove: PropTypes.func,
    /**
    * 自定义按钮
    */   
    btn: PropTypes.element,
    /**
    * 持续秒数,单位为ms
    */
    duration: PropTypes.number,
}

export default Notice;