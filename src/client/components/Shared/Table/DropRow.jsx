import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import cx from 'classnames';

const DropSource = {
    drop(props, moitor) {
        return {
            order: props.order
        }
    }
}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        dragRow: monitor.getItem()
    }
}

@DropTarget('TableRow', DropSource, collect)
class DropRow extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            prefix: props.prefixCls || 'group-table'
        }
    }

    render() {
        const { 
            connectDropTarget
        } = this.props;

        return connectDropTarget(this._renderRow());
    }

    _renderRow() {
        const { 
            order,
            isOver,
            dragRow,
            columns
        } = this.props;
        const { prefix } = this.state;

        let isDropRowAroundDragRow = false;

        if(dragRow) {
            const diff = order - dragRow.order;

            isDropRowAroundDragRow = diff === 0 || diff === 1;
        }

        const cls = cx({
            [`${prefix}__drop-tr`]: true,
            // [`${prefix}__drop-tr--dragging`]: canDrop && !isDropRowAroundDragRow,
            [`${prefix}__drop-tr--active`]: isOver && !isDropRowAroundDragRow
        });

        return (
            <tr className={cls}>
                {
                    columns.map((item,index) => {
                        return (
                            <td key={index}></td>
                        )
                    })
                }
            </tr>
        )
    }
}

DropRow.propTypes = {
    order: PropTypes.number.isRequired,
    prefixCls: PropTypes.string,
    columns: PropTypes.array.isRequired 
}

export default DropRow;