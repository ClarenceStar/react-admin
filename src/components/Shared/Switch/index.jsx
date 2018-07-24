import './index.styl';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class Switch extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            on: props.on
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('on')) {
            this.setState({ on: nextProps.on });
        }
    }

    render() {
        const classNames = cx('switch', {
            'switch--on': this.state.on
        });

        return (
            <div
                className={classNames}
                onClick={this._onChange.bind(this)} />
        );
    }

    _onChange() {
        const { onChange } = this.props;
        const val = !this.state.on;

        this.setState({ on: val });

        if (onChange) onChange(val);
    }
}

Switch.defaultProps = {
    on: false
};

Switch.propTypes = {
    on: PropTypes.bool,
    onChange: PropTypes.func
};

export default Switch;
