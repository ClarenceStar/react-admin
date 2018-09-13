import React from 'react';
import PropTypes from 'prop-types';

import Calendar from 'rc-calendar';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import Picker from 'rc-calendar/lib/Picker';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import moment from 'moment';

import 'rc-time-picker/assets/index.css';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import 'moment/locale/zh-cn';
import './index.styl'

const CALENDAR_TYPE = {
    NORMAL: 'normal',
    RANGE: 'range'
}

class DatePicker extends React.PureComponent {
    constructor(props) {
        super(props);

        const now = moment();
        now.locale('zh-cn').utcOffset(8);

        this.state = {
            defaultCalenderValue: now.clone(),
            hoverValue: []
        }
    }

    render() {
        const {
            disabled,
            value,
            open,
            onOpenChange,
            calendarType,
            onChange,
            placeholder,
            showValue,
            format
        } = this.props;

        const calendar = this.renderCalendear();
        let param = {};

        switch(calendarType) {
            case CALENDAR_TYPE.RANGE:
                param = {
                    open,
                    onOpenChange
                };
                break;
            default:
                param = {
                    onChange
                };
        }

        return (
            <Picker
                calendar={calendar}
                disabled={disabled}
                value={value}
                {...param}
            >
                {
                    ({value}) => {
                        let val;

                        switch(calendarType) {
                            case CALENDAR_TYPE.RANGE:
                                val = showValue ;
                                break;
                            default:
                                val = value;
                        }

                        return (
                            <span>
                                <input 
                                    type='text'
                                    placeholder={placeholder}
                                    readOnly
                                    value={val && val.format(format) || ''}
                                />
                            </span>
                        )
                    }
                }
            </Picker>   
        )
    }

    renderCalendear() {
        const { 
            calendarType,
            showTime,
            disabledDate,
            rangeType,
            format,
            onChange,
            onOpenChange
        } = this.props;

        switch (calendarType) {
            case CALENDAR_TYPE.RANGE:
                return (
                    <RangeCalendar
                        style={{width: 720}}
                        type={rangeType}
                        locale={zhCN}
                        defaultValue={this.state.defaultCalenderValue}
                        format={format}
                        disabledDate={disabledDate}
                        timePicker={
                            showTime
                                ?  <TimePickerPanel />
                                : null
                        }
                        onChange={onChange}
                        onHoverChange={this._onHoverChange}
                        hoverValue={this.state.hoverValue}
                    />
                ); 
            default:
                return (
                    <Calendar
                        className="datapicker-shared"
                        locale={zhCN}
                        defaultValue={this.state.defaultCalenderValue}
                        format={format}
                        timePicker={
                            showTime
                                ?  <TimePickerPanel />
                                : null
                        }
                        disabledDate={disabledDate} />
                   
                );
        } 
    }

    _onHoverChange = (hoverValue)=>{
        this.setState({ hoverValue });
    }
}

DatePicker.defaultProps = {
    showTime: true,
    disabled: false,
    calendarType: CALENDAR_TYPE.NORMAL,
    format: 'YYYY-MM-DD HH:mm:ss'
}

DatePicker.propTypes = {
    /**
     * 是否显示时间
     */
    showTime: PropTypes.bool,
    /**
     * Calendar的类型:normal, range
     */
    calendarType: PropTypes.string,
    /**
     * 是否禁用
     */
    disabled: PropTypes.bool,
    /**
     * 是否禁止当前时间的选择
     */
    disabledDate: PropTypes.func,
    /**
     * RangeCalendar组件的类型('both','start', 'end')
     */
    rangeType: PropTypes.string,
    /**
     * 日期格式
     */
    format: PropTypes.string,
    /**
     * 值改变的回调函数
     */
    onChange: PropTypes.func,
    /**
     * current open state of picker. controlled prop
     */
    open: PropTypes.bool,
    /**
     * called when open/close picker
     */
    onOpenChange: PropTypes.func,
    /**
     * 传递给Date-Picker的值
     */
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    /**
     * Range组件用到，实际显示的值
     */
    showValue: PropTypes.object,
    /**
     * 文本框占位
     */
    placeholder: PropTypes.string
}

export default DatePicker