import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import assign from 'object-assign';
import classNames from 'classnames';

class Col extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render(){
        const props = this.props;
        const { span, order, offset, push, pull, className, children, prefixCls = 'JD-col', style } = props;
        let sizeClassObj = {};

        ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
            let sizeProps = {};
            if (typeof props[size] === 'number') {
                sizeProps.span = props[size];
            } else if (typeof props[size] === 'object') {
                sizeProps = props[size] || {};
            }

            sizeClassObj = assign({}, sizeClassObj, {
                [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
                [`${prefixCls}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0,
                [`${prefixCls}-${size}-offset-${sizeProps.offset}`]: sizeProps.offset || sizeProps.offset === 0,
                [`${prefixCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
                [`${prefixCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0,
            });
        });

        const classes = classNames({
            [`${prefixCls}-${span}`]: span !== undefined,
            [`${prefixCls}-order-${order}`]: order,
            [`${prefixCls}-offset-${offset}`]: offset,
            [`${prefixCls}-push-${push}`]: push,
            [`${prefixCls}-pull-${pull}`]: pull,
        }, className, sizeClassObj);
       
        return <div style={style} className={classes}>{children}</div>;
    }
}

Col.defaultProps = {
    order: 0,
    offset: 0,
    push: 0,
    pull: 0,
}

Col.propTypes = {
    /**
     * [span description]
     * @type {[number]}
     * 栅格占位格数，为 0 时相当于 display: none
     */
    span: PropTypes.number, 
    /**
     * [number description]
     * @type {[bool]}
     * 栅格顺序，flex 布局模式下有效
     */
    order: PropTypes.number, 
    /**
     * [offset description]
     * @type {[number]}
     * 栅格左侧的间隔格数，间隔内不可以有栅格
     */
    offset: PropTypes.number, 
    /**
     * [push description]
     * @type {[number]}
     * 栅格向右移动格数
     */
    push: PropTypes.number,
    /**
     * [pull description]
     * @type {[number]}
     * 栅格向右移动格数
     */
    pull: PropTypes.number,
    /**
     * [xs description]
     * @type {[number, object]}
     * <768px 响应式栅格，可为栅格数或一个包含其他属性的对象
     */
    xs: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /**
     * [sm description]
     * @type {[number, object]}
     * ≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象
     */
    sm: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /**
     * [md description]
     * @type {[number, object]}
     * ≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象
     */
    md: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /**
     * [lg description]
     * @type {[number, object]}
     * ≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象
     */
    lg: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /**
     * [xl description]
     * @type {[number, object]}
     * ≥1600px 响应式栅格，可为栅格数或一个包含其他属性的对象
     */
    xl: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),

}

export default Col;