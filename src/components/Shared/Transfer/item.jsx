import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { DragSource } from 'react-dnd';
import { OPERATION } from 'constants/text';
import './index.styl';

import {
    Icon,
    Popconfirm,
    Checkbox
} from 'Shared';

const TransferItemSource = {
    beginDrag(props, monitor, component) {
        component.setState({isDrag: true});
        return {
            sourceType: props.type,
            order: props.order,
            floorType: 'transferItem',
            onDropValidate: props.onDropValidate,
        }
    },

    endDrag(props, monitor, component) {
        component.setState({isDrag: false});
        if(!monitor.didDrop()) return;
        const result = monitor.getDropResult();

        const targetIndex = result.order;
        const sourceType = result.sourceType;
        const targetType = result.targetType;
        const sourceIndex = props.order;
        const sourceKey = props.item.key;

        props.handleDrag
        && props.handleDrag({sourceIndex,
                            targetIndex,
                            sourceType,
                            targetType,
                            sourceKey});
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

@DragSource('TransferItem', TransferItemSource, collect)
class Item extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isDrag: false
        }
    }

    render() {
        const { connectDragSource, prefixCls, item, clickMode, onItemClick, icon, drag } = this.props;
        const cls = cx({
            [`${prefixCls}__content-item`]: true,
            [`${prefixCls}__content-item--disabled`]: item.disabled,
            [`${prefixCls}__content-item--click-mode`]: !!clickMode
        });
        const el = (
            <li
                className={cls}
                title={item.description}
                onClick={item.disabled ? undefined : (event)=>{this._handleClick(event,item)}}>
                {
                    !!clickMode
                        ?   <div className={`${prefixCls}__content-click-item`}>
                                <span title={item.title}>{item.title}</span>
                                {this._getOperationIcon(item)}
                            </div>
                        :   <Checkbox
                            checked={this._getChecked(item.key)}
                            disabled={item.disabled}>
                                {item.title}
                            </Checkbox>
                }

            </li>
        );
        if (!drag || item.disabled ) {
            return el;
        } else {
            return connectDragSource(el);
        }
    }

    _handleClick(e, item) {
        const { clickMode, handleSelect, handleClick, onItemClick } = this.props;
        e.preventDefault();
        if ( !!clickMode ) {
            onItemClick(item);
        } else {
            
            handleSelect(item);
        }
    }

    _iconClick(e, item) {
        const { handleClick } = this.props;
        e && e.preventDefault();
        handleClick(item);
    }

    _getChecked = (key) => {
        const { checkedKeys } = this.props;
        return checkedKeys.indexOf(key) > -1;
    }

    _getOperationIcon = (item) => {
        const {icon} = this.props;

        if (icon === 'plus') {
            return <Icon
                        name={icon}
                        onClick={item.disabled ? undefined : (event)=>{this._iconClick(event,item)}} />
        }
        if (icon === 'trash') {
            return <Popconfirm 
                        title={OPERATION.ISDEL}
                        onOk={item.disabled ? undefined : (event)=>{this._iconClick(event,item)}}
                        placement='topRight' >
                        <Icon
                            name={icon} />
                    </Popconfirm>
        }
    }
}



Item.defaultProps = {

}

Item.propTypes = {
    /**
     * [prefixCls description]
     * @type {[string]}
     */
    prefixCls: PropTypes.string,
    /**
     * [object description]
     * @type {[object]}
     * 穿梭框数据选项
     */
    item: PropTypes.object,
    /**
     * [type description]
     * @type {[string]}
     * 框的类别，为“left” 或 “right”
     */
    type: PropTypes.string,
    /**
     * [handleClick: description]
     * @type {[function]}
     * 选项被选中时的回调函数
     */
    handleClick: PropTypes.func,
    /**
     * [handleSelect: description]
     * @type {[function]}
     * 选项被选中时的回调函数
     */
    handleSelect: PropTypes.func,
    /**
     * [onDropValidate description]
     * @type {[function]}
     *      @param {String} souceOrder
     *      @param {String} targetOrder
     *      @param {String} sourceType
     *      @param {String} targetType
     * 拖拽过程中触发的回调函数
     */
    onDropValidate: PropTypes.func,
    /**
     * [checkedKeys description]
     * @type {[array]}
     * 选中项的集合
     */
    checkedKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * [onItemClick description]
     * @type {[function]}
     * 点击选项回调函数
     */
    onItemClick: PropTypes.func,
    /**
     * [handleDrag description]
     * @type {[function]}
     *      @param {String} sourceOrder
     *      @param {String} targetOrder
     *      @param {String} sourceType
     *      @param {String} targetType
     * 拖拽结束触发的回调函数
     */
    handleDrag: PropTypes.func,
    /**
     * [clickMode：false —— checkbox可选模式]
     * [clickMode：true —— 点击穿梭模式]
     * @type {[bool]}
     */
    clickMode: PropTypes.bool,
    /**
     * [icon icon图标]
     * @type {[string]}
     */
    icon: PropTypes.string,
    /**
     * [drag 启用或者禁用拖拽]
     * @type {[bool]}
     */
    drag: PropTypes.bool,
};

export default Item;
