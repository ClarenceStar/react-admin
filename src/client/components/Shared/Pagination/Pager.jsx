import './index.styl';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Pager = (props) => {
    const { page, render } = props;

    let cls = {
        'pagination__pager': true,
        'pagination__pager--active': props.active
    };

    return (
        <li
            className={cx(cls)}
            onClick={() => {props.onClick(page)}}
        >
            {render(page)}
        </li>
    );
};


Pager.propTypes = {
    /**
     * [active 是否为焦点]
     * @type {[bool]}
     */
    active: PropTypes.bool,
    /**
     * [page 页码]
     * @type {[number]}
     */
    page: PropTypes.number,
    /**
     * [render render内容]
     * @type {[function]}
     */
    render: PropTypes.func
};

export default Pager;
