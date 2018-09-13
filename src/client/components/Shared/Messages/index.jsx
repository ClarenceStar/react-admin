import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { getContainer } from 'utils/common';
import Notice from './notice';
import './index.styl';

let seed = 0;
const now = Date.now();

class Message extends React.PureComponent{

    constructor(props){
        super(props)
        this.state = {
            notices: [],
        };
    }

    render(){
        const { top } = this.props;
        return (
            <div className="messages" style={{top: top}}>
                { this._getNoticeNodes() }
            </div>
        )
    }

    _getNoticeNodes(){
        const noticeNodes = this.state.notices.map((notice) => {
            const onRemove = ()=>{ this._remove(notice.key)};
            return (<Notice
                prefixCls="messages"
                key={notice.key}
                type={notice.type}
                message={notice.message}
                duration={notice.duration}
                onClose={notice.onClose}
                onRemove={onRemove}
                />);
        });

        return noticeNodes;
    }

    /* 每次点击生成唯一的key后加入到notices队列 */
    _add(props){
        this.setState(previousState => {
            const notices = previousState.notices;
            if (!notices.filter(v => v.key === props.key).length) {
                return {
                    notices: notices.concat(props),
                };
            }
        });
    }

    /* 将显示过的message从notices队列中移除 */
    _remove(targetKey){
        this.setState(previousState => {
            return {
                notices: previousState.notices.filter(notice=> notice.key !== targetKey),
            };
        });

    }
}

function _getUuid() {
  return `Message_${now}_${seed++}`;
}

function _getInstance(properties) {
    const {...props} = properties || {};
    let div = getContainer('Message', properties);
    return ReactDOM.render(<Message {...props} />, div);
}

function notice(message, duration=3000, type, onClose){
    const Instance = _getInstance();
    const key = _getUuid();
    Instance._add({
        key,
        message,
        duration,
        type,
        onClose
    });
    return (function(){
        let target = key;
        return function(){
            Instance._remove(target)
        }
    })()
}

Message.defaultProps = {
    top: '24px',
    closable: true,
};

Message.propTypes = {
    /**
    * message距离顶部的高度
    */
    top: PropTypes.string,
    /**
    * 是否显示右上角的关闭按钮
    */
    closable: PropTypes.bool,
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
    * 移除当前message
    */
    onRemove: PropTypes.func,
    /**
    * 关闭时的回调函数
    */
    onClose: PropTypes.func,
   /**
    * message内容
    */
    message: PropTypes.string,
    /**
    * message持续秒数，单位为ms
    */
    duration: PropTypes.number,
}

export default {
  info(content, duration, onClose) {
    return notice(content, duration, 'info', onClose);
  },
  success(content, duration, onClose) {
    return notice(content, duration, 'success', onClose);
  },
  error(content, duration, onClose) {
    return notice(content, duration, 'error', onClose);
  },
  warning(content, duration, onClose) {
    return notice(content, duration, 'warning', onClose);
  },
  loading(content, duration, onClose) {
    return notice(content, duration, 'loading', onClose);
  },
};
