import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'Shared/Tooltip';
import { cloneElement } from 'react';
import arrayTreeFilter from 'array-tree-filter';
import shallowEqualArrays from 'shallow-equal/arrays';
import Button from 'Shared/Button';
import Icon from 'Shared/Icon';
import Menu from './menu';
import './index.styl';

class Trigger extends React.PureComponent {

    constructor(props) {
        super(props);
        let initialValue = [];
        if ('value' in props) {
            initialValue = props.value || [];
        } else if ('defaultValue' in props) {
            initialValue = props.defaultValue || [];
        }

        this.state = {
            popupVisible: props.popupVisible,
            activeValue: initialValue,
            value: initialValue,
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps && !shallowEqualArrays(this.props.value, nextProps.value)) {

            const newValues = {
                value: nextProps.value || [],
                activeValue: nextProps.value || [],
            };
            // allow activeValue diff from value
            // https://github.com/ant-design/ant-design/issues/2767
            if ('loadData' in nextProps) {
                delete newValues.activeValue;
            }
            this.setState(newValues);
        }

        if ('popupVisible' in nextProps) {
            this.setState({
                popupVisible: nextProps.popupVisible,
            });
        }
    }

    render() {
        const { children, placement, builtinPlacements, onClick, getContainer } = this.props;

        return (
            <Tooltip
              prefixCls="cascader"
              overlay={ this._getOverlay() }
              visible={ this.state.popupVisible}
              placement={placement}
              builtinPlacements={builtinPlacements}
              onClose={onClick}
              getContainer={getContainer}
              >
                { cloneElement(children) }
            </Tooltip>
        );
    }


    _getOverlay = () => {
        const props = this.props;
        const { popupVisible, activeValue } = this.state;

        return (
            <div>
                <Menu
                    {...props}
                    visible={popupVisible}
                    activeValue={ activeValue }
                    onSelect={this._handleMenuSelect} />
            </div>
        )
    }

    _handleMenuSelect = (targetOption, menuIndex, e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        }
        const { changeOnSelect, loadData } = this.props;
        let { activeValue } = this.state;

        if (!targetOption || targetOption.disabled) {
            return;
        }

        activeValue = activeValue.slice(0, menuIndex + 1);
        activeValue[menuIndex] = targetOption.value;
        const activeOptions = this._getActiveOptions(activeValue);

        // 需要loadData时
        if (targetOption.isLeaf === false && !targetOption.children && loadData) {
            if (changeOnSelect) {
                this._handleChange(activeOptions, { visible: true }, e);
            }
            this.setState({ activeValue });
            loadData(activeOptions);
            return;
        }

        const newState = {};
        if (!targetOption.children || !targetOption.children.length) {
            this._handleChange(activeOptions, { visible: false }, e);
            // set value to activeValue when select leaf option
            newState.value = activeValue;
        } else if (changeOnSelect) {
            this._handleChange(activeOptions, { visible: true }, e);
            // set value to activeValue on every select
            newState.value = activeValue;
        }

        newState.activeValue = activeValue;
        //  not change the value by keyboard
        if ('value' in this.props ||
            (e.type === 'keydown' && e.keyCode !== KeyCode.ENTER)) {
            delete newState.value;
        }
        this.setState(newState);
    }

    _getActiveOptions = (activeValue) => {
        return arrayTreeFilter(this.props.options, (o, level) => o.value === activeValue[level]);
    }

    _handleChange = (options, setProps, e) => {
        if (e.type !== 'keydown' || e.keyCode === KeyCode.ENTER) {
            const { onChange } = this.props
            onChange && onChange(options.map(o => o.value), options);
            this._setPopupVisible(setProps.visible);
        }
    }

    _setPopupVisible = (popupVisible) => {
        if (!('popupVisible' in this.props)) {
            this.setState({ popupVisible });
        }

        // sync activeValue with value when panel open
        if (popupVisible) {
            this.setState({
                activeValue: this.state.value,
            });
        }

        // close menu
        this.props.onClick();

    }
}

Trigger.defaultProps = {

}

Trigger.propTypes = {
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
     * [defaultValue description]
     * @type {[array]}
     * 默认选中项
     */
    defaultValue: PropTypes.array,
    /**
     * [value description]
     * @type {[array]}
     * 指定选中项
     */
    value: PropTypes.array,
    /**
     * [popupVisible description]
     * @type {[bool]}
     * 级联框是否可见
     */
    popupVisible: PropTypes.bool,
    /**
     * [onChange description]
     * @type {[function]}
     * 选择可选项后的回调
     */
    onChange: PropTypes.func,
    /**
     * [onClick description]
     * @type {[function]}
     * 关闭级联框的回调
     */
    onClick: PropTypes.func,
    /**
     * [placement description]
     * @type {[string]}
     * 浮层预设位置：bottomLeft bottomRight topLeft topRight
     */
    placement: PropTypes.string,
    /**
     * [loadData description]
     * @type {[function]}
     * 用于动态加载选项
     */
    loadData: PropTypes.func,
    /**
     * [object description]
     * @type {[object]}
     * 级联框的domAlign位置控制对象
     */
    builtinPlacements: PropTypes.object,
    /**
     * [getContainer description]
     * @type {[function]}
     * 浮层渲染父节点，默认渲染到 body 上
     */
    getContainer: PropTypes.func,
};

export default Trigger;
