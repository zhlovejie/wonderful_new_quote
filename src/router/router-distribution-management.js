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

export default { //物流管理

  path: '/distribution-management',
  name: 'distribution-management',
  component: PageView,
  meta: {
    title: '物流管理',
    icon: 'shop',
    permission: ['permission']
  },
  redirect: '/distribution-management',
  children: [{
      path: '/distribution-management/Distribution',
      name: 'distribution_Distribution',
      component: () => import('@/views/distribution-management/Distribution/Distribution_List'),
      meta: {
        title: '配货站信息登记',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/distribution-management/logistics',
      name: 'distribution_logistics',
      component: () => import('@/views/distribution-management/logistics/logistics_List'),
      meta: {
        title: '物流信息登记',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/distribution-management/logistics/module',
      name: 'basicInform',
      hidden: true,
      component: () => import('@/views/distribution-management/logistics/module/AddForm'),
      meta: {
        title: '新增物流信息登记',
        permission: ['permission']
      },
    },
    {
      path: '/distribution-management/Invoice',
      name: 'distribution_Invoice',
      component: () => import('@/views/distribution-management/Invoice/List'),
      meta: {
        title: '发货单',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
  ]
}
