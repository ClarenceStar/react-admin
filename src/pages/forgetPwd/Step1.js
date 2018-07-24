import React, { Fragment, PureComponent } from 'react';
import { Form, Input, Button, Divider, Row, Col, Icon, Tooltip } from 'antd';
import styles from './index.less';
import history from '../../util/history'
import VCode from '../../components/VCode'
import { error } from '../../util/utils'
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

class Step1 extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      captcha: ''
    }
  }
  onRef = (ref) => {
    this.VCode = ref
    this.setState({
      captcha: ref.state.data
    })
  }
  handleBack = () => {
    history.push("/login");
  }
  render() {
    const { form } = this.props;
    const { captcha } = this.state
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      var str = ""
      for (var i in captcha) {
        str += captcha[i]
      }
      validateFields((err, values) => {
        if (!err) {
          var code = str.toLowerCase(), input = values.captcha.toLowerCase();
          if (input === code) {
            var path = {
              pathname: '/forget/step2',
              state: values.userName,
            }
            history.push(path)
          } else {
            error("验证码错误 请重新输入")
          }
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="用户名">
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名' }],
            })(<Input placeholder="请输入用户名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label={(
            <span>
              验证码&nbsp;
              <Tooltip title="看不清?点击刷新">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}>
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('captcha', {
                  rules: [
                    { required: true, message: '请输入验证码' },
                    {
                      message: '验证码错误',
                    },
                  ],
                })(<Input placeholder="请输入验证码" />)}
              </Col>
              <Col span={12}>
                <VCode onRef={this.onRef}></VCode>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
          >
            <Button type="primary" onClick={onValidateForm} style={{ margin: '0 auto' }}>
              下一步
            </Button>
            <Button type="primary" onClick={this.handleBack} style={{ marginLeft: '40px' }}>返回</Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
      </Fragment>
    );
  }
}

const Step1Form = Form.create()(Step1);
export default Step1Form
