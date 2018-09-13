import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import domAlign from 'dom-align'
import contains from 'rc-util/lib/Dom/contains'
import addEventListener from 'rc-util/lib/Dom/addEventListener'
import getPlacements from './placements'
import Mask from 'Shared/Mask'
import cx from 'classnames'

function buffer(fn, ms) {
    let timer

    function clear() {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
    }

    function bufferFn() {
        clear()
        timer = setTimeout(fn, ms)
    }

    bufferFn.clear = clear

    return bufferFn
}

class TipInner extends React.PureComponent {
    constructor(props) {
        super(props)
        const { animatedName } = props
        this.animatedIn = animatedName + 'In'
        this.animatedOut = animatedName + 'Out'
        this.state = {
            animatedOut: '',
            placementCls: 'top',
            isFirstDomAlignFinished: false
        }
        //让tooltip的那个角正常显示
        this._setPlacement()
    }

    componentDidMount() {
        //初始化dom节点后再domAlign
        this._forceAlign()
        this.setState({
            isFirstDomAlignFinished: true
        })
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible) {
            this.setState({
                animatedOut: this.animatedOut
            })
        } else {
            this._forceAlign()
            if (this.props.visible !== nextProps.visible) {
                this.setState({
                    animatedOut: ''
                })
            }
        }
    }

    componentDidUpdate() {
        const props = this.props

        if (props.visible) {
            // 点击页面其他位置 tooltip消失
            if (!this.clickOutsideHandler) {
                const currentDocument = window.document
                this.clickOutsideHandler = addEventListener(
                    currentDocument,
                    'mousedown',
                    this._onDocumentClick
                )
            }
            if (!this.mouseWheelOutsideHandler) {
                const currentDocument = window.document
                //监听document的mousewhell
                this.mouseWheelOutsideHandler = addEventListener(
                    currentDocument,
                    'mousewheel',
                    this._onDocumentClick
                )
            }
            //监听可滚动区域的scroll
            if (!this.scrollOutsideHandler) {
                const currentDocuments = [
                    ...document.getElementsByClassName('system-scroll-bar')
                ]
                currentDocuments.forEach(currentDocument => {
                    this.scrollOutsideHandler = addEventListener(
                        currentDocument,
                        'scroll',
                        this._onDocumentClick
                    )
                })
            }

            if (!this.mozMouseWheelOutsideHandler) {
                const currentDocument = window.document
                //监听document的mousewhell
                this.mozMouseWheelOutsideHandler = addEventListener(
                    currentDocument,
                    'DOMMouseScroll',
                    this._onDocumentClick
                )
            }
            // 窗口resize后重新计算弹出位置
            if (props.monitorWindowResize) {
                this._startMonitorWindowResize()
            } else {
                this._stopMonitorWindowResize()
            }

            //绑定滚动事件
            if (!this.scrollHandler) {
                let container = props.tooltipRef._container
                this.scrollHandler = addEventListener(
                    container.parentNode,
                    'scroll',
                    this._forceAlign
                )
            }
            return
        }
        this._stopMonitorWindowResize()
        this._clearOutsideHandler()
        this._clearOutSideScrollHandler()
        this._clearScrollHander()
    }

    componentWillUnmount() {
        this._clearOutsideHandler()
        this._stopMonitorWindowResize()
        this._clearScrollHander()
        this._clearOutSideScrollHandler()
    }

    render() {
        const { prefixCls, visible, mask } = this.props
        const { isFirstDomAlignFinished } = this.state
        const { placementCls } = this
        const contentCls = cx(`${prefixCls}__content`, {
            animated: true,
            //domAlign执行完后再执行css动画
            [`${this.animatedIn}`]: visible && isFirstDomAlignFinished,
            // [`${this.animatedIn}`]: visible,
            [`${this.state.animatedOut}`]: true,
            [`${prefixCls}__content--${placementCls}`]: placementCls,
            [`${prefixCls}--hidden`]: !visible
        })

        return (
            <div
                ref={wrapper => {
                    this.wrapper = wrapper
                }}>
                {mask ? (
                    <Mask
                        className={`${prefixCls}__mask`}
                        onClick={this._tooltipHidden}
                    />
                ) : null}

                <div
                    className={contentCls}
                    onAnimationEnd={this._animatedEnd}
                    ref={tip => {
                        this.tip = tip
                    }}>
                    <div
                        className={`${prefixCls}__arrow ${prefixCls}__arrow--${placementCls}`}
                    />

                    <div className={`${prefixCls}__inner`}>
                        {this._getInnerContent()}
                    </div>
                </div>
            </div>
        )
    }

    _startMonitorWindowResize = () => {
        if (!this.resizeHandler) {
            this.bufferMonitor = buffer(
                this._forceAlign,
                this.props.monitorBufferTime
            )
            this.resizeHandler = addEventListener(
                window,
                'resize',
                this.bufferMonitor
            )
        }
    }

    _stopMonitorWindowResize = () => {
        if (this.resizeHandler) {
            this.bufferMonitor.clear()
            this.resizeHandler.remove()
            this.resizeHandler = null
        }
    }

    _onDocumentClick = event => {
        const { mask, tooltipDom } = this.props
        if (mask) {
            return
        }
        const target = event.target
        const root = tooltipDom
        const popupNode = findDOMNode(this.tip)
        if (!contains(root, target) && !contains(popupNode, target)) {
            this._tooltipHidden()
        }
    }

    _clearOutsideHandler = () => {
        if (this.clickOutsideHandler) {
            this.clickOutsideHandler.remove()
            this.clickOutsideHandler = null
        }
    }
    _clearOutSideScrollHandler = () => {
        if (this.mouseWheelOutsideHandler) {
            this.mouseWheelOutsideHandler.remove()
            this.mouseWheelOutsideHandler = null
        }
        if (this.mozMouseWheelOutsideHandler) {
            this.mozMouseWheelOutsideHandler.remove()
            this.mozMouseWheelOutsideHandler = null
        }
    }

    _clearScrollHander = () => {
        if (this.scrollHandler) {
            this.scrollHandler.remove()
            this.scrollHandler = null
        }
    }

    _domAlignPlace = () => {
        const { placement } = this.props
        const placements = this._getPlacements()
        const keys = Object.keys(placements)
        return keys.indexOf(placement) > -1
            ? placements[placement]
            : placements['top']
    }

    _getPlacements() {
        const { builtinPlacements } = this.props
        return builtinPlacements || getPlacements()
    }

    _getInnerContent = () => {
        const { title, overlay } = this.props
        if (overlay) {
            return typeof overlay === 'function' ? overlay() : overlay
        } else {
            return title
        }
    }
    _setPlacement = () => {
        const placements = this._getPlacements()
        const { points } = this._domAlignPlace()
        for (const placement in placements) {
            if (placements.hasOwnProperty(placement)) {
                if (this._isPointsEq(placements[placement].points, points)) {
                    this.placementCls = placement
                }
            }
        }
    }

    _getPopupClassNameFromAlign = () => {
        const placements = this._getPlacements()
        const source = findDOMNode(this.tip)
        const domAlignPlace = this._domAlignPlace()
        const align = domAlign(source, this.props.tooltipDom, domAlignPlace)
        const points = align.points

        for (const placement in placements) {
            if (placements.hasOwnProperty(placement)) {
                if (this._isPointsEq(placements[placement].points, points)) {
                    this._setTransformOrigin(placement, align)
                    return placement
                }
            }
        }
    }

    _forceAlign = () => {
        const placementCls = this._getPopupClassNameFromAlign()
        this.placementCls = placementCls
        // this.setState({
        //   placementCls: placementCls
        // });
    }

    _setTransformOrigin = (placement, align) => {
        // 根据当前坐标设置动画点
        const domNode = findDOMNode(this.tip)
        const rect = domNode.getBoundingClientRect()
        const transformOrigin = {
            top: '50%',
            left: '50%'
        }
        if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
            transformOrigin.top = `${rect.height - align.offset[1]}px`
        } else if (
            placement.indexOf('Top') >= 0 ||
            placement.indexOf('bottom') >= 0
        ) {
            transformOrigin.top = `${-align.offset[1]}px`
        }

        if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
            transformOrigin.left = `${rect.width - align.offset[0]}px`
        } else if (
            placement.indexOf('right') >= 0 ||
            placement.indexOf('Left') >= 0
        ) {
            transformOrigin.left = `${-align.offset[0]}px`
        }

        domNode.style.transformOrigin = `${transformOrigin.left} ${
            transformOrigin.top
        }`
    }

    _isPointsEq(a1, a2) {
        return a1[0] === a2[0] && a1[1] === a2[1]
    }

    _animatedEnd = e => {
        if (e.target.className.indexOf(this.animatedOut) > -1) {
            const { onClose } = this.props
            const domNode = findDOMNode(this.tip)
            this.setState({
                animatedOut: ''
            })

            domNode.style.left = ''
            domNode.style.top = ''

            onClose && onClose()
        }
    }

    _tooltipHidden = () => {
        //兼容popover 组件已经卸载的情况
        if (this.tip) {
            this.setState({
                animatedOut: this.animatedOut
            })
        }
    }
}

TipInner.defaultProps = {
    animatedName: 'zoom',
    monitorBufferTime: 50,
    monitorWindowResize: true
}

TipInner.propTypes = {
    /**
     * 固定类名
     */
    prefixCls: PropTypes.string.isRequired,
    /**
     * 提示文字
     */
    title: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 复杂的提示内容
     */
    overlay: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
        PropTypes.func
    ]),
    /**
     * 提示样式
     */
    style: PropTypes.object,
    /**
     * 控制显隐
     */
    visible: PropTypes.bool,
    /**
     * 关闭的回调函数
     */
    onClose: PropTypes.func,
    /**
     * 动画名称
     */
    animatedName: PropTypes.string
}

export default TipInner

// this.clickOutsideHandler
