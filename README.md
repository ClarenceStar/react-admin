## 后台管理系统框架(react版本)
为了方便以后的开发流程 开发了一套react为基础的后台管理系统框架
项目的整体结构如下所示

```
├── config                     webpack的一些配置
├── node_modules               node模块目录
├── public                     公共资源文件夹
├── scripts                    node的执行脚本
│   ├── build.js               构建服务
│   ├── start.js               启动服务
│   ├── test.js                测试服务
├── src                        所有和页面相关资源
│   ├── components             封装的一些组件库
│   ├── containers             一些容器文件 便于复用
│   ├── images                 图片资源文件夹
│   ├── pages                  所有页面文件(都包含两份文件)
│   │   ├── index.js           逻辑文件
│   │   ├── index.less         样式文件
│   ├── reducers               redux的reducer存放在这里
│   ├── store                  redux的store存放在这里
│   ├── util                   存放一些通用的工具类
├── constants.js               所有静态常量
├── index.js                   入口文件
├── index.less                 全局样式
├── .gitignore
├── app.js                     项目入口文件
├── package.json               
├── README.md
```

## Quick Start
* 项目拉下来之后 

    ```
    安装依赖
    yarn || npm install
    启动服务
    yarn || npm start
    ```
* 此单页面app可以配合后台使用 烦请各位移步至<br>[https://github.com/gj459395234/node-server]按照流程部署<br>
最终效果如下
![效果图](https://github.com/gj459395234/markdownimg/blob/master/react_admin.gif)
    
**demo**: [https://github.com/gj459395234/react-admin]<br>
有任何react方面问题可以加我git地址上企鹅联系我 欢迎探讨

