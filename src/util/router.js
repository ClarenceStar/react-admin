import dynamic from 'dva/dynamic';
import { createElement } from 'react';

let routerDataCache;

const modelNotExisted = (app, model) =>
    // eslint-disable-next-line
    !app._models.some(({ namespace }) => {
        return namespace === model.substring(model.lastIndexOf('/') + 1);
    });
const dynamicWrapper = (app, models, component) => {
    // () => require('module')
    // transformed by babel-plugin-dynamic-import-node-sync
    if (component.toString().indexOf('.then(') < 0) {
        models.forEach(model => {
            if (modelNotExisted(app, model)) {
                // eslint-disable-next-line
                app.model(require(`../pages/${model}/index.js`).default);
            }
        });
        return props => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return createElement(component().default, {
                ...props,
                routerData: routerDataCache,
            });
        };
    }
    // () => import('module')
    return dynamic({
        app,
        models: () =>
            models.filter(model => modelNotExisted(app, model)).map(m => import(`../pages/${m}/index.js`)),
        // add routerData prop
        component: () => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return component().then(raw => {
                const Component = raw.default || raw;
                return props =>
                    createElement(Component, {
                        ...props,
                        routerData: routerDataCache,
                    });
            });
        },
    });
};

export const getRouterData = app => {
    const routerConfig = {
        '/forget': {
            component: dynamicWrapper(app, ['form'], () => import('../pages/forgetPwd')),
        },
        '/forget/info': {
            name: '分步表单（填写转账信息）',
            component: dynamicWrapper(app, ['form'], () => import('../pages/forgetPwd/Step1')),
        },
        '/forget/confirm': {
            name: '分步表单（确认转账信息）',
            component: dynamicWrapper(app, ['form'], () => import('../pages/forgetPwd/Step2')),
        },
        '/forget/result': {
            name: '分步表单（完成）',
            component: dynamicWrapper(app, ['form'], () => import('../pages/forgetPwd/Step3')),
        }
    }
}