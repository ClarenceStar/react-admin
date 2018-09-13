import './index.styl';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class Icon extends React.PureComponent {
    render() {
        const baseName = 'fa';
        const { name, className, onClick } = this.props;
        const classNames = cx(baseName, {
            [`${baseName}-${name}`]: name
        }, className);

        return <i 
            {...this.props} 
            className={classNames} />
    }
}

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ])
};

export default Icon;
