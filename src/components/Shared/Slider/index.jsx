import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Tooltip from 'Shared/Tooltip';
import Steps from './step';
import Marks from './mark';
import './index.styl';


class Slider extends React.PureComponent{
    constructor(props) {
        super(props);

        const defaultValue = props.defaultValue !== undefined ?
            props.defaultValue : props.min;
        const value = props.value !== undefined ?
            props.value : defaultValue;

        this.state = {
           position: this._getOffsetByValue(value),
           dragging: false,
           visible: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!('value' in nextProps || 'min' in nextProps || 'max' in nextProps)) return;
        const prevValue = this._getValue(this.state.position);
        const value = nextProps.value !== undefined ?
                nextProps.value : prevValue;

        const nextValue = this._trimAlignValue(value, nextProps);
        if (nextValue === prevValue) return;
        this.setState({ position: this._getOffsetByValue(nextValue)});

        if (this._isValueOutOfRange(value, nextProps)) {
            this.props.onChange(nextValue);
        }
    }

    componentWillUnmount() {
        this._removeDocumentEvents();
    }

    render(){

        const { marks, dots, step, included, max, min, tipFormatter } = this.props;

        const position = this.state.position;
        let visible = this.state.visible;
        let dragging = this.state.dragging;

        if (tipFormatter === null){
            visible = false;
            dragging = false;
        };

        return (

            <div className="slider" onMouseDown = {this._beginSlider} >
                <div className="slider__track"
                    style={{width: `${position}%`,
                        visibility: included? 'visible': 'hidden' }}>
                </div>
                <Steps
                    prefixCls={'slider'}
                    marks={marks}
                    dots={dots}
                    step={step}
                    included={included}
                    lowerBound={this._getLowerBound()}
                    upperBound={this._getUpperBound()}
                    max={max}
                    min={min}
                />
                <Tooltip
                    title={ tipFormatter
                        ? tipFormatter(this._getValue(position))
                        : this._getValue(position) }
                    visible={ visible || dragging }
                    >
                        <div className="slider__handle"
                            style={{left: `${position}%` }}
                            onMouseEnter={() => this._toggleTooltipVisible(true) }
                            onMouseLeave={() => this._toggleTooltipVisible(false) }
                        >
                        </div>
                </Tooltip>
                <Marks
                    className="slider__mark"
                    marks={marks}
                    included={included}
                    lowerBound={this._getLowerBound()}
                    upperBound={this._getUpperBound()}
                    max={max}
                    min={min}
                />
            </div>
        )
    }

    _getOffsetByValue(value) {
      const { min, max } = this.props;
      const ratio = (value - min) / (max - min);
      return ratio * 100;
    }

    _beginSlider = (e) => {
        if (e.button !== 0) { return; }
        this.slider = e.currentTarget;

        /* 只点击不移动时 */
        const offset = this._getOffset(e);
        const value = this._getValue(offset);
        const fixOffset = this._getOffsetByValue(value);

        this._onChange(fixOffset, value, true);
        this._addDocumentMouseEvents();
    }

    /* */
    _addDocumentMouseEvents = () => {
        document.addEventListener('mousemove', this._onMouseMove);
        document.addEventListener('mouseup', this._onEnd);
    }

    _onMouseMove = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const offset = this._getOffset(e);
        const value = this._getValue(offset);
        const fixOffset = this._getOffsetByValue(value);

