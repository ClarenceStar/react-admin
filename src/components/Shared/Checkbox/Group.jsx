import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ShallowEqual from 'shallowequal';
import './index.styl';
import CheckboxRadio from './GroupCheckbox';
export default class CheckboxGroup extends React.Component {
  constructor(props) {
    super(props)
    // console.log('children', props.children)
    let value
    // console.log('pros.value',props.value, typeof props.value)
    //顺序 value defaultValue children的value
    if (props.value) {
      value = props.value.split(',')
    } else if (props.defaultValue) {
      value = props.defaultValue
    } else {
      const checkedValue = this.__getCheckedValue(props.children);
      value = checkedValue && checkedValue.value;
    }
    if(!value){
      value=[]
    }
    this.state = {
      value
    }
  }

  getChildContext() {
    return {
      checkboxGroup: {
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
        value: nextProps.value.split(',')
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
  // shouldComponentUpdate(nextProps, nextState) {
  //   return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
  // }

  onRadioChange = (e) => {
    const { value } = e.target
    let lastValue = this.state.value
    // console.log('onRadioChange', value, lastValue)
    
    // const { value } = e.target
    // console.log(e.target.value)
    //优先从props拿数据
    // if (!this.props.value) {
      //如果有的就删除， 没有就添加
    if (lastValue.indexOf(value)>=0) {
      lastValue.splice(lastValue.indexOf(value), 1)
    } else {
      lastValue.push(value)
    }
    this.setState({
      value: lastValue
    })
    // console.log('onRadioChange', this.state.value)
    // }
    const onChange = this.props.onChange;
    if (onChange) {
      //这里有改动 只传递value
      onChange(lastValue);
    }
  }

  render() {
    const props = this.props
    // const q = this.state.value
    const { prefixCls = 'checkbox-group', className = '', options } = props
    const classString = classNames(prefixCls, {
      [`${prefixCls}-${props.size}`]: props.size,
    }, className)
    let children = []
    //如果有option 优先使用
    if (options && options.length > 0) {
      //先不支持option
      // children = options.map((option, index) => {
      //   if (typeof option === 'string') {
      //     return (
      //       <CheckboxRadio
      //         key={index}
      //         disabled={this.props.disabled}
      //         value={option}
      //         onChange={this.onRadioChange}
      //         checked={this.state.value === option}
      //       >
      //         {option}
      //       </CheckboxRadio>
      //     );
      //   } else { // 此处类型自动推导为 { label: string value: string }
      //     return (
      //       <CheckboxRadio
      //         key={index}
      //         disabled={option.disabled || this.props.disabled}
      //         value={option.value}
      //         onChange={this.onRadioChange}
      //         checked={this.state.value === option.value}
      //       >
      //         {option.label}
      //       </CheckboxRadio>
      //     );
      //   }
      // })
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
    let ret = []
    children.forEach(item => {
      if (item && item.props && item.props.checked) {
        value = item.props.checked;
        matched = true;
        ret.push(value)
      }
    })
    return matched ? { ret } : undefined
  }
}

CheckboxGroup.childContextTypes = {
  checkboxGroup: PropTypes.object
}