import React, { PureComponent } from 'react'
import { Form, Button, Alert, Input } from 'antd'
import history from '../../util/history'
import styles from './index.less'
import constants from '../../constants'
import { error, post } from '../../util/utils'
const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
}
class Step2 extends PureComponent {
  state = {
    loading: false,
    show: true
  }
  closeAlert() {
    this.setState({
      show: false
    })
  }
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.closeAlert()
    }, 4000)
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }
  handleBack = () => {
    history.push('/login')
  }
  render() {
    const { form, location } = this.props
    const { validateFields, getFieldDecorator } = form
    const onPrev = () => {
      history.push('/forget')
    }
    const onValidateForm = e => {
      e.preventDefault()
      this.setState({ loading: true })
      this.timer = setTimeout(() => {
        this.setState({ loading: false })
      }, 3000)
      validateFields((err, values) => {
        if (!err) {
          const url = `${constants.IP}/user`
          const formData = new FormData()
          formData.append('method', 'update')
          formData.append('userName', location.state)
          formData.append('passWord', values.passWord)
          post(url, formData)
            .then(response => response.json())
            .then(json => {
              if (json.status === '1') {
                var path = {
                  pathname: '/forget/step3',
                  state: { userName: location.state, passWord: values.passWord }
                }
                history.push(path)
              } else {
                error('修改失败')
              }
            })
            .catch(err => {
              error('连接服务器失败' + err)
            })
        }
      })
    }
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <div style={{ display: this.state.show ? 'block' : 'none' }}>
          <Alert
            showIcon
            message="修改密码成功后 请用新密码登录。"
            style={{ marginBottom: 24 }}
          />
        </div>
        <Form.Item {...formItemLayout} label="用户名">
          <Input defaultValue={location.state} disabled={true} />
        </Form.Item>
        <Form.Item {...formItemLayout} label="新密码">
          {getFieldDecorator('passWord', {
            rules: [{ required: true, message: '请输入新密码' }]
          })(<Input placeholder="请输入新密码" />)}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span
            }
          }}
        >
          <Button
            type="primary"
            onClick={onValidateForm}
            style={{ margin: '0 auto' }}
            loading={this.state.loading}
          >
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
const Step2Form = Form.create()(Step2)

export default Step2Form
