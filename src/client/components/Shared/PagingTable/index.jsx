import './index.styl';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Table from 'Shared/Table';
import Pagination from 'Shared/Pagination';

class PagingTable extends React.PureComponent {
    render() {
        const props = this.props;
        const {columns, dataSource, rowKey, prefixCls, hideHead, tableClassName, onCellClick} = props;

        return (
            <div className="pagingtable">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey={rowKey}
                    prefixCls={prefixCls}
                    hideHead={hideHead}
                    tableClassName={tableClassName}
                    onCellClick={onCellClick} >
                </Table>
                <Pagination
                    pageSize={props.pageSize}
                    totalPage={props.totalPage}
                    currentPage={props.currentPage}
                    showTotal={true}
                    onChange={props.onPageChange} />
            </div>
        )
    }
}

PagingTable.propTypes = {
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
     * [dataSource description]
     * @type {[array]}
     * 表格数据
     */
    dataSource: PropTypes.arrayOf(PropTypes.object),
    /**
     * [columns description]
     * @type {[array]}
     * 列数据
     *      @param {String} key
     *      @param {String} dataIndex
     *      @param {String} title
     *      @param {Function} render组件方法
     */
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        dataIndex: PropTypes.string,
        title: PropTypes.string,
        render: PropTypes.func
    })),
    /**
     * [rowKey description]
     * @type {[string]}
     * 每行的key
     */
    rowKey: PropTypes.string,
    /**
     * [hideHead description]
     * @type {[bool]}
     * 是否隐藏表头
     */
    hideHead: PropTypes.bool,
    /**
     * [headClassName description]
     * @type {[string]}
     * 表格的className
     */
    tableClassName: PropTypes.string,
    /**
     * [prefixCls description]
     * @type {[string]}
     */
    prefixCls: PropTypes.string,
    /**
    * [onCellClick 单元格点击回调]
    * @type {[function]}
    */
    onCellClick: PropTypes.func,
    /**
     * [onPageClick 页码点击回调]
     * @type {[function]}
     */
    onPageChange: PropTypes.func
}

export default PagingTable;
