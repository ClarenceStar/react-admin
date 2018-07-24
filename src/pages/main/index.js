import { Layout, Menu, Icon, Switch } from 'antd';
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';
import Contents from '../../containers/content'
import { allMenu } from '../../util/menu'
import Footer from '../../containers/bottom'
import Top from '../../containers/header'
import './index.less'
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class MainApp extends Component {
    state = {
        collapsed: false,
        theme: 'dark',
        current: 'index',
        mode: 'inline',  // 水平垂直展现
    };
    componentDidMount() {
        this.handleClick([], 'index')
    }
    changeTheme = (value) => {
        this.setState({
            theme: value ? 'dark' : 'light',
        })
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            mode: this.state.collapsed ? 'inline' : 'vertical',
        })
    }
    clear = () => {
        this.setState({
            current: 'index',
        })
    }
    handleClick = (e, special) => {
        this.setState({
            current: e.key || special,
        })
    }

    render() {
        const { location } = this.props
        return (
            <div>
                <Layout className="containAll">
                    <Sider
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse}
                        className="leftMenu"
                    >
                        {this.state.theme === 'light' ? <a href="https://github.com/MuYunyun/react-antd-demo" target='_blank' rel='noopener noreferrer'><Icon type="github" className="github" /></a> :
                            <a href="https://github.com/MuYunyun/react-antd-demo" target='_blank' rel='noopener noreferrer'><Icon type="github" className="github white" /></a>}
                        {this.state.theme === 'light' ? <span className="author">Demo</span> : <span className="author white">Demo</span>}
                        <Menu theme={this.state.theme}
                            onClick={this.handleClick}
                            defaultOpenKeys={['']}
                            selectedKeys={[this.state.current]}
                            className="menu"
                            mode={this.state.mode}>
                            {
                                allMenu.map((subMenu) => {
                                    if (subMenu.children && subMenu.children.length) {
                                        return (
                                            <SubMenu key={subMenu.url} title={<span><Icon type={subMenu.icon} /><span>{subMenu.name}</span></span>}>
                                                {subMenu.children.map(menu => (
                                                    <Menu.Item key={menu.url}><Link to=
                                                        {{
                                                            pathname: `/${menu.url}`,
                                                            state: location.state,
                                                        }}
                                                    >{menu.name}</Link></Menu.Item>
                                                ))}
                                            </SubMenu>
                                        )
                                    }
                                    return (
                                        <Menu.Item key={subMenu.url}>
                                            <Link to={{
                                                pathname: `/${subMenu.url}`,
                                                state: location.state,
                                            }}>
                                                <Icon type={subMenu.icon} /><span className="nav-text">{subMenu.name}</span>
                                            </Link>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </Menu>
                        <div className="switch">
                            <Switch
                                checked={this.state.theme === 'dark'}
                                onChange={this.changeTheme}
                                checkedChildren="Dark"
                                unCheckedChildren="Light"
                            />
                        </div>
                    </Sider>
                    <Layout style={{ height: '100%' }}>
                        <Top toggle={this.toggle} collapsed={this.state.collapsed} clear={this.clear} data={location.state} />
                        <Contents/>
                        <Footer />
                    </Layout>
                </Layout>
            </div>
        );
    }
}
withRouter(MainApp)