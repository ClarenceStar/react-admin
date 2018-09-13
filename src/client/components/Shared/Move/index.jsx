import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './index.styl';

import {DraggableCore} from 'react-draggable';
import Icon from '../Icon';

import { throttle } from 'utils/common';

class Move extends React.PureComponent {
    constructor(props){
        super(props);

        this.state = {
            moving: false
        }
    }

    render() {
        const { 
            prefixCls,
            controllerRadius,
            moveAreaRadius
         } = this.props;
        const { moving } = this.state;
        const moveCls = cx(prefixCls, {
            [`${prefixCls}__moving`]: moving
        })

        const moveAreaSize = moveAreaRadius*2;
        const controllerSize = controllerRadius*2;

        return (
            <div 
                className={moveCls} 
                style={{
                    width:moveAreaSize,
                    height: moveAreaSize
                }}>
                <DraggableCore
                    onStart={this._onControlDragStart}
                    onDrag={this._onControlDrag}
                    onStop={this._onControlDragStop} >
                    <div 
                        className={`${prefixCls}__control`}
                        style={{
                            width: controllerSize,
                            height: controllerSize
                        }}
                        ref='controller'>
                        <Icon name='arrows' className={`${prefixCls}__control-icon`} />
                    </div>
                </DraggableCore>
            </div>
        )
    }

    _onControlDragStart = (e, data) => {
        const { bindingId, onStart } = this.props;
        const controller = this.refs.controller;
        const elm = document.getElementById(bindingId)

        controller.style.transition = '';

        document.body.style.cursor = 'pointer';

        this.moveStatus = {
            startX: data.x,
            startY: data.y,
            bindingElm: elm,
            oriTransform: elm && elm.style.transform || ''
        } 

        onStart && onStart(elm);

        this.setState({
            moving: true
        });
    }

    _onControlDrag = (e, data) => {
        const { startX, startY } = this.moveStatus;
        const controller = this.refs.controller;
        const { moveAreaRadius } = this.props;
        let offsetX, offsetY, dist2, radius2, angle;

        //计算偏移地址
        offsetX = data.x - startX;
        offsetY = data.y - startY;

        dist2 = offsetX*offsetX+offsetY*offsetY;
        radius2 = moveAreaRadius*moveAreaRadius;
        angle = Math.atan2(offsetY,offsetX);

        this._moveElement(offsetX, offsetY);

        if(dist2 > radius2) {
            offsetX = moveAreaRadius*Math.cos(angle);
            offsetY = moveAreaRadius*Math.sin(angle);
        }

        controller.style.transform = `translate(${offsetX}px,${offsetY}px)`;
    }

    _onControlDragStop = (e, data) => {
        const { startX, startY, oriTransform, bindingElm:elm } = this.moveStatus;
        const { onBound, onStop } = this.props;
        const controller = this.refs.controller;
        let offsetX, offsetY;

        //计算偏移地址
        offsetX = data.x - startX;
        offsetY = data.y - startY;
       
        if(onBound) {
            const offset = onBound(offsetX, offsetY);
            offsetX = offset.offsetX;
            offsetY = offset.offsetY;
        }

        onStop && onStop(offsetX, offsetY)


        controller.style.transition = 'transform 300ms';
        controller.style.transform = 'translate(0,0)';

        document.body.style.cursor = 'initial';

        elm && (elm.style.transform = oriTransform);

        this.setState({
            moving: false
        });
    }

    _moveElement(offsetX, offsetY) {
        const { onBound } = this.props;
        const moveStatus = this.moveStatus;
        const elm = moveStatus.bindingElm;

        if(onBound) {
            const offset = onBound(offsetX, offsetY);
            offsetX = offset.offsetX;
            offsetY = offset.offsetY;
        }

        elm && (elm.style.transform = `translate(${offsetX}px,${offsetY}px)`)
    }
}

Move.defaultProps = {
    prefixCls: 'move',
    controllerRadius:7,
    moveAreaRadius:30
}

Move.propTypes = {
    /**
     * [prefixCls 类名前缀]
     * @type {[string]}
     */
    prefixCls: PropTypes.string, 
    /**
     * [controlRadius 控制器半径]
     * @type {[number]}
     */
    controllerRadius: PropTypes.number,
    /**
     * [moveAreaRadius 可移动范围的半径]
     * @type {[number]}
     */
    moveAreaRadius: PropTypes.number,
    /**
     * [bindingId 绑定的dom id]
     * @type {[string]}
     */
    bindingId: PropTypes.string,
    /**
     * [onStop 拖动停止回调函数]
     * @type {[function]}
     */
    onStop: PropTypes.func,
    /**
     * [onStart 拖动开始回调函数]
     * @type {[function]}
     */
    onStart: PropTypes.func,
    /**
     * [onStop element边界判断]
     * @type {[function]}
     */
    onBound: PropTypes.func
}

export default Move;