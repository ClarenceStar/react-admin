import { Form, Icon, Input, Button, Checkbox } from 'antd';
import React, { Component } from "react";
import './index.less'
import constants from '../../constants'
import history from '../../util/history';
import { post, success, error } from '../../util/utils'
import { Link } from 'dva/router';

const FormItem = Form.Item;

class LoginApp extends Component {
    state = {
        data:{}
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields({ force: true },
            (err, values) => {
                if (!err) {
                    const url = `${constants.IP}/user`;
                    const formData = new FormData();
                    formData.append('method', "login");
                    formData.append('userName', values.userName);
                    formData.append('passWord', values.passWord);
                    post(url, formData)
                        .then(response => response.json())
                        .then((json) => {
                            if (json.status === '1') {
                                this.setState({
                                    data:json.data
                                })
                                success("登录成功")
                                var path = {
                                    pathname: '/main',
                                    state: this.state.data,
                                }
                                history.push(path);
                            } else {
                                error("用户名密码错误")
                            }
                        })
                        .catch((err) => {
                            error("连接服务器失败" + err)
                        });
                }
            }
        );
    }
    handleRegister = () => {
        history.push('/register')
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{
                backgroundImage: "url(" + require("../../images/18004.jpg") + ")", height: '100%',
                width: '100%',
                position: 'absolute',
                top: '0px',
                bottom: '0px'
            }}>
                <Form onSubmit={this.handleSubmit} id="login-form">
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('passWord', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                        <Link className="login-form-forgot" to='/forget' >Forgot password</Link>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Login
                        </Button>
                        <Button type="primary" htmlType="button" className="login-form-button" onClick={this.handleRegister}>
                            Register
                        </Button>
                    </FormItem>
                </Form>
            </div>

        );
    }
}

const LoginForm = Form.create()(LoginApp);
export default LoginForm
