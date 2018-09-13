import './index.styl';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Pager from './Pager';

function defaulePageRender(number) {
    return <a className="pagination__number">{number}</a>;
}

function pointsRender() {
    return (<a className="pagination__points">···</a>);
}

class Pagination extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: props.currentPage,
            pageSize: props.pageSize
        };

        this.handleChange = this._handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if ('currentPage' in nextProps) {
            this.setState({
                currentPage: nextProps.currentPage
            });
        }
        if ('pageSize' in nextProps) {
            this.setState({
                pageSize: nextProps.pageSize
            });
        }
    }

    render() {
        const { pageSize, totalPage, className, onChange, style, pagerRender } = this.props;
        const { currentPage } = this.state;
        const hasPrev = currentPage > 1;
        const hasNext = currentPage < totalPage;

        let cls = {
            "pagination": true
        };
        let pagerList =[];

        cls[className] = !!className;

        if (totalPage <= 7) {
            for (let i = 1; i <= totalPage; i++) {
                const active = currentPage === i;
                pagerList.push(
                    <Pager
                        key={i}
                        page={i}
                        active={active}
                        render={pagerRender}
                        onClick={this.handleChange} />
                );
            }
        } else {
            // 包括当前页左右各2个
            let left = Math.max(1, currentPage);
            let right = currentPage + 2;

            for (let i = left-2; i <= currentPage; i++) {
                if (i > 0) {
                    const active = currentPage === i;
                    if (i<=totalPage) {
                        pagerList.push(
                            <Pager
                                key={i}
                                page={i}
                                active={active}
                                render={pagerRender}
                                onClick={this.handleChange} />
                        );
                    };
                };
            };
            const len = pagerList.length;
            for (let i = currentPage; i<right; i++) {
                if (i < totalPage) {
                    pagerList.push(
                        <Pager
                            key={i+1}
                            page={i+1}
                            active={false}
                            render={pagerRender}
                            onClick={this.handleChange} />
                    );
                }
            };
            // 前后的···
            if (currentPage-3>1) {
                pagerList.unshift(
                    <Pager
                        key={`left`}
                        active={false}
                        render={pointsRender}
                        onClick={this.handleChange} />
                );
            };
            if (currentPage+3<totalPage) {
                pagerList.push(
                    <Pager
                        key={`right`}
                        active={false}
                        render={pointsRender}
                        onClick={this.handleChange} />
                );
            };
            // 第一页
            if (currentPage-2>1) {
                pagerList.unshift(
                    <Pager
                        key={1}
                        page={1}
                        active={false}
                        render={pagerRender}
                        onClick={this.handleChange} />
                )
            };
            // 最后一页
            if (currentPage+2<totalPage) {
                pagerList.push(
                    <Pager
                        key={totalPage}
                        page={totalPage}
                        active={false}
                        render={pagerRender}
                        onClick={this.handleChange} />
                )
            };
        }

        return (
            <div
                className={cx(cls)}
                style={style}>
                <ul className="pagination__list">
                    { pagerList }
                    { this._renderTotalPageNum() }
                </ul>
            </div>
        );
    }

    _renderTotalPageNum() {
        const { showTotal, totalPage } = this.props;
        if (showTotal) {
            return (
                <li>
                    <span className="pagination__total">{`共${totalPage}页`}</span>
                </li>
            )
        } else {
            return null;
        }
    }

    _handleChange(page) {
        const { onChange } = this.props;
        const { currentPage } = this.state;
        if (page === currentPage) return;
        onChange && onChange(page);
    }
};

Pagination.defaultProps = {
    style: {},
    showTotal: false,
    totalPage: 0,
    pageSize: 1,
    currentPage: 1,
    pagerRender: defaulePageRender
};

Pagination.propTypes = {
    /**
     * [pageSize 每页多少数据]
     * @type {[number]}
     */
    pageSize: PropTypes.number,
    /**
     * [currentPage 当前页码]
     * @type {[number]}
     */
    currentPage: PropTypes.number,
    /**
     * [totalPage 总归几页]
     * @type {[number]}
     */
    totalPage: PropTypes.number,
    /**
     * [showTotal 是否显示总数]
     * @type {[bool]}
     */
    showTotal: PropTypes.bool,
    /**
     * [className 样式]
     * @type {[string]}
     */
    className: PropTypes.string,
    /**
     * [style 样式]
     * @type {[object]}
     */
    style: PropTypes.object,
    /**
     * [onChange 页码点击回调]
     * @type {[function]}
     */
    onChange: PropTypes.func,
    /**
     * [pagerRender pager render函数]
     * @type {[function]}
     */
    pagerRender: PropTypes.func
};

export default Pagination;
