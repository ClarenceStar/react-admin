import React, { Fragment, PureComponent } from 'react';
import { Button, Row, Col } from "antd";
import Result from '../../components/Result';
import styles from './index.less';
import history from '../../util/history'
class Step3 extends PureComponent {
  componentDidMount() {
    this.timer = setTimeout(
      () => {
        history.push('/login')
      },3000
    )
  }
  componentWillUnmount(){
    this.timer && clearTimeout(this.timer);
  }
  render() {
    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            用户名:
          </Col>
          <Col xs={24} sm={16}>
            gj
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            用户昵称：
          </Col>
          <Col xs={24} sm={16}>
            星河
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            请牢记新密码
          </Col>
          <Col xs={24} sm={16}>
            ***
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button>查看账单</Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description="预计两小时内到账"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default Step3
