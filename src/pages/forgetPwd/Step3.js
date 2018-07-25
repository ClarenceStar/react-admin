import React, { Fragment, PureComponent } from 'react'
import { Button, Row, Col } from 'antd'
import Result from '../../components/Result'
import styles from './index.less'
import history from '../../util/history'
class Step3 extends PureComponent {
  componentDidMount() {
    this.timer = setTimeout(() => {
      history.push('/login')
    }, 3000)
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }
  render() {
    const { location } = this.props
    const onFinish = () => {
      history.goBack()
    }
    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            用户名:
          </Col>
          <Col xs={24} sm={16}>
            {location.state.userName}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            请牢记新密码
          </Col>
          <Col xs={24} sm={16}>
            {location.state.passWord}
          </Col>
        </Row>
      </div>
    )
    const actions = (
      <Fragment>
        <Button type="primary" style={{marginTop:'10px'}} onClick={onFinish}>
          返回
        </Button>
      </Fragment>
    )
    return (
      <Result
        type="success"
        title={
          <div style={{ background: '#7dbcea', color: '#fff' }}>操作成功</div>
        }
        description={
          <div style={{ background: 'rgba(16, 142, 233, 1)', color: '#fff' }}>
            请使用新密码登录
          </div>
        }
        extra={information}
        actions={actions}
        className={styles.result}
      />
    )
  }
}

export default Step3