        this._onChange(fixOffset, value, true);
    }

    /* 获取偏移量 */
    _getOffset = (e) => {
        const slider = this.slider;

        const sliderBeginPosition = slider.getBoundingClientRect().left;
        const sliderWidth = slider.clientWidth;
        const mousePosition = e.clientX;

        let ratio = 0;

        if ( mousePosition < sliderBeginPosition ){
            ratio = 0;
        } else if ( mousePosition > sliderWidth + sliderBeginPosition ){
            ratio = 100
        } else {
            ratio = (mousePosition - sliderBeginPosition) * 100 / sliderWidth;
        }

        return ratio;
    }

    /* 获取真实值 */
    _getValue = (offset) => {
        const { min, max } = this.props;
        const ratio = 0.01 * offset
        let value = min + ratio * (max- min);
        return this._trimAlignValue(value, this.props);
    }

    _onChange = (offset, changeValue, dragging) => {
        const props = this.props;
        const isNotControlled = !('value' in props);
        if (isNotControlled) {
            this.setState({
                position: offset,
                dragging: dragging,
            });
        }else{
            this.setState({dragging: dragging})
        }
        props.onChange && props.onChange(changeValue)
    }

    /* 滑动结束 */
    _onEnd = (e) => {
        this.setState({
            dragging: false,
        });
        this._removeDocumentEvents();
        const { onAfterChange } = this.props;
        onAfterChange && onAfterChange(this._getValue(this.state.position));
    }

    _removeDocumentEvents = () => {
        document.removeEventListener('mousemove', this._onMouseMove)
        document.removeEventListener('mouseup', this._onEnd)
    }

    _toggleTooltipVisible = (visible) => {
        this.setState({
            visible: visible
        })
    }

    /* 确保滑动值在取值范围内且符合step规则 */
    _trimAlignValue(v, nextProps = {}) {
        const mergedProps = { ...this.props, ...nextProps };
        const val = this._ensureValueInRange(v, mergedProps);
        return this._ensureValuePrecision(val, mergedProps);
    }

    _ensureValueInRange(val, {min, max}) {
        if (val <= min) {
            return min;
        }
        if (val >= max) {
            return max;
        }
        return val;
    }

    _ensureValuePrecision(val, props) {
        const { step } = props;
        const closestPoint = this._getClosestPoint(val, props);
        return step === null ? closestPoint :
        parseFloat(closestPoint.toFixed(this._getPrecision(step)));
    }

    /* 获取小数位数 */
    _getPrecision(step) {
        const stepString = step.toString();
        let precision = 0;
        if (stepString.indexOf('.') >= 0) {
            precision = stepString.length - stepString.indexOf('.') - 1;
        }
        return precision;
    }

    _isValueOutOfRange(value, { min, max }) {
        return value < min || value > max;
    }

    _getLowerBound() {
        return this.props.min;
    }

    _getUpperBound() {
        return this.state.position;
    }

    _getClosestPoint(val, { marks, step, min }) {
        const points = Object.keys(marks).map(parseFloat);
        if (step !== null) {
            const closestStep =
                    Math.round((val - min) / step) * step + min;
            points.push(closestStep);
        }
        const diffs = points.map(point => Math.abs(val - point));
        return points[diffs.indexOf(Math.min(...diffs))];
    }
}

Slider.defaultProps = {
    dots: false,
    step: 1,
    included: true,
    marks: {}
}

Slider.propTypes = {
    /**
    * 最小值
    */
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    /**
    * 最大值
    */
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    /**
    * 步长，取值必须大于 0，并且可被 (max - min) 整除。
    * 当 marks 不为空对象时，可以设置 step 为 null，
    * 此时 Slider 的可选值仅有 marks 标出来的部分
    */
    step: PropTypes.number,
    /**
    * 刻度标记，key 的类型必须为 number 且取值在闭区间 min, max 内，
    * 每个标签可以单独设置样式
    */
    marks: PropTypes.object,
    /**
    * 是否只能拖拽到刻度上
    */
    dots: PropTypes.bool,
    /**
    * marks 不为空对象时有效，值为 true 时表示值为包含关系，false 表示并列
    */
    included: PropTypes.bool,
    /**
    * 初始取值
    */
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
    * 设置当前取值
    */
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
    * 样式
    */
    style: PropTypes.object,
    /**
    * 值发生改变时触发
    */
    onChange: PropTypes.func,
    /**
    * 结束滑动时触发
    */
    onAfterChange: PropTypes.func,
    /**
    * 格式化tooltip的显示值，为null时隐藏tooltip
    */
    tipFormatter: PropTypes.func,

};

export default Slider;
