import { Form, Input, Tooltip, Icon, Checkbox, Button } from 'antd';
import React, { Component } from "react";
import constants from '../../constants'
import { post, success, error } from '../../util/utils'
import history from '../../util/history';
import './index.less'

const FormItem = Form.Item;

class RegisterApp extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                const url = `${constants.IP}/user`;
                const formData = new FormData();
                formData.append('method', "register");
                formData.append('userName', values.userName);
                formData.append('passWord', values.passWord);
                post(url, formData)
                    .then(response => response.json())
                    .then((json) => {
                        if (json.status === '1') {
                            success('注册成功')
                            history.push("/login");
                        } else {
                            error('注册失败')
                        }
                    })
                    .catch((err) => {
                        error("连接服务器失败" + err)
                    });
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('passWord')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }
    checkAgreement = (rule, value, callback) => {
        const form = this.props.form;
        if (form.getFieldValue('agreement')) {
            callback();
            return
        } else {
            callback('Please check the agreement!');
        }
    }
    validateToNextPassword = ( value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    handleBack = () => {
        history.push("/login");
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };


        return (
            <Form onSubmit={this.handleSubmit} id="register-form">
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                            Username&nbsp;
              <Tooltip title="The unique property?">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Password"
                >
                    {getFieldDecorator('passWord', {
                        rules: [{
                            required: true, message: 'Please input your password!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Confirm Password"
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: 'Please confirm your password!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    {getFieldDecorator('agreement', {
                        rules: [{ required: true }, { validator: this.checkAgreement }],
                    })(
                        <Checkbox>I have read the <a href="">agreement</a></Checkbox>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">Register</Button>
                    <Button type="primary" onClick={this.handleBack} style={{ marginLeft: '40px' }}>返回</Button>
                </FormItem>
            </Form>
        );
    }
}

const RegisterForm = Form.create()(RegisterApp);
export default RegisterForm