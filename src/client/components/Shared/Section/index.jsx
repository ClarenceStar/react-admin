import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { default as SectionHeader } from './Section.Header';
import { OPERATION } from 'constants/text';

class Section extends React.PureComponent {
    constructor(props) {
        super(props);  
    }

    render() {
        const { 
            prefixCls,
            label, 
            name,
            description, 
            switchValue, 
            showSwitch, 
            className,
            children,
            renderHeader, 
            onChange,
        } = this.props;

        const cls = cx(`${prefixCls}-section`, className);
        return (
            <div className={cls}>
                {
                    renderHeader && showSwitch
                    ? typeof renderHeader === 'function' 
                        ? renderHeader(label, description, name, switchValue) : renderHeader
                    : label 
                        ? <SectionHeader
                            prefixCls={prefixCls}
                            label={label}
                            description={description}
                            switchValue={switchValue}
                            showSwitch={showSwitch}
                            onSwitchChange={onChange}
                            />
                        : null
                }
                { children  }
            </div>
        )
    }
}

Section.defaultProps = {
    prefixCls: 'prop',
}

Section.propTypes = {
    /**
     * [prefixCls description]
     * @type {[string]}
     * class前缀
     */
    prefixCls: PropTypes.string,
    /**
    * [label description]
    * @type {[string]}
    * section名称
    */
    label: PropTypes.string,
    /**
    * [description description]
    * @type {[string]}
    * section描述
    */
    description: PropTypes.string,
    /**
    * [switchValue description]
    * @type {[function]}
    * 当section为dynamic时，为switch动态绑定的值，static时，为初始值
    */ 
    switchValue: PropTypes.bool,
    /**
    * [showSwitch description]
    * @type {[function]}
    * 是否显示Switch开关，dynamic默认开启
    */ 
    showSwitch: PropTypes.bool,
    /**
    * [className description]
    * @type {[string]}
    * 自定义类名
    */
    className: PropTypes.string,
    /**
    * [renderHeader description]
    * @type {[string]}
    * 自定义section header
    */
    renderHeader: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.func]),
    /**
    * [onChange description]
    * @type {[string]}
    * 开关切换回调函数
    */
    onChange: PropTypes.func,
};
export default Section;
