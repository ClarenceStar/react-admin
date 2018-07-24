import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { getContainer } from 'utils/common';
import Notice from './notice';
import assign from 'object-assign';
import cx from 'classnames';
import './index.styl';

let seed = 0;
const now = Date.now();
let defaultTop = 24;
let defaultBottom = 24;
let defaultPlacement = "topRight";
let notificationInstance = {};
let zIndex = 0

class Notification extends React.PureComponent{

    constructor(props){
        super(props)
        this.state = {notices: []};
    }

    render(){
        const { style, placement } = this.props;
        const placementStyle = this._getPlacementStyle(placement);
        zIndex = zIndex <= 100 ? zIndex + 1 : 0;
        const noticeStyle = assign(placementStyle, style, {zIndex: 1000 + zIndex});
        const cls = cx("notification", {
            [`notification--${placement}`]: placement,
        })
        return (
            <div className={cls} style={noticeStyle}>
                { this._getNoticeNodes() }
            </div>
        )
    }

    _getNoticeNodes(){
        const noticeNodes = this.state.notices.map((notice) => {
            const onRemove = ()=>{ this._remove(notice.key)};
            return (<Notice
                prefixCls="notification"
                key={notice.key}
                type={notice.type}
                title={notice.title}
                message={notice.message}
                placement={notice.placement || defaultPlacement}
                btn={notice.btn}
                duration={notice.duration}
                onClose={notice.onClose}
                onRemove={onRemove}
                />);
        });
        return noticeNodes;
    }

    _getPlacementStyle = (placement) => {
        let style;
        switch (placement) {
            case 'topLeft':
                style = {
                    left: 0,
                    top: defaultTop,
                    bottom: 'auto',
                };
                break;
            case 'bottomLeft':
                style = {
                    left: 0,
                    top: 'auto',
                    bottom: defaultBottom,
                };
                break;
            case 'bottomRight':
                style = {
                    right: 0,
                    top: 'auto',
                    bottom: defaultBottom,
                };
                break;
            default:
                style = {
                    right: 0,
                    top: defaultTop,
                    bottom: 'auto',
                };
        }
        return style;
    }

    /* 每次点击生成唯一的key后加入到notices队列 */
    _add(props){
        this.setState(previousState => {
            const notices = previousState.notices;
            const existedNotice = notices.filter(v => v.key === props.key);

            if (existedNotice.length === 0) {
                // 当前notices队列中不存在传入的key
                return {
                    notices: notices.concat(props),
                };
            } else {
                // 存在传入的key 判断是否需要更新
                const oldProps = existedNotice[0];
                const restNotices = notices.filter(v => v.key !== props.key);
                const noticesTemp = [...restNotices];

                noticesTemp.splice(0, 0, props);

                return {
                    notices: noticesTemp
                }
            }
        });
    }

    /* 从notices队列中移除 */
    _remove(targetKey){
        this.setState(previousState => {
            return {
                notices: previousState.notices.filter(notice=> notice.key !== targetKey),
            };
        },);
    }
}

function _getUuid() {
  return `Notice_${now}_${seed++}`;
}

function _getInstance(properties) {
    const {...props} = properties || {};

    const placement = props.placement || defaultPlacement;

    if ( placement in notificationInstance ) {

        return notificationInstance[placement];

    } else {

        let div = getContainer(`Notification-${placement}`, properties);
        notificationInstance[placement] = ReactDOM.render(<Notification {...props} />, div);
        return notificationInstance[placement];
    }
}

function notice(props){
    const Instance = _getInstance(props);
    let key = props ? props.id : undefined;
    key = key || _getUuid();
    Instance._add({
        key,
        ...props
    });
    return Instance
}

Notification.defaultProps = {
    placement: "topRight",
};

Notification.propTypes = {
    /**
    * 样式
    */
    style: PropTypes.object,
    /**
    * 当前通知唯一标志
    */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
    * 指定notice提示的样式
    *有四种选择 success、info、warning、error
    */
    type: PropTypes.string,
    /**
    * 固定类名
    */
    prefixCls: PropTypes.string,
    /**
    * 通知标题
    */
    title: PropTypes.string,
    /**
    * 通知内容
    */
    message: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    /**
    * 点击关闭按钮的回调函数
    */
    onClose: PropTypes.func,
    /**
    * 移除当前notice
    */
    onRemove: PropTypes.func,
    /**
    * 通知的位置，有topRight, bottomRight, topLeft, bottomLeft可选
    * 默认为topRight
    */
    placement: PropTypes.string,
    /**
    * 自定义按钮
    */
    btn: PropTypes.element,
    /**
    * 持续秒数，单位为ms
    */
    duration: PropTypes.number,
}

export default {
  open(properties) {
      return notice(properties)
  },
  info(properties) {
    return notice({type: 'info', ...properties});
  },
  success(properties) {
    return notice({type: 'success', ...properties});
  },
  error(properties) {
    return notice({type: 'error', ...properties});
  },
  warning(properties) {
    return notice({type: 'warning', ...properties});
  },
  close(key, placement) {
      for ( placement in notificationInstance ) {
        notificationInstance[placement]._remove(key)
      }
  }
};
