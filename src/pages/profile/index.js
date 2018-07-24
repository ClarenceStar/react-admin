import React, { Component } from "react";
import { Form, Input, Tooltip, Icon, Upload, Cascader, Button, Radio } from 'antd';
import constants from '../../constants'
import { post, success, error } from '../../util/utils'
import history from '../../util/history'
import './index.less'
const FormItem = Form.Item;
const RadioGroup = Radio.Group
const options = [
    { label: '男', value: '男' },
    { label: '女', value: '女' },
];
const residences = constants.RESIDENCES

class ProfileApp extends Component {
    state = {
        fileList: [],
        uploading: false,
        password: '',
        loading: false
    }
    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        const userName = this.props.location.state.userName;
        const url = `${constants.IP}/user`
        fileList.forEach((file) => {
            formData.append('file', file);
        });
        formData.append('method', "upload");
        formData.append('userName', userName);
        this.setState({
            uploading: true,
        });
        post(url, formData)
            .then(response => response.json())
            .then((json) => {
                if (json.status === '1') {
                    this.setState({
                        fileList: [],
                        uploading: false,
                    });
                    success("上传成功")
                } else {
                    this.setState({
                        uploading: false,
                    });
                    error("上传失败")
                }
            }).catch((err) => {
                error("连接服务器失败" + err)
            });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            
            if (!err) {
                const userName = this.props.location.state;
                const url = `${constants.IP}/user`
                const formData = new FormData();
                formData.append('method', "edit");
                formData.append('userName', userName);
                formData.append('nickName', values.nickName);
                formData.append('gender', values.gender);
                formData.append('email', values.email);
                formData.append('residence', values.residence.join('-'));

                post(url, formData)
                    .then(response => response.json())
                    .then((json) => {
                        if (json.status === '1') {
                            success("更新成功")
                        } else {
                            error("更新失败")
                        }
                    }).catch((err) => {
                        error("连接服务器失败" + err)
                    });
            }
        });
    }
    handleBack = () => {
        const {location} = this.props
        const data = location.state
        var path = {
            pathname: '/404',
            state: data,
        }
        history.push(path);
    }
    modifyPwd = () => {
        this.setState({
            loading: true
        })
        this.timer = setTimeout(
            () => {
                this.setState({ loading: false });
            }, 1000
        )
        const password = this.state.password
        const { location } = this.props
        const data = location.state
        if (password !== '') {
            const url = `${constants.IP}/user`;
            const formData = new FormData();
            formData.append('method', "update");
            formData.append('userName', data.userName);
            formData.append('passWord', this.state.password);
            post(url, formData)
                .then(response => response.json())
                .then((json) => {
                    if (json.status === '1') {
                        success('修改成功')
                    } else {
                        error('修改失败')
                    }
                })
                .catch((err) => {
                    error("连接服务器失败" + err)
                });
        } else {
            error("请输入新密码")
        }

    }
    onChangePwd = (e) => {
        this.setState({ password: e.target.value });
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { uploading, password } = this.state;
        const props = {
            accept: "image/*",
            action: `${constants.IP}/user`,
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            fileList: this.state.fileList,
        };
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
            <div className="wrapper">
                <Form onSubmit={this.handleSubmit} id="profile-form">
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                                Nickname&nbsp;
              <Tooltip title="What do you want others to call you?">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        )}
                    >
                        {getFieldDecorator('nickName', {
                            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="Gender">
                        {getFieldDecorator('gender',
                            {
                                rules: [{ required: true, message: 'Please input your nickname!' }],
                                initialValue: '男'
                            })(
                                <RadioGroup options={options} />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="E-mail"
                        hasFeedback
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: 'The input is not valid E-mail!',
                            }, {
                                required: true, message: 'Please input your E-mail!',
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Habitual Residence"
                    >
                        {getFieldDecorator('residence', {
                            initialValue: ['江苏省', '淮安市', '清河区'],
                            rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
                        })(
                            <Cascader options={residences} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Portrait"
                        extra="支持各种图片格式"
                    >
                        {getFieldDecorator('portrait', {
                            getValueFromEvent: this.normFile,
                        })(
                            <div>
                                <Upload {...props}>
                                <Button style={{ width: '160px' }}>
                                        <Icon type="upload" /> Click to upload
                                        </Button>
                                </Upload>
                                <Button
                                    type="primary"
                                    onClick={this.handleUpload}
                                    disabled={this.state.fileList.length === 0}
                                    loading={uploading}
                                    style={{ width: '160px' }}>
                                    {uploading ? 'Uploading' : 'Start Upload'}
                                </Button>
                            </div>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Password"
                    >
                        {getFieldDecorator('password', )(
                            <div>
                                <Input value={password}
                                    onChange={this.onChangePwd} type="password" placeholder="请输入新密码" style={{ width: '250px' }} />
                                <Button onClick={this.modifyPwd} loading={this.state.loading} style={{ marginLeft: '18px' }}>修改</Button>
                            </div>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">更新</Button>
                        <Button type="primary" onClick={this.handleBack} style={{ marginLeft: '40px' }}>返回</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const ProfileForm = Form.create()(ProfileApp);

export default ProfileForm