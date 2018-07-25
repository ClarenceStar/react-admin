export const allMenu = [
  { name: '首页模块', url: 'main', icon: 'home' },
  {
    name: '博客模块',
    url: 'blog',
    icon: 'message',
    children: [
      {
        name: '个人博客',
        url: 'comment',
        icon: 'star',
        children: [
          { name: 'hehe', url: 'hehe', icon: 'star' },
          { name: 'haha', url: 'haha', icon: 'star' }
        ]
      }
    ]
  },
  { name: '项目地址', url: 'follow', icon: 'user' },
  {
    name: '音乐模块',
    url: 'music',
    icon: 'bars',
    children: [{ name: '音乐系列', url: 'musicstyle', icon: 'star' }]
  },
  {
    name: '工具模块',
    url: 'tool',
    icon: 'tool',
    children: [
      { name: '小应用', url: 'tools', icon: 'star' },
      { name: '时钟', url: 'clock', icon: 'star' }
    ]
  }
]
