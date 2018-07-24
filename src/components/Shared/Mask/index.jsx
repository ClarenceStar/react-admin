import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import assign from 'object-assign';
import './index.styl';

class Mask extends React.PureComponent{
    render(){
        const { className, style, onClick } = this.props;
        const cls = `mask ${className}`;
      
        return (
            <div className={cls} style={style} onClick={onClick}></div>
        )
    }
}

Mask.defaultProps = {
    className: 'default',
}

Mask.propTypes = {
    /**
    * 类名
    */
    className: PropTypes.string,  
    /**
    * 样式
    */
    style: PropTypes.object
}

export default Mask;