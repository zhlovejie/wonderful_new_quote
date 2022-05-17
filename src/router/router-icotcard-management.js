// eslint-disable-next-line
import { PageView } from '@/layouts'

export default {
  // 物联卡管理
  path: '/icotcard-management',
  name: 'icotcard-management',
  component: PageView,
  meta: {
    title: '物联网卡管理',
    icon: 'setting',
    permission: ['permission']
  },
  redirect: '/canteen-menu-management/config',
  children: [
    {
      path: '/icotcard-management/mycard',
      name: 'icotcard-management-mycard',
      component: () => import('@/views/icotcard-management/mycard/List'),
      meta: {
        title: '我的卡片',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    }
  ]
}
