import React from 'react';
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.styl'
import Checkbox from './Checkbox'
import shallowEqual from 'shallowequal';
export default class Radio extends React.Component {
  constructor(props) {
    super(props)
  }
  //要通过context进行update
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !shallowEqual(this.props, nextProps) ||
           !shallowEqual(this.state, nextState) ||
           !shallowEqual(this.context.radioGroup, nextContext.radioGroup);
  }

  render() {
    const { props, context } = this
    // console.log('radiovalue', props.value)
    const {
      prefixCls='checkbox',
      className,
      style,
      ...restProps,
    } = props
    let radioProps = { ...restProps }
    const { radioGroup } = context;
    // console.log('radioGroup.value',props.value, radioGroup.value)
    // console.log('radioGroup', radioGroup)
    // console.log('context', context)
    //有group的情况
    if(radioGroup){
      radioProps.name = radioGroup.name;
      radioProps.onChange = radioGroup.onChange;
      radioProps.checked = props.value == radioGroup.value;
      radioProps.disabled = props.disabled || radioGroup.disabled;
    }

    return (

        <Checkbox
          {...radioProps}
        />

    )
  }
}
Radio.contextTypes = {
  radioGroup: PropTypes.object
}