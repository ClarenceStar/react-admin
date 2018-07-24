import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Layout } from 'antd'
import './content.less'
import NoFind from "../pages/nofind";
import Follow from '../pages/follow'
import Music from '../pages/music'
import Tools from '../pages/tools'
import Clock from '../pages/clock'
import Comment from '../pages/comment'
const { Content } = Layout

export default class Contents extends Component {
    render() {
        return (
            <Content>
                    <Route path="/404" component={NoFind} />
                    <Route path="/follow" component={Follow} />
                    <Route path="/music" component={Music} />
                    <Route path="/tools" component={Tools} />
                    <Route path="/clock" component={Clock} />
                    <Route path="/comment" component={Comment} />
            </Content>
        )
    }
}