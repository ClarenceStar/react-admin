import React from 'react';
import PropTypes from 'prop-types';

class ALink extends React.PureComponent {
    render() {
        const {
            className,
            onClick,
        } = this.props;

        return (
            <a 
                className={className}
                onClick={onClick}
                target={this._getMode()}
                href={this._getHref()}>
                {this.props.children}
            </a>
        )
    }

    _getMode() {
        const { mode } = this.props;

        switch(mode) {
            case 'self':
                return '_self';
            case 'blank':
                return '_blank';
            case 'parent':
                return '_parent';
            case 'top':
                return '_top';
            default:
                return mode;
        }
    }

    _getHref() {
        const { to } = this.props;

        if(typeof to === 'string') {
            return to;
        } else if(typeof to === 'function') {
            return to();
        } else if(typeof to === 'object') {
            const { query, pathname, host } = to;
            let url;

            if(host) url = location.protocol+'//'+host;
            url += pathname;
            return this._appendQuery(url, query);
        }
    }

    _appendQuery(url, query) {
        let queryArr = [];

        for(const key in query) {
            queryArr.push(`${key}=${query[key]}`);
        }

        if(queryArr.length > 0) {
            if(url.indexOf('?') > -1) return url+queryArr.join('&');
            else return url+'?'+queryArr.join('&');
        } else {
            return url;
        } 
    }
}

ALink.defaultProps = {
    mode: 'blank',
    onClick: ()=>{},
    to: '#'
}

ALink.propTypes = {
    className: PropTypes.string,
    to: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    onClick: PropTypes.func,
    mode: PropTypes.string
}

export default ALink;
