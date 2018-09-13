import { Layout, Menu, Icon, Switch } from 'antd'
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Contents from '../../containers/content'
import { allMenu } from '../../util/menu'
import Footer from '../../containers/bottom'
import Top from '../../containers/header'
import Bread from '../../components/Bread/Bread'
import Tree from '../../components/Tree'
import './index.less'
const { Sider } = Layout
const SubMenu = Menu.SubMenu

// const breadcrumbNameMap = {
//   '/main': '首页',
//   '/blog': '博客模块',
//   '/blog/comment': '评论',
//   '/blog/comment/hehe': 'hehe',
//   '/blog/comment/haha': 'haha',
//   '/follow': '项目地址',
//   '/music': '音乐模块',
//   '/music/musicstyle': '音乐系列',
//   '/tool': '工具模块',
//   '/tool/tools': '小工具',
//   '/tool/clock': '时钟'
// }

export default class MainApp extends Component {
  state = {
    collapsed: false,
    theme: 'dark',
    current: 'index',
    mode: 'inline' // 水平垂直展现
  }
  componentDidMount() {
    this.handleClick([], 'index')
  }
  changeTheme = value => {
    this.setState({
      theme: value ? 'dark' : 'light'
    })
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      mode: this.state.collapsed ? 'inline' : 'vertical'
    })
  }
  clear = () => {
    this.setState({
      current: 'index'
    })
  }
  handleClick = (e, special) => {
    this.setState({
      current: e.key || special
    })
  }

  render() {
    const { location } = this.props
    let route_arr = location.pathname.split('/')
    let _routes = route_arr.slice(1, route_arr.length)
    let route_obj = []
    const pathSnippets = location.pathname.split('/').filter(i => i)
     pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      route_obj.push({ link: url, name: _routes[index] })
      route_obj
    })
    const treeData = [
      {
        title: '0-0',
        key: '0-0',
        children: [
          {
            title: '0-0-0',
            key: '0-0-0'
          },
          {
            title: '0-0-1',
            key: '0-0-1'
          },
          {
            title: '0-0-2',
            key: '0-0-2'
          }
        ]
      }
    ]
    return <div>
        <Layout className="containAll">
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} className="leftMenu">
            {this.state.theme === 'light' ? <a href="https://github.com/gj459395234/react-admin" target="_blank" rel="noopener noreferrer">
                <Icon type="github" className="github" />
              </a> : <a href="https://github.com/gj459395234/react-admin" target="_blank" rel="noopener noreferrer">
                <Icon type="github" className="github white" />
              </a>}
            {this.state.theme === 'light' ? <span className="author">
                Demo
              </span> : <span className="author white">Demo</span>}
            <Menu theme={this.state.theme} onClick={this.handleClick} defaultOpenKeys={['']} selectedKeys={[this.state.current]} className="menu" mode={this.state.mode}>
              {allMenu.map(subMenu => {
                if (subMenu.children && subMenu.children.length) {
                  return <SubMenu key={subMenu.url} title={<span>
                          <Icon type={subMenu.icon} />
                          <span>{subMenu.name}</span>
                        </span>}>
                      {subMenu.children.map(menu => {
                        if (menu.children && menu.children.length) {
                          return <SubMenu key={menu.url} title={<span>
                                  <Icon type={menu.icon} />
                                  {menu.name}
                                </span>}>
                              {menu.children.map(sonMenu => (
                                <Menu.Item key={sonMenu.url}>
                                  <Link
                                    to={{
                                      pathname: `/${sonMenu.url}`,
                                      state: location.state
                                    }}
                                  >
                                    <span>
                                      <Icon type={sonMenu.icon} />
                                      <span>{sonMenu.name}</span>
                                    </span>
                                  </Link>
                                </Menu.Item>
                              ))}
                            </SubMenu>
                        }
                        return <Menu.Item key={menu.url}>
                            <Link to={{ pathname: `/${menu.url}`, state: location.state }}>
                              <span>
                                <Icon type={menu.icon} />
                                <span>{menu.name}</span>
                              </span>
                            </Link>
                          </Menu.Item>
                      })}
                    </SubMenu>
                }
                return <Menu.Item key={subMenu.url}>
                    <Link to={{ pathname: `/${subMenu.url}`, state: location.state }}>
                      <Icon type={subMenu.icon} />
                      <span className="nav-text">{subMenu.name}</span>
                    </Link>
                  </Menu.Item>
              })}
            </Menu>
            <div className="switch">
              <Switch checked={this.state.theme === 'dark'} onChange={this.changeTheme} checkedChildren="Dark" unCheckedChildren="Light" />
            </div>
          </Sider>
          <Layout style={{ height: '100%' }}>
            <Top toggle={this.toggle} collapsed={this.state.collapsed} clear={this.clear} data={location.state} />
          <Bread separator=">" style={{ marginTop: '10px' }} routes={route_obj} />
          <Tree data = {treeData}/>
            <Contents />
            <Footer />
          </Layout>
        </Layout>
      </div>
  }
}
withRouter(MainApp)
