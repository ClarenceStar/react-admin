import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'Shared/Tooltip'
import { cloneElement } from 'react'
import arrayTreeFilter from 'array-tree-filter'
import Button from 'Shared/Button'
import Icon from 'Shared/Icon'
import Trigger from './trigger'
import './index.styl'
import classnames from 'classnames'
const BUILT_IN_PLACEMENTS = {
    bottomLeft: {
        points: ['tl', 'bl'],
        offset: [0, 4],
        overflow: {
            adjustX: 1,
            adjustY: 1
        }
    },
    topLeft: {
        points: ['bl', 'tl'],
        offset: [0, -4],
        overflow: {
            adjustX: 1,
            adjustY: 1
        }
    },
    bottomRight: {
        points: ['tr', 'br'],
        offset: [0, 4],
        overflow: {
            adjustX: 1,
            adjustY: 1
        }
    },
    topRight: {
        points: ['br', 'tr'],
        offset: [0, -4],
        overflow: {
            adjustX: 1,
            adjustY: 1
        }
    }
}

class Select extends React.PureComponent {
    constructor(props) {
        super(props)
        this.cachedOptions = []
        // this._originOptions = props.options
        let options = this._renderOptions(props.children)

        this._originOptions = options
        let label
        // console.log('Select', props.defaultValue)
        if (props.value) {
            label = this._findLabelByValue(props.value)
        }
        if (props.defaultValue) {
            label = this._findLabelByValue(props.defaultValue)
        }
        this.state = {
            value: props.value || props.defaultValue,
            inputValue: '',
            popupVisible: false,
            currentOptions: options,
            label: label || ''
        }
    }

    componentWillReceiveProps(nextProps) {
        let label = this._findLabelByValue(nextProps.value)
        if (nextProps.defaultValue) {
            label = this._findLabelByValue(nextProps.defaultValue)
        }
        let options = this._renderOptions(nextProps.children)
        this._originOptions = options
        this.setState({
            value: nextProps.value || nextProps.defaultValue || [],
            label,
            currentOptions: options
        })
    }

    render() {
        const props = this.props
        let { children, options, placement } = props
        const { currentOptions } = this.state
        const newChildProps = {}
        newChildProps.onClick = this._showCascader
        const input = this._getInput()
        return (
            <Trigger
                {...props}
                options={currentOptions}
                placement={placement}
                popupVisible={this.state.popupVisible}
                value={this.state.value}
                onChange={this._handleChange}
                onClick={this._onTooltipClose}
                onBlur={this._onInputBlur}>
                {input}
            </Trigger>
        )
    }
    _renderOptions = (children, keyword) => {
        let options = []
        React.Children.forEach(children, item => {
            if (!item) {
                return
            }
            if (item.type && item.type.isSelectOption) {
                //展示搜索框的情况
                if (keyword) {
                    if (item.props.children.indexOf(keyword) >= 0) {
                        options.push({
                            type: 'option',
                            value: item.props.value,
                            label: item.props.children,
                            disabled: item.props.disabled
                        })
                    }
                } else {
                    options.push({
                        type: 'option',
                        value: item.props.value,
                        label: item.props.children,
                        disabled: item.props.disabled
                    })
                }
            } //如果是optionGroup的情况
            else {
                let ret = {
                    type: 'optionGroup',
                    children: this._renderOptions(item.props.children, keyword),
                    label: item.props.label
                }
                if (ret.children.length > 0) {
                    options.push(ret)
                }
            }
        })
        return options

        // return options
    }
    _getInput = () => {
        const {
            defaultTitle,
            placeholder,
            showSearch,
            disabled,
            prefixCls
        } = this.props
        const { value, popupVisible, inputValue, label } = this.state
        let classString = this.props.prefixCls || 'select-picker'
        const clearIcon =
            inputValue.length > 0 ? (
                <Icon
                    name="close"
                    className={`${classString}--clear`}
                    onClick={this._clearSelection}
                />
            ) : null
        // const label = this._getLabel();
        let wrapperClassString = classnames({
            [`${classString}-lg`]: this.props.size === 'large',
            [`${classString}-small`]: this.props.size === 'small',
            [`${classString}`]: true,
            ['select--disabled']: this.props.disabled
        })

        let inputClassString = classnames({
            [`${classString}-lg__input`]: this.props.size === 'large',
            [`${classString}-small__input`]: this.props.size === 'small',
            [`${classString}__input--disabled`]: this.props.disabled,
            [`${classString}__input`]: true
        })
        let labelClassString = classnames({
            [`${classString}__label--disabled`]: this.props.disabled,
            [`${classString}__label`]: true
        })
        const input = (
            <div className={wrapperClassString} style={this.props.style}>
                <div
                    className={`${classString}__label`}
                    ref={saveRef(this, '_label')}>
                    {label || defaultTitle}
                </div>
                <input
                    ref={saveRef(this, '_input')}
                    type="text"
                    readOnly={!showSearch}
                    className={inputClassString}
                    autoComplete="off"
                    disabled={disabled}
                    placeholder={
                        (value && value.length === 0) || !label
                            ? placeholder
                            : ''
                    }
                    onClick={this._onIputClick}
                    onChange={this._onInputChange}
                    onBlur={this._onInputBlur}
                />

                {clearIcon}

                <Icon
                    name={popupVisible ? 'chevron-up' : 'chevron-down'}
                    className="select-picker--arrow"
                    onClick={this._onIputClick}
                />
            </div>
        )

        return input
    }
    _onInputBlur = () => {
        if (this._input.value === '') {
            this.setState({
                currentOptions: this._originOptions
            })
        }

        this._input.value = ''
        this._label.style.opacity = 1
        this._label.style.display = 'block'
    }
    _handleChange = (value, selectedOption) => {
        this.setState({ inputValue: '' })
        if (this._input) {
            this._input.value = ''
        }
        this._label.style.opacity = 1
        this._setValue(value, selectedOption)
    }

