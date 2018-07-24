import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'Shared/Tooltip';
import { cloneElement } from 'react';
import arrayTreeFilter from 'array-tree-filter';
import Button from 'Shared/Button';
import Icon from 'Shared/Icon';
import Trigger from './trigger';
import './index.styl';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
};

class Cascader extends React.PureComponent {

    constructor(props) {
        super(props);
        this.cachedOptions = [];
        this.state = {
            value: props.value || props.defaultValue || [],
            inputValue: '',
            popupVisible: false,
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            value: nextProps.value || nextProps.defaultValue || []
        });

    }

    render() {
        const props = this.props;
        let { children, options, placement } = props;
        const newChildProps = {};
        newChildProps.onClick = this._showCascader;

        const input = children
                       ? cloneElement(children, newChildProps)
                       : this._getInput();

        // Dropdown menu should keep previous status until it is fully closed.
        if (!this.state.popupVisible) {
            options = this.cachedOptions;
        } else {
            this.cachedOptions = options;
        }
        return (
            <Trigger
                {...props}
                options={options}
                placement={placement}
                popupVisible={this.state.popupVisible}
                value={this.state.value}
                onChange={this._handleChange}
                onClick={this._onTooltipClose}
                >
                { input }
            </Trigger>
        );
    }

    _getInput = () => {
        const { placeholder } = this.props;
        const { value, popupVisible, inputValue } = this.state;

        const clearIcon = ( value.length > 0) || inputValue ? (
            <Icon
                name="close"
                className="cascader-picker--clear"
                onClick={this._clearSelection}
            />
            ) : null;

        const label = this._getLabel();
        const input = (
            <span className="cascader-picker"  style={this.props.style}>
                <span className="cascader-picker__label">
                    { label }
                </span>
                <input
                    type="text"
                    readOnly={true}
                    className="cascader-picker__input"
                    autoComplete="off"
                    placeholder={ value.length === 0 || !label ? placeholder : ""}
                    onClick={this._onIputClick} />

                { clearIcon }

                <Icon
                    name={ popupVisible ? "chevron-up" : "chevron-down"}
                    className="cascader-picker--arrow" />
            </span>
        )

        return input;
    }

    _handleChange = (value, selectedOptions) => {
        this.setState({ inputValue: '' });

        this._setValue(value, selectedOptions);
    }

    _setValue = (value, selectedOptions = []) => {
        if (!('value' in this.props)) {
            this.setState({ value });
        }
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value, selectedOptions);
        }
    }

    _getLabel = () => {
        const { options } = this.props;
        const value = this.state.value;
        const unwrappedValue = Array.isArray(value[0]) ? value[0] : value;
        const selectedOptions = arrayTreeFilter(options, (o, level) => o.value == unwrappedValue[level]);
        const label = selectedOptions.map(o => o.label);
        return label.join(' / ');
    }

    _onIputClick = () => {
        const prePopupVisible = this.state.popupVisible;
        this.setState({
            popupVisible: !prePopupVisible
        })
    }

    _onTooltipClose = () => {
        this.setState({
            popupVisible: false
        })
    }

    _clearSelection = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { defaultValue } = this.props;

        if (!this.state.inputValue) {
            const value = defaultValue? defaultValue: []
            this._setValue(defaultValue);
            this.setState({ popupVisible: false });
        } else {
            this.setState({ inputValue: '' });
        }
    }
}

Cascader.defaultProps = {
    builtinPlacements: BUILT_IN_PLACEMENTS,
    placement: 'bottomLeft',
}

Cascader.propTypes = {
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
     * [onChange description]
     * @type {[function]}
     * 选择完成后的回调
     */
    onChange: PropTypes.func,
    /**
     * [style description]
     * @type {[object]}
     * 输入框样式
     */
    style: PropTypes.object,
    /**
     * [menuStyle description]
     * @type {[object]}
     * 级联框菜单样式
     */
    menuStyle: PropTypes.object,
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
     * [placeholder description]
     * @type {[string]}
     * 输入框自定义placeholder
     */
    placeholder: PropTypes.string,
    /**
     * [getContainer description]
     * @type {[function]}
     * 浮层渲染父节点，默认渲染到 body 上
     */
    getContainer: PropTypes.func,
};

export default Cascader;
