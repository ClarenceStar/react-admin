export const allMenu = [
    {
        name: '首页',
        url: '404',
        icon: 'home',
    }, 
    {
        name: '博客模块',
        url: 'blog',
        icon: 'message',
        children: [
            { name: '个人博客', url: 'comment' },
        ]
    },
    {
        name: '项目地址',
        url: 'follow',
        icon: 'user',
    }, {
        name: '音乐模块',
        url: 'music',
        icon: 'bars',
        children: [
            { name: '音乐系列', url: 'music' },
        ]
    },{
        name: '工具模块',
        url: 'tool',
        icon: 'tool',
        children: [
            { name: '小应用', url: 'tools' },
            { name: '时钟', url: 'clock' },
        ],
    },
]