    _setValue = (value, selectedOption = []) => {
        const onChange = this.props.onChange
        let originValue = this.props.value || this.state.value
        // if(typeof originValue === 'number'){
        //     originValue = originValue.toString()
        // }
        // if (!(typeof originValue === 'string')&&!(typeof originValue === 'number')) {
        //     originValue = originValue[0]
        // }
        if (value !== originValue) {
            //如果有绑定value则不需要在这里改
            if (this.props.value && this.props.value.toString()) {
                // if (value.length === 1) {
                //     value = value[0].toString()
                // }
                onChange && onChange(value, selectedOption)
            } else {
                if (!!value) {
                    if (!('value' in this.props)) {
                        this.setState({ value, label: selectedOption.label })
                    }
                    if (onChange) {
                        //如果只有一个选项 则返回字符串
                        if (value.length === 1) {
                            value = value[0].toString()
                        }
                        onChange(value, selectedOption)
                    }
                } else {
                    //清空的情况
                    this.setState({ value: '', label: '' })
                }
            }
        }
    }

    _getLabel = () => {
        const { options } = this.props
        const value = this.state.value
        return value[0]
    }

    _onInputChange = e => {
        const { value } = e.target
        if (value.length > 0) {
            this._label.style.display = 'none'
            let options = this._renderOptions(
                this.props.children,
                e.target.value
            )
            this.setState({
                currentOptions: options
            })
        } else {
            this._label.style.display = 'block'
            let options = this._renderOptions(this.props.children)
            this.setState({
                currentOptions: options
            })
        }
    }

    _onIputClick = e => {
        e.target.focus()
        e.stopPropagation()
        const prePopupVisible = this.state.popupVisible
        this.setState({
            popupVisible: !prePopupVisible,
            currentOptions: this._originOptions
        })
        if (this.props.showSearch) {
            this._label.style.opacity = 0.4
        }
    }

    _onTooltipClose = () => {
        this.setState({
            popupVisible: false
        })
    }

    _clearSelection = e => {
        e.preventDefault()
        e.stopPropagation()

        const { defaultValue } = this.props

        if (!this.state.inputValue) {
            const value = defaultValue ? defaultValue : []
            this._setValue(defaultValue)
            this.setState({ popupVisible: false })
        } else {
            this.setState({ inputValue: '' })
        }
    }

    _findLabelByValue = value => {
        // console.log('_findLabelByValue', value)
        let options = this._originOptions
        for (let item of options) {
            if (item.type === 'optionGroup') {
                for (let option of item.children) {
                    if (option.value === value) {
                        return options.label
                    }
                }
            } else {
                if (item.value == value) {
                    return item.label
                }
            }
        }
    }
}

Select.defaultProps = {
    builtinPlacements: BUILT_IN_PLACEMENTS,
    placement: 'bottomLeft'
}

Select.propTypes = {
    /**
     * [defaultValue description]
     * @type {[array]}
     * 默认选中项
     */
    defaultValue: PropTypes.string,
    /**
     * [defaultTitle description]
     * @type {[string]}
     * 默认主标题，可使用此参数作为下拉框选项的标题
     */
    defaultTitle: PropTypes.string,
    /**
     * [value description]
     * @type {[string,number]}
     * 指定选中项
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * [onChange description]
     * @type {[function]}
     * 选择完成后的回调
     *
     */
    onChange: PropTypes.func,
    /**
     * [size description]
     * @type {[string]}
     * 输入框大小 small large
     */
    size: PropTypes.string,
    /**
     * [disabled description]
     * @type {[bool]}
     * 选择框是否禁用
     */
    disabled: PropTypes.bool,
    /**
     * [showSearch description]
     * @type {[bool]}
     * 是否开启搜索功能
     */
    showSearch: PropTypes.bool,
    /**
     * [placeholder description]
     * @type {[string]}
     * 输入框自定义placeholder
     */
    placeholder: PropTypes.string
}

export default Select
function saveRef(instance, name) {
    return node => {
        instance[name] = node
    }
}
