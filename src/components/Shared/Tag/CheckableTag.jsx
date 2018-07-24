import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.styl';

class CheckableTag extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render(){
        const { prefixCls = 'tag', className, checked, children } = this.props;
        const cls = classNames(prefixCls, {
            [`${prefixCls}-checkable`]: true,
            [`${prefixCls}-checkable--checked`]: checked,
        }, className);
        
        return (
            <div className={cls} onClick={this._handleClick}>
                { children }
            </div>
        );
    }

    _handleClick = () => {
        const { checked, onChange } = this.props;
        if (onChange) {
            onChange(!checked);
        }
    }
}


CheckableTag.propTypes = {
    /**
     * [prefixCls description]
     * @type {[string]}
     * 类名前缀
     */
    prefixCls: PropTypes.string, 
    /**
     * [onChange description]
     * @type {[string]}
     * 点击标签时触发的回调
     */
    onChange: PropTypes.func,  
    /**
     * [checked description]
     * @type {[bool]}
     * 设置标签的选中状态
     */
    checked: PropTypes.bool,

}

export default CheckableTag;