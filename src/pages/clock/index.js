import React, { Component } from 'react'
import Context from '../../components/context'
import { Button } from "antd";
class AutoFocusInput extends Component {
    componentDidMount() {
        this.input.focus()
    }

    render() {
        return (
            <input ref={(input) => this.input = input} />
        )
    }
}

class Clock extends Component {
    constructor() {
        super()
        this.state = {
            date: new Date()
        }
    }
    componentWillMount() {
        this.timer = setInterval(() => {
            this.setState({ date: new Date() })
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        return (
            <div>
                <h1>
                    <p>现在的时间是</p>
                    {this.state.date.toLocaleTimeString()}
                </h1>
            </div>
        )
    }
}

class Header extends Component {
    render() {
        return (
            <div>
                <h1 className='title'>React 小书</h1>
            </div>
        )
    }
}
export default class ClockApp extends Component {
    constructor() {
        super()
        this.state = {
            isShowHeader: true,
            isShowClock: true
        }
    }

    handleShowOrHide() {
        this.setState({
            isShowHeader: !this.state.isShowHeader,
            isShowClock: !this.state.isShowClock
        })
    }
    handleClick() {
        this.props.history.push("/comment");
    }
    handleLogin() {
        this.props.history.push("/login");
    }
    render() {
        return (
            <div>
                {this.state.isShowHeader ? <Header /> : null}
                <button onClick={this.handleShowOrHide.bind(this)}>
                    显示或者隐藏标题
                </button>
                {this.state.isShowClock ? <Clock /> : null}
                <button onClick={this.handleShowOrHide.bind(this)}>
                    显示或隐藏时钟
                </button>
                <Button type="primary" onClick={this.handleClick.bind(this)}>
                    click me!
                </Button>
                <Button type="primary" onClick={this.handleLogin.bind(this)}>
                    Login!
                </Button>
                <button>Primary</button>
                <Button type="danger">Danger</Button>
                <AutoFocusInput />
                <Context />
            </div>
        )
    }
}