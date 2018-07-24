import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import cx from 'classnames';

const DropSource = {
    drop(props, monitor) {
        const item = monitor.getItem();
        return {
            floorType: item.floorType,
            order: props.order,
            sourceType: item.sourceType,
            targetType: props.targetType,
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        drop: monitor.getItem()
    };
}

@DropTarget('TransferItem', DropSource, collect)
class DropFloor extends React.PureComponent {
    render() {
        const { order, connectDropTarget, isOver, drop, targetType } = this.props;
        let isValid = true;
        if (drop) {
            const sourceType = drop.sourceType;
            const sourceOrder = drop.order;
            const targetOrder = order;

            const isValidDropTarget = drop.onDropValidate;
            if (isValidDropTarget){
                isValid = isValidDropTarget({
                            sourceOrder, 
                            targetOrder, 
                            sourceType, 
                            targetType});
            }  
        }

        const cls = {
            'transfer__drop-floor': true,
            'transfer__drop-floor--active': isOver && isValid
        };

        return connectDropTarget(
            <div className={cx(cls)}/>
        );
    }
}

DropFloor.propTypes = {
    order: PropTypes.number.isRequired
};

export default DropFloor;
