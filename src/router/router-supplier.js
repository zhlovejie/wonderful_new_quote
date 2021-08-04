// eslint-disable-next-line
import {
  BasicLayout,
  BlankLayout,
  PageView,
  RouteView,
  UserLayout
} from '@/layouts'
import {
  bxAnaalyse
} from '@/core/icons'

export default { //供应商管理
  path: '/supplier',
  name: 'supplier',
  component: PageView,
  meta: {
    title: '供应商管理',
    icon: 'account-book',
    permission: ['permission']
  },
  redirect: '/supplier/list',
  children: [{
      path: '/supplier/list',
      name: 'SupplierList',
      component: () => import('@/views/supplier/List'),
      meta: {
        title: '供应商管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },

  ]
}