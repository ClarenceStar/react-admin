import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Layout } from 'antd'
import './content.less'
import NoFind from '../pages/nofind'
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
        <Route path="/main" component={NoFind} />
        <Route path="/follow" component={Follow} />
        <Route path="/musicstyle" component={Music} />
        <Route path="/tools" component={Tools} />
        <Route path="/clock" component={Clock} />
        <Route path="/comment" component={Comment} />
        <Route path="/hehe" component={Tools} />
        <Route path="/haha" component={Clock} />

        {/* <Route
          path="blog/comment"
          exact
          render={({ history, location, match }) => (
            <Comment history={history} location={location} match={location}>
              <Route path="blog/comment/hehe" exact component={Tools} />
              <Route path="/haha" exact component={Clock} />
            </Comment>
          )}
        /> */}
      </Content>
    )
  }
}
