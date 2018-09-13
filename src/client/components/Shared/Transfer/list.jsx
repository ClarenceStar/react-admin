import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Item from './item';
import DropFloor from './dropFloor';
import './index.styl';

import {
    Checkbox
} from 'Shared';

class List extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        const { prefixCls, renderFooter, style, headerStyle, titleText } = props;

        return (
            <div className={`${prefixCls}__list`} style={style}>
                <div className={`${prefixCls}__header`} style={headerStyle}>
                    { titleText }
                </div>

                <div className={`${prefixCls}__body`}>
                    { this._getListItems() }
                </div>

                { this._getFooter() }
            </div>
        )
    }

    _getListItems = () => {
        const { dataSource, prefixCls, handleSelect, handleClick, checkedKeys, onChange, type, onDropValidate, handleDrag, clickMode, onItemClick, itemIcon, drag } = this.props;



        let items;
        items = dataSource.map((item, index) => {
            const itemTemp = (
                <Item
                    prefixCls={prefixCls}
                    item={item}
                    handleSelect={handleSelect}
                    handleClick={handleClick}
                    checkedKeys={checkedKeys}
                    order={index+1}
                    onDropValidate={onDropValidate}
                    handleDrag={handleDrag}
                    type={type}
                    drag={drag}
                    clickMode={clickMode}
                    onItemClick={onItemClick}
                    icon={itemIcon}
                />
            );
            if (index == 0) {
                return (
                    <div key={item.key} >
                        <DropFloor order={1} targetType={type}></DropFloor>
                        { itemTemp }
                        <DropFloor order={2} targetType={type}></DropFloor>
                    </div>
                )
            } else {
                return (
                    <div key={item.key} >
                        { itemTemp }
                        <DropFloor order={index+2} targetType={type}></DropFloor>
                    </div>
                )
            }
        });

        if ( dataSource.length <= 0) {
            items = (
                <DropFloor order={1} targetType={type}></DropFloor>
            )
        }


        return (
            <ul className={`${prefixCls}__list-content system-scroll-bar`}>
                {items}
            </ul>
        )
    }

    _getFooter = () => {
        const { renderFooter, prefixCls } = this.props;

        if (renderFooter) {
            return (
                <div className={`${prefixCls}__footer`}>
                    { renderFooter() }
                </div>
            )
        }
    }

    _handleClick(e, item) {
        e.preventDefault();
        const {handleSelect} = this.props;
        handleSelect(item);
    }

    _getChecked = (key) => {
        const { checkedKeys } = this.props;
        return checkedKeys.indexOf(key) > -1;
    }
}

List.defaultProps = {
    prefixCls: 'transfer',
}

List.propTypes = {
    /**
     * [dataSource description]
     * @type {[array]}
     * 穿梭框数据
     *      @param {String} key
     *      @param {String} title
     *      @param {String} description
     *      @param {bool} disabled
     */
    dataSource: PropTypes.arrayOf(PropTypes.object),
    /**
     * [prefixCls description]
     * @type {[string]}
     */
    prefixCls: PropTypes.string,
    /**
     * [onItemClick description]
     * @type {[function]}
     * 点击选项回调函数
     */
    onItemClick: PropTypes.func,
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
     * [checkedKeys description]
     * @type {[array]}
     * 选中项的集合
     */
    checkedKeys: PropTypes.arrayOf(PropTypes.string),
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
     * [type description]
     * @type {[string]}
     * 框的类别，为“left” 或 “right”
     */
    type: PropTypes.string,
    /**
     * [onChange description]
     * @type {[function]}
     * 底部渲染函数
     */
    renderFooter: PropTypes.func,
    /**
     * [clickMode：false —— checkbox可选模式]
     * [clickMode：true —— 点击穿梭模式]
     * @type {[bool]}
     */
    clickMode: PropTypes.bool,
    /**
     * [drag 启用或者禁用拖拽]
     * @type {[bool]}
     */
    drag: PropTypes.bool,
    /**
     * [itemIcon itemIcon图标]
     * @type {[string]}
     */
    itemIcon: PropTypes.string,
    /**
     * [headerStyle 头部样式]
     * @type {[object]}
     */
    headerStyle: PropTypes.object,
    titleText: PropTypes.string
};

export default List;
