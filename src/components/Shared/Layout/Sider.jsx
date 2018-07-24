if (typeof window !== 'undefined') {
    const matchMediaPolyfill = function matchMediaPolyfill(mediaQuery){
        return {
            media: mediaQuery,
            matches: false,
            addListener() {
            },
            removeListener() {
            },
        };
    };
    window.matchMedia = window.matchMedia || matchMediaPolyfill;
}

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Icon from 'Shared/Icon'
import classNames from 'classnames';

const dimensionMap = {
  xs: '480px',
  sm: '768px',
  md: '992px',
  lg: '1200px',
  xl: '1600px',
};

class Sider extends React.PureComponent {
    constructor(props) {
        super(props);
        let matchMedia;
        if (typeof window !== 'undefined') {
            matchMedia = window.matchMedia;
        }
        if (matchMedia && props.breakpoint && props.breakpoint in dimensionMap) {
           
            this.mql = matchMedia(`(max-width: ${dimensionMap[props.breakpoint]})`);
        }

        let expand;
        if ('collapsed' in props) {
            expand = !props.collapsed;
        } else {
            expand = !props.defaultCollapsed;
        }
        this.state = {
            expand,
            below: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('collapsed' in nextProps) {
            this.setState({
                expand: !nextProps.collapsed,
            });
        }

    }

    componentDidMount() {
        if (this.mql) {
            this.mql.addListener(this._responsiveHandler);
            this._responsiveHandler(this.mql);
        }
    }

    componentWillUnmount() {
        if (this.mql) {
            this.mql.removeListener(this._responsiveHandler);
        }
    }

    render(){
        const { children, collapsible, style, collapsedWidth, width, className, trigger } = this.props;
        const { expand, below } = this.state;
        
        const defaultTriggerDom = this._getTriggerDom();
        const zeroWidthTrigger = this._getZeroWidthTrigger();
        const triggerDom = zeroWidthTrigger || (trigger || defaultTriggerDom);

        const siderWidth = expand ? width : collapsedWidth; 
        const divStyle = {
            flex: `0 0 ${siderWidth}px`,
            width: `${siderWidth}px`,
            ...style
        }

        const siderCls = classNames("layout__sider", {
            "layout__sider--collapsed": !expand,
            "layout__sider--has-trigger": !!trigger,
            "layout__sider--below": !!below,
            "layout__sider--zero-width" : String(collapsedWidth) === '0'
        }, className)
        return (
            <div className={siderCls} style={divStyle}>
                { children }
                { collapsible || (below && zeroWidthTrigger) ? triggerDom : null}
            </div>
        );
    }

    _responsiveHandler = (mql) => {
        this.setState({ below: mql.matches });
        if (this.state.expand === mql.matches) {
            const expand = !mql.matches;
            this._setExpand(expand, 'responsive');
        }
    }

    _getTriggerDom = () => {
        const { trigger, reverseArrow } = this.props;

        if (trigger === null) return;

        let triggerIcon;
        if (reverseArrow) {
            triggerIcon = this.state.expand 
            ? <Icon name="angle-right" />
            : <Icon name="angle-left" />; 
        } else{
            triggerIcon = this.state.expand 
            ? <Icon name="angle-left" />
            : <Icon name="angle-right" />; 
        }
        
        return (
            <div className="layout__sider--trigger" onClick={this._onTrigger}>
                { triggerIcon }
            </div>
        )
    }

    // special trigger when collapsedWidth == 0
    _getZeroWidthTrigger = () => {
        const { collapsedWidth } = this.props;
        const triggerIcon = collapsedWidth === 0 || collapsedWidth === '0' ?
        (
            <span onClick={this._onTrigger} className="layout__sider--zero-width-trigger">
                <Icon name="bars" />
            </span>
        ) : null

        return triggerIcon;
    }

    _onTrigger = (type) => {
        const expand = !this.state.expand;
        this._setExpand(expand, 'clickTrigger')
    }

    _setExpand = (expand, type) => {
        const { collapsed, onCollapse } = this.props;

        if ( !collapsed ){
            this.setState({
                expand
            })
        }

        onCollapse && onCollapse(!expand, type);
    }
}

Sider.__JD_LAYOUT_SIDER = true;

Sider.defaultProps = {
    collapsible: false,
    defaultCollapsed: false,
    reverseArrow: false,
    width: 200,
    collapsedWidth: '64',
    style: {},
}

Sider.propTypes = {
    /**
     * [collapsible description]
     * @type {[bool]}
     * 是否可收起
     */
    collapsible: PropTypes.bool, 
    /**
     * [defaultCollapsed description]
     * @type {[bool]}
     * 是否默认收起
     */
    defaultCollapsed: PropTypes.bool, 
    /**
     * [reverseArrow description]
     * @type {[bool]}
     * 翻转折叠提示箭头的方向，当 Sider 在右边时可以使用
     */
    reverseArrow: PropTypes.bool, 
    /**
     * [collapsed description]
     * @type {[bool]}
     * 当前收起状态
     */
    collapsed: PropTypes.bool,
    /**
     * [onCollapse description]
     * @type {[func]}
     * 展开-收起时的回调函数，有点击 trigger 以及响应式反馈两种方式可以触发
     */
    onCollapse: PropTypes.func,
    /**
     * [trigger description]
     * @type {[bool]}
     * 自定义 trigger，设置为 null 时隐藏 trigger
     */
    trigger: PropTypes.bool,
    /**
     * [width description]
     * @type {[string, element]]}
     * 宽度
     */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /**
     * [breakpoint description]
     * @type {[string]}
     * 触发响应式布局的断点, 有'xs', 'sm', 'md', 'lg', 'xl'
     */
    breakpoint: PropTypes.string,
    /**
     * [style description]
     * @type {[object]}
     * 指定样式
     */
    style: PropTypes.object,
    /**
     * [className description]
     * @type {[string]}
     * 容器 className
     */
    className: PropTypes.string,

}

export default Sider;