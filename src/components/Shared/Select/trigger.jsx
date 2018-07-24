import React from 'react';
import ReactDOM from 'react-dom';
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
            initialValue = [props.value] || [];
        } else if ('defaultValue' in props) {
            initialValue = [props.defaultValue] || [];
        }
        // const width = ReactDOM.findDOMNode(this).offsetWidth;
        this.state = {
            popupVisible: props.popupVisible,
            activeValue: initialValue,
            value: initialValue,
            dropdownWidth: null,
        };
    }
    componentDidMount() {
        // console.log('componentDidMount')
        this.setDropdownWidth();
    }

    componentDidUpdate() {
        // console.log('componentDidUpdate')
        this.setDropdownWidth();
    }

    setDropdownWidth = () => {
        const width = ReactDOM.findDOMNode(this).offsetWidth;
        // console.log('width', width)
        if (width !== this.state.dropdownWidth) {
            this.setState({ dropdownWidth: width });
        }
    }

    componentWillReceiveProps(nextProps) {
        // if ('value' in nextProps && !shallowEqualArrays(this.props.value, nextProps.value)) {
        if ('value' in nextProps) {

            const newValues = {
                value: nextProps.value,
                activeValue: nextProps.value
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
                overlay={this._getOverlay()}
                visible={this.state.popupVisible}
                placement={placement}
                builtinPlacements={builtinPlacements}
                onClose={onClick}
                getContainer={getContainer}
            >
                {cloneElement(children)}
            </Tooltip>
        );
    }


    _getOverlay = () => {
        const props = this.props;
        const { options } = props
        const { popupVisible, activeValue, dropdownWidth } = this.state;

        return (
            options ?
                <div>
                    <Menu
                        {...props}
                        dropdownWidth={dropdownWidth}
                        visible={popupVisible}
                        activeValue={activeValue}
                        onSelect={this._handleMenuSelect} />
                </div> : null
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
        activeValue = [targetOption.value]
        let activeOptions = this._getActiveOptions(activeValue);
        const newState = {};
        this._handleChange(activeOptions, { visible: false }, e);
        newState.value = activeValue;

        newState.activeValue = activeValue;
        //  not change the value by keyboard
        if ('value' in this.props ||
            (e.type === 'keydown' && e.keyCode !== KeyCode.ENTER)) {
            delete newState.value;
        }
        // console.log('_handleMenuSelect', newState)
        this.setState(newState);
    }

    _getActiveOptions = (activeValue) => {
        // let data = arrayTreeFilter(this.props.options, (o, level) => o.value === activeValue[level]);
        // console.log('_getActiveOptions', data)
        let { options } = this.props
        // console.log('_getActiveOptions', options)
        for (let optionOrOptionGroup of options) {
            //optionGroup的情况
            if (optionOrOptionGroup.type === 'optionGroup') {
                for (let option of optionOrOptionGroup.children) {
                    if (option.value === activeValue[0]) {
                        return option
                    }
                }
            }

            //option的情况
            if (optionOrOptionGroup.value === activeValue[0]) {
                return optionOrOptionGroup
            }
        }
    }

    _handleChange = (option, setProps, e) => {
        if (e.type !== 'keydown' || e.keyCode === KeyCode.ENTER) {
            const { onChange } = this.props
            onChange && onChange(option.value, option);
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
    defaultValue: PropTypes.string,
    /**
     * [value description]
     * @type {[array],[string]}
     * 指定选中项
     */
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
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
