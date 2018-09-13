
import React from 'react'
import LoginApp from './pages/login'
import RegisterApp from './pages/register'
import MainApp from './pages/main';
import ForgetApp from './pages/forgetPwd'
import ProfileApp from './pages/profile'
import './index.less'
import {
    Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import history from './util/history';
const location = history.location
let router = (
    <Router history={history}>
        <div>
            <Switch>
                <Route path="/login" component={LoginApp} />
                <Route path="/register" component={RegisterApp} />
                <Route path="/forget" component={ForgetApp} />
                <Route path="/profile" component={ProfileApp}/>
                <Route path="/" component={MainApp} />
            </Switch>
            {location.pathname === '/' ? <Redirect to='/login' /> : ''}
        </div>
    </Router>
)
export default router
