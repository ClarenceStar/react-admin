import './index.styl';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from 'Shared/Icon';

class Button extends React.PureComponent {
    render() {
        const { type, size, icon, children, style, disabled } = this.props;
        const baseName = 'button';
        const classNames = cx(baseName, {
            [`${baseName}--${type}`]: type,
            [`${baseName}--${size}`]: size,
            [`${baseName}--disabled`]: disabled,
        });

        const iconNode = icon ? <Icon name={icon} /> : null;

        return (
            <button
                style = {style}
                className={classNames}
                onClick={this._onClick}
                disabled={disabled} >
                {iconNode} {children}
            </button>
        );
    }

    _onClick = (e)  => {
        if (this.props.onClick)
            this.props.onClick(e);
    }
}

Button.propTypes = {
    type: PropTypes.oneOf(['primary']),
    size: PropTypes.oneOf(['small', 'large']),
    style: PropTypes.object,
    icon: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

export default Button;
