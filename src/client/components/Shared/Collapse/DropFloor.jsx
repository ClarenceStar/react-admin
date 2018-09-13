import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import cx from 'classnames';

const DropSource = {
    drop(props, monitor) {
        const item = monitor.getItem();
        return {
            type: item.type,
            floorType: item.floorType,
            order: props.order
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

@DropTarget('CollapsePanel', DropSource, collect)
class DropFloor extends React.Component {
    render() {
        const { order, connectDropTarget, isOver, drop } = this.props;
        let isFloorAroundDragFloor = false;
        if (drop) {
            const orderDiff = order - drop.order;
            isFloorAroundDragFloor = (orderDiff === 1 || orderDiff === 0) && drop.floorType === 'instance' ? true : false;
        }

        const cls = {
            'collapse__drop-floor': true,
            'collapse__drop-floor--active': isOver && !isFloorAroundDragFloor
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
