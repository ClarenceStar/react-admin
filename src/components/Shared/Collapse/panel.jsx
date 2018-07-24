import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'Shared/Icon';
import {DragSource} from 'react-dnd';
import cx from 'classnames';
import './index.styl';

const CollapsePanelSource = {
    beginDrag(props, monitor, component) {
        component.setState({isDrag: true});
        return {
            order: props.panelIndex+1,
            floorType: 'instance'
        }
    },
    endDrag(props, monitor, component) {
        component.setState({isDrag: false});
        if(!monitor.didDrop()) return;
        const result = monitor.getDropResult();
   
        props.onDrag && props.onDrag(props.order, result.order);
    },
    canDrag(props, monitor) {
        const { canDrag } = props;
        if(canDrag) {
            return canDrag(props, monitor);
        }else {
            return true;
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}
@DragSource('CollapsePanel', CollapsePanelSource, collect)
class Panel extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isDrag : false,
        }
    }

    componentWillReceiveProps(nextProps){
        const { id, activeKey: nActiveKey } = nextProps;
        const { activeKey: cActiveKey } = this.props;
        
        const height = this.box.offsetHeight;

        // 产生 panel由打开到关闭的动画
        if ( cActiveKey.includes(id) && !nActiveKey.includes(id)){
            this.content.style.height = height + "px";
            this._setHeight2Zero()
        }

        // 产生 panel由关闭到打开的动画
        if ( !cActiveKey.includes(id) && nActiveKey.includes(id)){
            if (height == 0) {
                this.content.style.height = '';
            } else {
                this.content.style.height = height + "px";
            }

            this.content.style.overflow = 'hidden';
            
        }
    }

    render() {
     
        let { active, connectDragSource, renderHeader, dragMode, children, prefixStyle, style, disabled, panelIndex, renderLeftIcon } = this.props;
        const { isDrag } = this.state;

        active = !disabled && active;

        const itemCls = cx("collapse__item", {
            "collapse__item--active": active,
            "collapse__item--disabled": disabled,
            "collapse__item--dragging": isDrag,
        });

        const headerCls = cx("collapse__header", {
            "collapse__header--disabled": disabled,
        });

        const contentCls = cx("collapse__content", {
            "collapse__content--active": active,
            "collapse__content--inactive": !active 
        });

        const itemStyle = prefixStyle ? prefixStyle : style;

        const panelContent = (
            <div className={itemCls} style={itemStyle}>

                <div className={headerCls} onClick={this._handleClick.bind(this, active)}>
                        {
                            renderLeftIcon
                            ? renderLeftIcon(panelIndex, active)
                            : <Icon
                                className="collapse__icon"
                                name={ active ? "angle-down" : "angle-right"}
                             />
                        }
                        { typeof renderHeader === 'function' ? renderHeader(panelIndex, !active) : renderHeader }
                </div>

                <div
                    className={contentCls}

                    onTransitionEnd={this._onTransitionEnd}

                    ref={(content)=>{this.content=content}}

                    style={{
                        display: isDrag ? 'none' : ''
                    }}
                    >

                        <div className="collapse__content-box"  ref={(box)=>{this.box=box}}>
                            { children }
                        </div>

                </div>

            </div>
        )

        if (dragMode) {
            return (connectDragSource(panelContent));
        }else {
            return panelContent;
        }
 
    }

    _handleClick = (active, event) => {
        
        const { onClick, _onItemClick, panelIndex, id } = this.props;
       
        _onItemClick(id);
        onClick && onClick(id, !active, panelIndex, event);
       
    }

    
    _onTransitionEnd = (e) => {

        // 嵌套情况下自适应高度
        this.content.style.height= '';

        // 若不移除，则在panel内有colorpicker的情况，colorpicker的弹出框也会被隐藏
        this.content.style.overflow = '';
    }

    _setHeight2Zero = () => {
        setTimeout(() => {
            this.content.style.height = '0px';
        }, 0);
    }
}

Panel.defaultProps = {

}

Panel.propTypes = {
    /**
     * [id description]
     * @type {[number,string]}
     * 折叠框的key
     */
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * [order description]
     * @type {[number,string]}
     * 折叠框的序号，从1开始
     */
    order: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * [id description]
     * @type {[number,string]}
     * panel序号
     */
    panelIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * [renderHeader description]
     * @type {[string,func]}
     * 折叠框头部
     */
    renderHeader: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /**
     * [renderLeftIcon description]
     * @type {[func]}
     * 折叠框左侧Icon
     */
    renderLeftIcon: PropTypes.func,
    /**
     * [accordion description]
     * @type {[bool]}
     * 手风琴
     */
    accordion: PropTypes.bool,
    /**
     * [active description]
     * @type {[bool]}
     * 折叠框激活
     */
    active: PropTypes.bool,
    /**
     * [style description]
     * @type {[object]}
     * 样式
     */
    style: PropTypes.object,
    /**
     * [prefixStyle description]
     * @type {[object]}
     * 样式
     */
    prefixStyle: PropTypes.object,
    /**
     * [disabled description]
     * @type {[bool]}
     * 折叠框禁用
     */
    disabled: PropTypes.bool,
    /**
     * [children description]
     * @type {[element,string]}
     *
     */
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    /**
     * [onItemClick description]
     * @type {[function]}
     * 点击折叠框回调函数
     */
    _onItemClick: PropTypes.func,
    /**
     * [onClick description]
     * @type {[function]}
     * 点击折叠框回调函数
     */
    onClick: PropTypes.func,
    /**
     * [dragMode description]
     * @type {[bool]}
     * 支持拖放
     */
    dragMode: PropTypes.bool,
    /**
     * [onDrag description]
     * @type {[function]}
     * 拖放回调函数
     */
    onDrag: PropTypes.func,
};

export default Panel;
