import React from 'react';
import { cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Tip from './tip';
import './index.styl';

class Tooltip extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            init: false,
        }
    }
    componentDidMount() {
        const props = this.props;

        if (props.visible){
            Tip.show({
                prefixCls: props.prefixCls,
                title: props.title,
                overlay: props.overlay,
                visible: props.visible,
                placement: props.placement,
                tooltipDom: findDOMNode(this),
                builtinPlacements: props.builtinPlacements,
                tooltipRef: this,
                mask: props.mask,
                animatedName: props.animatedName,
                onClose: props.onClose,
                getContainer: props.getContainer,
            })
            this.setState({
                init: true
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const { init } = this.state
        if (nextProps.visible||init) {
            Tip.show({
                prefixCls: nextProps.prefixCls || this.props.prefixCls,
                title: nextProps.title,
                overlay: nextProps.overlay,
                visible: nextProps.visible,
                placement: nextProps.placement,
                tooltipDom: findDOMNode(this),
                builtinPlacements: nextProps.builtinPlacements,
                tooltipRef: this,
                mask: nextProps.mask,
                animatedName: nextProps.animatedName,
                onClose: nextProps.onClose,
                getContainer: nextProps.getContainer,
            })
            this.setState({
                init: true
            })
        }
    }

    componentWillUnmount() {
        Tip.destroy(this);
    }


    render() {
        const { children } = this.props;
        return cloneElement(children)
    }
}

Tooltip.defaultProps = {
    prefixCls: 'tooltip',
    placement: 'top',
    mask: false
}

Tooltip.propTypes = {
    /**
     * 固定类名
     */
    prefixCls: PropTypes.string,
    /**
    * 提示文字
    */
    title: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
    * 自定义提示内容
    */
    overlay: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.func]),
    /**
    * 提示样式
    */
    style: PropTypes.object,
    /**
    * 控制显隐
    */
    visible: PropTypes.bool,
    /**
    * 弹出框位置，位置可选， 默认top
    * top left right bottom topLeft topRight bottomLeft
    * bottomRight leftTop leftBottom rightTop rightBottom
    */
    placement: PropTypes.string,
    /**
    * 是否需要蒙层
    */
    mask: PropTypes.bool,
    /**
     * 关闭的回调函数
     */
    onClose: PropTypes.func,
    /**
     * domAlign位置选项
     */
    builtinPlacements: PropTypes.object,
    /**
    * 动画名称
    */
    animatedName: PropTypes.string,
    /**
   * 浮层渲染父节点，默认渲染到 body 上
   */
    getContainer: PropTypes.func,

}

export default Tooltip;
