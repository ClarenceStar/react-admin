import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ShallowEqual from 'shallowequal';
import './index.styl';
import Radio from './Radio';
export default class RadioGroup extends React.PureComponent {
  constructor(props) {
    super(props)
    let value
    if (props.value) {
      value = props.value
    } else if (props.defaultValue) {
      value = props.defaultValue
    } else {
      const checkedValue = this.__getCheckedValue(props.children);
      value = checkedValue && checkedValue.value;
    }
    this.state = {
      value
    }
  }

  getChildContext(){
    return {
      radioGroup: {
        onChange: this.onRadioChange,
        value: this.state.value,
        disabled: this.props.disabled,
        name: this.props.name
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        value: nextProps.value
      })
    } else {
      const checkedValue = this.__getCheckedValue(nextProps.children);
      if (checkedValue) {
        this.setState({
          value: checkedValue.value,
        })
      }
    }
  }

  onRadioChange = (value) => {
    const lastValue = this.state.value
    //优先从props拿数据
    if (!this.props.value) {
      this.setState({
        value
      })
    }
    const onChange = this.props.onChange;
    if (onChange && value !== lastValue) {
      //这里有改动 只传递value
      onChange(value);
    }
  }

  render() {
    const props = this.props
    const { prefixCls = 'radio-group', className = '', options } = props
    const classString = classNames(prefixCls, {
      [`${prefixCls}-${props.size}`]: props.size,
    }, className)
    let children = []
    //如果有option 优先使用
    if (options && options.length > 0) {
      children = options.map((option, index) => {
        if(typeof option === 'string'){
          return (
            <Radio
              key={index}
              disabled={this.props.disabled}
              value={option}
              onChange={this.onRadioChange}
              checked={this.state.value === option}
            >
              {option}
            </Radio>
          );
        } else { // 此处类型自动推导为 { label: string value: string }
        return (
          <Radio
            key={index}
            disabled={option.disabled || this.props.disabled}
            value={option.value}
            onChange={this.onRadioChange}
            checked={this.state.value === option.value}
          >
            {option.label}
          </Radio>
        );
        }
      })
    } else { //没有options的情况
      children = props.children
    }

    return (
      <div
        className={classString}
        style={props.style}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        id={props.id}
      >
        {children}
      </div>
    )
  }

  __getCheckedValue = (children) => {
    let value = null;
    let matched = false;
    children.forEach(item => {
      if (item && item.props && item.props.checked) {
        value = item.props.checked;
        matched = true;
      }
    })
    return matched ? { value } : undefined
  }
}

RadioGroup.childContextTypes = {
  radioGroup: PropTypes.object
}