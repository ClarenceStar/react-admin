import React from 'react';
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.styl'
import Checkbox from './index'
import shallowEqual from 'shallowequal';
export default class GroupCheckbox extends React.Component {
  constructor(props) {
    super(props)
  }
  // //要通过context进行update
  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   return !shallowEqual(this.props, nextProps) ||
  //          !shallowEqual(this.state, nextState) ||
  //          !shallowEqual(this.context.checkboxGroup, nextContext.checkboxGroup);
  // }

  render() {
    const { props, context } = this
    const {
      prefixCls='checkbox',
      style,
      ...restProps,
    } = props
    let radioProps = { ...restProps }
    const { checkboxGroup } = context;
    //有group的情况
    // console.log('check',checkboxGroup.value)
    if(checkboxGroup){
      radioProps.name = checkboxGroup.name;
      radioProps.onChange = checkboxGroup.onChange;
      radioProps.checked = checkboxGroup.value?checkboxGroup.value.indexOf(props.value)>=0:false;
      radioProps.disabled = props.disabled || checkboxGroup.disabled;
    }

    return (

        <Checkbox
          {...radioProps}
        />

    )
  }
}
GroupCheckbox.contextTypes = {
  checkboxGroup: PropTypes.object
}