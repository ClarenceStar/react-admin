import React, { PureComponent, Fragment } from 'react';
import { Route, Switch, Redirect } from 'dva/router';
import { Card, Steps } from 'antd';
import styles from './index.less';
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'


const { Step } = Steps

export default class StepForm extends PureComponent {
    getCurrentStep() {
        const { location } = this.props;
        console.log(location)
        const { pathname } = location;
        const pathList = pathname.split('/');
        switch (pathList[pathList.length - 1]) {
            case 'step1':
                return 0;
            case 'step2':
                return 1;
            case 'step3':
                return 2;
            default:
                return 0;
        }
    }

    render() {
        return (
            <Card bordered={false} title='忘记密码' style={{ width: '500px', margin: '0 auto' }}>
                <Fragment>
                    <Steps current={this.getCurrentStep()} className={styles.steps}>
                        <Step title="确认用户名" />
                        <Step title="验证用户名" />
                        <Step title="完成" />
                    </Steps>
                    <div style = {{marginTop:'50px'}}>
                        <Switch>
                            <Route path="/forget/step1" component={Step1} />
                            <Route path="/forget/step2" component={Step2} />
                            <Route path="/forget/step3" component={Step3} />
                            <Redirect exact from="/forget" to="/forget/step1" />
                        </Switch>
                    </div>
                </Fragment>
            </Card>
        );
    }
}
