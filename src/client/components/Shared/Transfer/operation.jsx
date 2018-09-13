import React from 'react';
import Button from 'Shared/Button';
import PropTypes from 'prop-types';
import Icon from 'Shared/Icon';
import cx from 'classnames';

class TransferOperation extends React.Component{

  render() {
    const {
      moveToLeft,
      moveToRight,
      leftArrowText,
      rightArrowText,
      leftActive,
      rightActive,
      clickMode,
      prefixCls
    } = this.props;

    const cls = cx({
        [`${prefixCls}__operation`]: true,
        [`${prefixCls}__operation--click-mode`]: !!clickMode,
    });

    const moveToLeftButton = (
      <Button type="primary" size="small" disabled={!leftActive} onClick={()=>{moveToLeft()}}>
        {<span><Icon name="chevron-left" />{leftArrowText}</span>}
      </Button>
    );
    const moveToRightButton = (
      <Button type="primary" size="small" disabled={!rightActive} onClick={()=>{moveToRight()}}>
        {<span>{rightArrowText}<Icon name="chevron-right" /></span>}
      </Button>
    );
    const el = (
        <div className={cx(cls)}>
          {moveToLeftButton}
          {moveToRightButton}
        </div>
    );

    if (!!clickMode) {

        return (
            <div className={cx(cls)}>
              <Icon name="arrows-h" className="fa-2x" />
            </div>
        )
    } else {
        return el;
    }

  }
}

function noop() {
}

TransferOperation.defaultProps = {
    leftArrowText: '',
    rightArrowText: '',
    moveToLeft: noop,
    moveToRight: noop,
}

TransferOperation.propTypes ={
    /**
     * [clickMode：false —— checkbox可选模式]
     * [clickMode：true —— 点击穿梭模式]
     * @type {[bool]}
     */
    clickMode: PropTypes.bool,
    /**
     * [prefixCls description]
     * @type {[string]}
     */
    prefixCls: PropTypes.string,
}

export default TransferOperation;
