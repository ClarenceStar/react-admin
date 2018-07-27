import React, { Component } from 'react'
import { Menu, Layout, Avatar, Icon } from 'antd'
import { Link } from 'react-router-dom'
import * as screenfull from 'screenfull'
import { showConfirm } from '../util/utils'
import history from '../util/history'
import './header.less'

const SubMenu = Menu.SubMenu
const { Header } = Layout

export default class Top extends Component {
  clear = item => {
    if (item.key === 'logOut') {
      this.props.clear()
    }
  }

  screenFull = () => {
    if (screenfull.enabled) {
      screenfull.request()
    }
  }

  logOut = () => {
    showConfirm(
      '提示',
      '确认退出吗',
      function() {
        history.push('/login')
      },
      function() {}
    )
  }
  render() {
    const { data } = this.props
    return (
      <Header style={{ background: '#fff' }}>
        <Icon
          className="trigger"
          type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.props.toggle}
        />
        <Menu mode="horizontal" className="logOut" onClick={this.clear}>
          <SubMenu
            title={
              <span>
                <Avatar
                  src={data != null ? data.portrait : '../images/yay.jpg'}
                />
                {data != null ? data.nickName : '未命名'}
              </span>
            }
          >
            <Menu.Item key="logOut" onClick={this.logOut}>
              <Icon type="logout" />退出登录
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="profile">
              <Link
                to={{
                  pathname: '/profile',
                  state: data != null ? data : ''
                }}
              >
                <Icon type="user" />个人中心
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
        <Icon
          className="screenFull"
          type="arrows-alt"
          onClick={this.screenFull}
        />
      </Header>
    )
  }
}
