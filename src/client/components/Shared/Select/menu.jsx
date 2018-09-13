import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'Shared/Tooltip';
import { cloneElement } from 'react';
import arrayTreeFilter from 'array-tree-filter';
import Button from 'Shared/Button';
import Icon from 'Shared/Icon';
import cx from 'classnames';
import './index.styl';

class Menu extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const { menuStyle, options, prefixCls } = this.props;
        let ret = []
        let index = 0
        let classString = prefixCls || 'select'
        options.forEach((singleOption) => {
            if (singleOption.type === 'optionGroup') {
                ret.push(<li className={`${classString}-menu__group-title`}key={index}>{singleOption.label}</li>)
                index++
                singleOption.children.forEach(item => {
                    ret.push(this._getItem(item, index++))
                })
            }
            if (singleOption.type === 'option') {
                ret.push(this._getItem(singleOption, index++))
            }
        })
        // console.log('dropdownWidth', this.props.dropdownWidth)
        return (
            <div className={`${classString}-menus`} style={{width:this.props.dropdownWidth?this.props.dropdownWidth:null}}>
                <ul className={`${classString}-menu system-scroll-bar`} style={menuStyle}>
                    {ret}
                </ul>
            </div>
        );
    }

    _getItem = (option, index) => {
        const { onSelect, activeValue, prefixCls } = this.props;
        const hasChildren = option.children && option.children.length > 0;
        let classString = prefixCls || 'select'
        const cls = cx(`${classString}-menu__item`, {
            [`${classString}-menu__item--active`]: activeValue === option.value,
            [`${classString}-menu__item--disabled`]: option.disabled,
            [`${classString}-menu__item--loading`]: option.loading,
            [`${classString}-menu__item--expand`]: hasChildren
        });

        let title = '';
        if (option.title) {
            title = option.title;
        } else if (typeof option.label === 'string') {
            title = option.label;
        }

        const loadingIcon = option.loading ? (
            <Icon name="spinner" className="fa-spin fa-1x fa-fw" />
        ) : null
        return (
            <li
                style={{width:this.props.dropdownWidth?this.props.dropdownWidth:null}}
                key={option.value}
                className={cls}
                title={title}
                onClick={onSelect.bind(this, option, index)} >
                {option.label}
                {loadingIcon}
            </li>
        )
    }

    _getActiveOptions = (values) => {
        const activeValue = values || this.props.activeValue;
        // console.log(this.props.activeValue)
        const options = this.props.options;
        return arrayTreeFilter(options, (o, level) => o.value === activeValue[level]);
    }

    _getShowOptions = () => {
        const { options } = this.props;

        const result = this._getActiveOptions()
            .map(activeOption => activeOption.children)
            .filter(activeOption => !!activeOption);
        result.unshift(options);
        // console.log('options, result', options, result)
        return result;
    }

}

Menu.defaultProps = {

}

Menu.propTypes = {
    /**
     * [options description]
     * @type {[array]}
     * 级联框可选项数据源
     *      @param {String} value
     *      @param {String} label
     *      @param {array} children
     *      @param {bool} disabled
     *      @param {bool} isLeaf
     */
    options: PropTypes.array,
    /**
     * [activeValue description]
     * @type {[array],[string]}
     * 已经被选中的可选项
     */
    // activeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.disabled]),
    /**
     * [onSelect description]
     * @type {[func]}
     * 选择可选项的后的回调
     */
    onSelect: PropTypes.func,
    /**
     * [menuStyle description]
     * @type {[object]}
     * 级联框菜单样式
     */
    menuStyle: PropTypes.object,
};

export default Menu;
