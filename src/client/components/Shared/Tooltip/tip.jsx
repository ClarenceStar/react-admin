import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { getContainer } from 'utils/common';
import cx from 'classnames';
import TipInner from './tipInner';

let seed = 0;
class Tip extends React.PureComponent {

    render() {
        return (
            <TipInner {...this.props} />
        );
    }
}

function _getUuid() {
    const now = Date.now();
    return `tip_${now}_${seed++}`;
}

Tip.show = (properties) => {
    let { tooltipRef, ...props } = properties;
    
    // 若当前实例未生成容器，则生成容器
    if ( !tooltipRef._container ){
        const uuid = _getUuid();
        tooltipRef._container = getContainer( uuid, properties.getContainer );
    }

    const container = tooltipRef._container;

    ReactDOM.render(<Tip {...properties} />, container);
       
}

Tip.destroy = (tooltipRef) => {
    const container = tooltipRef._container;
        if (container) {
            const parent = container.parentNode;
            const unmounted = ReactDOM.unmountComponentAtNode(container);  
            unmounted && parent.removeChild(container);
        }
}

Tip.defaultProps = {
}

Tip.propTypes = {
   /**
    * 固定类名
    */
    prefixCls: PropTypes.string.isRequired, 
    /**
    * 提示文字
    */
    title: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), 
    /**
    * 复杂的提示内容
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
     * 关闭的回调函数
     */
    onClose: PropTypes.func,
    /**
    * 动画名称
    */ 
    animatedName: PropTypes.string,
     /**
    * 浮层渲染父节点，默认渲染到 body 上
    */ 
    getContainer: PropTypes.func, 
}

export default Tip;
