import React,{ Component } from "react";
import PropTypes from 'prop-types'

export default class context extends Component {
    static childContextTypes = {
        themeColor: PropTypes.string
    }

    constructor() {
        super()
        this.state = { themeColor: 'red' }
    }

    getChildContext() {
        return { themeColor: this.state.themeColor }
    }
    render() {
        return (
            <div>
                <Header />
                <Main />
            </div>
        )
    }
}

class Header extends Component {
    static contextTypes = {
        themeColor: PropTypes.string
    }
    render() {
        return (
            <div>
                <h2 style={{color:this.context.themeColor}}>This is header</h2>
                <Title />
            </div>
        )
    }
}

class Main extends Component {
    render() {
        return (
            <div>
                <h2>This is main</h2>
                <Content />
            </div>
        )
    }
}

class Title extends Component {
    render() {
        return (
            <h1>React.js 小书标题</h1>
        )
    }
}

class Content extends Component {
    render() {
        return (
            <div>
                <h2>React.js 小书内容</h2>
            </div>
        )
    }
}