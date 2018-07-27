export const allMenu = [
  { name: '首页模块', url: 'main', icon: 'home' },
  {
    name: '博客模块',
    url: 'blog',
    icon: 'message',
    children: [
      {
        name: '个人博客',
        url: 'blog/comment',
        icon: 'star',
        children: [
          { name: 'hehe', url: 'blog/comment/hehe', icon: 'star' },
          { name: 'haha', url: 'blog/comment/haha', icon: 'star' }
        ]
      }
    ]
  },
  { name: '项目地址', url: 'follow', icon: 'user' },
  {
    name: '音乐模块',
    url: 'music',
    icon: 'bars',
    children: [{ name: '音乐系列', url: 'music/musicstyle', icon: 'star' }]
  },
  {
    name: '工具模块',
    url: 'tool',
    icon: 'tool',
    children: [
      { name: '小工具', url: 'tool/tools', icon: 'star' },
      { name: '时钟', url: 'tool/clock', icon: 'star' }
    ]
  }
]
