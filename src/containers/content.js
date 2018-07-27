import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Layout } from 'antd'
import './content.less'
import Welcome from '../pages/welcome'
import Follow from '../pages/follow'
import Music from '../pages/music'
import Tools from '../pages/tools'
import Clock from '../pages/clock'
import Comment from '../pages/comment'
import history from '../util/history'
const { Content } = Layout
const location = history.location

export default class Contents extends Component {
  render() {
    return (
      <Content history={history} location={location}>
        <Route path="/main" component={Welcome} />
        <Route path="/follow" component={Follow} />
        <Route path="/music/musicstyle" component={Music} />
        <Route path="/tool/tools" component={Tools} />
        <Route path="/tool/clock" component={Clock} />
        <Route path="/blog/comment" exact component={Comment} />
        <Route path="/blog/comment/hehe" component={Tools} />
        <Route path="/blog/comment/haha" component={Welcome} />
      </Content>
    )
  }
}
