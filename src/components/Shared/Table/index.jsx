import './index.styl';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import TableRow from './TableRow';
import DropRow from './DropRow';

class Table extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cls: props.prefixCls || 'group-table'
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.prefixCls) {
            this.setState({
                cls: nextProps.prefixCls
            });
        }
    }

    render() {
        const { cls } = this.state;
        const { tableClassName } = this.props;
        const headClass = `${cls} ${tableClassName}`;

        return (
            <div className={headClass}>
                <table className={`${cls}__table`}>
                    { this._renderHead() }
                    { this._renderBody() }
                </table>
            </div>
        )
    }

    _renderHead() {
        const { cls } = this.state;
        const { columns, hideHead } = this.props;
        if (hideHead) return null;
        return (
            <thead className={`${cls}__head`}>
                <tr>
                    {
                        columns.map(col => {
                            return (
                                <th key={col.key}>
                                    {col.title}
                                </th>
                            )
                        })
                    }
                </tr>
            </thead>
        )
    }

    _renderBody() {
        const { cls } = this.state;
        const { columns, dataSource, rowKey, onCellClick, onHighlight, onDrag } = this.props;
        const dataSourceCount = dataSource.length;

        const rows = [];

        dataSource.forEach((data, index) => {
            let key = rowKey ? data[rowKey] : data.key;
            if (!key) {
                key = index;
            }
            const highlight = onHighlight && onHighlight(data, index) || false;
            
            rows.push(
                (
                    <DropRow 
                        key={'drop'+index}
                        order={index+1}
                        prefixCls={cls}
                        columns={columns} />
                )
            );

            rows.push(
                (
                    <TableRow
                        key={key}
                        prefixCls={cls}
                        rowIndex={index}
                        columns={columns}
                        rowData={data}
                        onCellClick={onCellClick}
                        highlight={highlight}
                        onDrag={onDrag} />
                )
            );
        })

        if(dataSourceCount > 0 ){
            rows.push(
                (
                    <DropRow 
                        key={'drop'+dataSourceCount}
                        order={dataSourceCount+1}
                        prefixCls={cls}
                        columns={columns} />
                )
            );
        }

        return (
            <tbody className={`${cls}__body`}>
                { rows }
            </tbody>
        )
    }
}

Table.defaultProps = {
    dataSource: [],
    columns: [],
    hideHead: false,
    tableClassName: '',
    prefixCls: '',
    onCellClick: (rowIndex, colIndex) => {
    }
}

Table.propTypes = {
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
     * [onCellClick description]
     * @type {[function]}
     */
    onCellClick: PropTypes.func,
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
     * [onHighlight 判断行是否高亮]
     * @type {[function]}
     */
    onHighlight: PropTypes.func,
    /**
     * [onDrag 拖放回调函数]
     * @type {[function]}
     */
    onDrag: PropTypes.func
};

export default Table;
