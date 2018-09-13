import React from 'react';
import PropTypes from 'prop-types';
import IPropTypes  from 'react-immutable-proptypes';

import Switch from 'Shared/Switch';

class PropSectionHeader extends React.PureComponent {
    render() {
        const {
            prefixCls,
            label,
            description,
            showSwitch,
            type,
            switchValue
        } = this.props;

        return (
            <div className={`${prefixCls}-section-header`}>
                <label className={`${prefixCls}-section-header__title`}>{label}</label>
                {
                    showSwitch
                        ? <Switch
                                on={switchValue}
                                onChange={this._onChange}
                            />
                        : null
                }
                {
                    description
                        ? <p className={`${prefixCls}-section-header__desc`}>{description}</p>
                        : null
                }
            </div>
        )
    }

    _onChange = (v) => {
        const {
            onSwitchChange
        } = this.props;

        onSwitchChange && onSwitchChange(v);
    }
}

PropSectionHeader.propTypes = {
    /**
     * class前缀
     */
    prefixCls: PropTypes.string,
    /**
     * section名称
     */
    label: PropTypes.string.isRequired, 
    /**
     * section描述
     */
    description: PropTypes.string,
    /**
     * 当section为dynamic时，为switch动态绑定的值，static时，为初始值
     */
    switchValue: PropTypes.bool,
    /**
     * 是否显示Switch开关，dynamic默认开启
     */
    showSwitch: PropTypes.bool,
    /**
     * switch变化的回调函数
     */
    onSwitchChange: PropTypes.func
}

export default PropSectionHeader;