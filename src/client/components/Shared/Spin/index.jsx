import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Icon from 'Shared/Icon';
import Mask from 'Shared/Mask';
import classNames from 'classnames';
import './index.styl';

class Spin extends React.PureComponent {
    constructor(props) {
        super(props);
        const spinning = props.spinning;
        this.state = {
            spinning,
        };
    }

    componentWillUnmount() {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        if (this.delayTimeout) {
            clearTimeout(this.delayTimeout);
        }
    }

    componentWillReceiveProps(nextProps) {
        const currentSpinning = this.props.spinning;
        const spinning = nextProps.spinning;
        const { delay } = this.props;
        // 不需要delay
        if (!delay){
            // 即将显示
            if (spinning && !currentSpinning){
                this.setState({spinning})
            }
            // 即将关闭；延时300ms关闭 
            else if (!spinning ){
                this.debounceTimeout && clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(()=>{
                    this.setState({spinning})
                }, 300);
            }
        } 
        // 需要delay
        else {
            // 即将显示；且delay显示
            if (spinning && !currentSpinning) {
             
                this.delayTimeout = setTimeout(()=>{
                    this.setState({spinning})
                }, delay);

            }
            // 即将关闭；清除delay显示的定时器；延时300ms关闭 
            else if( !spinning ) {
        
                this.delayTimeout && clearTimeout(this.delayTimeout);
                this.debounceTimeout && clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(()=>{
                    this.setState({spinning})
                }, 300);
            }
        }
    }

    render(){
 
        const { prefixCls, children, tip, className, img, size } = this.props;
        const { spinning } = this.state;
        const spinClassName = classNames(prefixCls, {
            [`${prefixCls}__spinning`]: spinning,
            [`${prefixCls}__show-text`]: !!tip,
        }, className);

        let iconSize;
        let fontSize;
        switch (size) {
            case 'small':
                iconSize = 'fa-1x';
                fontSize = '10px';
                break;
            case 'large': 
                iconSize = 'fa-3x';
                fontSize = '14px';
                break;
            default: 
                iconSize = 'fa-2x';
                fontSize = '12px';
        }
        const isNestedPattern = this._isNestedPattern();
        const spinElement = (
            <div className={spinClassName} >
                
                { isNestedPattern ? null 
                    :<Mask style={{backgroundColor: "rgba(55, 55, 55, 0.2)"}}/>}

                <div className={`${prefixCls}__img-wrap`}>
                    { img ? 
                        <img className={`${prefixCls}__img`} src={img} />
                        : <Icon name="spinner" 
                            className={`${prefixCls}__img fa-pulse ${iconSize} fa-fw`} />
                    }
                    { tip && 
                        <div className={`${prefixCls}__text--${size}`} 
                            style={{fontSize}}>
                                {tip}
                        </div>}
                </div>
            </div>
        );
       
        if ( isNestedPattern ) {
            const containerClassName = classNames({
                [`${prefixCls}__container`]: true,
                [`${prefixCls}__blur`]: spinning,
            });
            return (
                <div className={`${prefixCls}-nest`}> 
                    {spinning && spinElement}
                    <div className={containerClassName}>
                        {this.props.children}
                    </div>
                </div>
            );
        }

        return spinElement;
    }

    _isNestedPattern = () => {
        return !!(this.props && this.props.children);
    }
}

Spin.defaultProps = {
    prefixCls: 'spin',
    spinning: true
}

Spin.propTypes = {
    /**
     * [prefixCls description]
     * @type {[string]}
     * 类名前缀
     */
    prefixCls: PropTypes.string, 
    /**
     * [img description]
     * @type {[string]}
     * 自定义加载动图
     */
    img: PropTypes.string, 
    /**
     * [tip description]
     * @type {[string]}
     * 加载中描述文字
     */
    tip: PropTypes.string, 
    /**
     * [className description]
     * @type {[string]}
     * 自定义类名
     */
    className: PropTypes.string, 
    /**
     * [size description]
     * @type {[string]}
     * 组件大小，可选值为 small default large
     */
    size: PropTypes.string,
    /**
     * [spinning description]
     * @type {[bool]}
     * 是否显示
     */
    spinning: PropTypes.bool,
    /**
     * [delay description]
     * @type {[number]}
     * 延迟显示加载效果的时间（防止闪烁）单位为毫秒
     */
    delay: PropTypes.number,
}

export default Spin;