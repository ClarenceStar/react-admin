import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CheckableTag from './CheckableTag';
import Icon from 'Shared/Icon'
import classNames from 'classnames';
import assign from 'object-assign';
import './index.styl';

const animatedOut = "zoomOut";

class Tag extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            closing: false,
            closed: false,
        }
    }

    render(){
        const { children, color, closable, style } = this.props
        const { closing, closed } = this.state;
        const isPresetColor = this._isPresetColor(color);

        const cls = classNames("tag", {
            "animated": true,
            [`tag--${color}`]: isPresetColor,
            [`${animatedOut}`]: closing,
        });

        const tagStyle = assign({
            backgroundColor: (color && !isPresetColor) ? color : null,
        }, style);

        const tag = (
            <div 
                className={cls} 
                style={tagStyle}
                onAnimationEnd={this._animatedOut}>

                    <span className="tag__text">
                        { children }
                    </span>

                    { closable ? 
                    <Icon name="close" className="tag__close-icon" onClick={this._onClose}/>
                    : null}
            </div>
        )

        return closed ? null : tag;
    }

    _isPresetColor(color) {
        return /^(pink|red|yellow|orange|green|blue|purple)(-inverse)?$/.test(color);
    }

    _onClose = (e) => {
        const { onClose } = this.props;
        onClose && onClose(e);

        if (e.defaultPrevented) {
            return;
        }

        this.setState({
            closing: true
        })
    }

    _animatedOut = () => {
        this.setState({
            closed: true,
            closing: false
        })
    }

}

Tag.defaultProps = {

}

Tag.propTypes = {
    /**
     * [color description]
     * @type {[string]}
     * 标签色
     */
    color: PropTypes.string, 
    /**
     * [onClose description]
     * @type {[string]}
     * 关闭标签时的回调
     */
    onClose: PropTypes.func, 
    /**
     * [style description]
     * @type {[string]}
     * 标签样式
     */
    style: PropTypes.object,
    /**
     * [closable description]
     * @type {[bool]}
     * 标签是否可以关闭
     */
    closable: PropTypes.bool,

}

Tag.CheckableTag = CheckableTag;
export default Tag;