import React, { PureComponent, Children, cloneElement } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import assign from 'object-assign';
import classNames from 'classnames';

class Row extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render(){
        const { type, justify, align, className, gutter, style, children, prefixCls = 'JD-row' } = this.props;
        const classes = classNames({
                [prefixCls]: !type,
                [`${prefixCls}-${type}`]: type,
                [`${prefixCls}-${type}-${justify}`]: type && justify,
                [`${prefixCls}-${type}-${align}`]: type && align,
        }, className);

        const rowStyle = gutter > 0 ? assign({}, {
            marginLeft: (gutter / -2) + 'px',
            marginRight: (gutter / -2) + 'px',
        }, style) : style;

        const cols = Children.map(children, (col) => {
            if (!col) {
                return null;
            }
            if (col.props && gutter  > 0) {
                const colStyle =  assign({}, {
                    paddingLeft: (gutter / 2) + 'px' ,
                    paddingRight: (gutter / 2) + 'px',
                }, col.props.style)

                return cloneElement(col, {style: colStyle})
            }
            return col;
        });
            
        return <div className={classes} style={rowStyle}>{cols}</div>
    }
}

Row.defaultProps = {
    align: "top",
    justify: "start",
}

Row.propTypes = {
    /**
     * [gutter description]
     * @type {[number]}
     * 栅格间隔
     */
    gutter: PropTypes.number, 
    /**
     * [type description]
     * @type {[string]}
     * 布局模式，可选 flex
     */
    type: PropTypes.string, 
    /**
     * [align description]
     * @type {[string]}
     * flex 布局下的垂直对齐方式：top middle bottom
     * 默认为top
     */
    align: PropTypes.string, 
    /**
     * [justify description]
     * @type {[string]}
     * flex 布局下的水平排列方式：start end center space-around space-between
     * 默认为start
     */
    justify: PropTypes.string,
}

export default Row;