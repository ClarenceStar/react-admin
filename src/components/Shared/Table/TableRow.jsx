import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { DragSource } from 'react-dnd';

const RowSource = {
    beginDrag(props, monitor, component) {
        return {
            type: 'table-row',
            order: props.rowIndex+1
        }
    },
    endDrag(props, monitor,component) {
        if(!monitor.didDrop()) return;
        const result = monitor.getDropResult();
        props.onDrag && props.onDrag(props.rowIndex+1, result.order);
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

@DragSource('TableRow', RowSource, collect)
class TableRow extends React.PureComponent {
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
        const { connectDragSource, onDrag } = this.props;

        if(onDrag) {
            return connectDragSource(this._renderRow());
        } else {
            return this._renderRow();
        }
    }

    _renderRow() {
        const { cls } = this.state;
        const { 
            columns,
            rowData,
            onCellClick,
            rowIndex,
            highlight,
            isDragging,
            prefixCls
        } = this.props;
        
        const trCls = cx({
            [`${cls}__tr--highlight`]: highlight,
            [`${cls}__tr--dragging`]: isDragging
        });

        return (
            <tr className={trCls}>
                {
                    columns.map((column, index) => {
                        let data = column.dataIndex ?  rowData[column.dataIndex] : '';
                        let clsName = '';
                        let isShowRptIcon = rowData[`showRptIcon`] || '0';

                        if(column.className) {
                            clsName = `${prefixCls}__td-${column.className}`;
                        }
                         
                        return (
                            <td
                                className={clsName}
                                key={column.key}
                                onClick={this._onCellClick.bind(this, rowIndex, index)} >
                                {
                                    column.render 
                                    ? column.render(rowData, rowIndex) 
                                        : <span className={cx({
                                            [`showRptIcon__td`]: isShowRptIcon === '1' && column.key === 'name' ? true : false
                                        })} title={data}>{data}</span>
                                }
                            </td>
                        )
                    })
                }
            </tr>
        )
    }

    _onCellClick(rowIndex, colIndex, e) {
        // if ( e.target === e.currentTarget) {
            const { onCellClick } = this.props;
            onCellClick && onCellClick(rowIndex, colIndex);
        // }
    }
}

TableRow.defaultProps = {

}

TableRow.propTypes = {
    /**
     * [rowIndex description]
     * @type {[Number]}
     * 该行的索引
     */
    rowIndex: PropTypes.number,
    /**
     * [columns description]
     * @type {[Array]}
     * 列数据
     *      @param {String} key
     *      @param {String} dataIndex
     *      @param {String} title
     */
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        dataIndex: PropTypes.string,
        title: PropTypes.string
    })),
    /**
     * [rowData description]
     * @type {[Object]}
     * 行数据
     */
    rowData: PropTypes.object,
    /**
     * [prefixCls description]
     * @type {[String]}
     * class的前缀
     */
    prefixCls: PropTypes.string,
    /**
     * [onCellClick description]
     * @type {[Function]}
     * onclick
     */
    onCellClick: PropTypes.func,
    /**
     * [rowData description]
     * @type {[Boolean]}
     * 是否高亮行
     */
    highlight: PropTypes.bool,
    /**
     * [onDrag 拖放回调]
     * @type {[Function]}
     */
    onDrag: PropTypes.func
}

export default TableRow;
