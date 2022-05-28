// eslint-disable-next-line
import { PageView } from '@/layouts'

export default {
  //采购模块
  path: '/procurement-module-management',
  name: 'procurement-module-management',
  redirect: '/procurement-module-management/apply',
  component: PageView,
  meta: {
    title: '采购管理',
    icon: 'dollar',
    permission: ['permission']
  },
  children: [
    {
      path: '/procurement-module-management/apply',
      name: 'procurement-module-management-apply',
      component: () => import('@/views/procurement-module-management/apply/List'),
      meta: {
        title: '采购申请',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/procurement-module-management/grab',
      name: 'procurement-module-management-grab',
      component: () => import('@/views/procurement-module-management/grab/List'),
      meta: {
        title: '采购抢单',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/procurement-module-management/order',
      name: 'procurement-module-management-order',
      component: () => import('@/views/procurement-module-management/order/List'),
      meta: {
        title: '采购下单/跟单',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/procurement-module-management/purchase-contract',
      name: 'procurement-module-management-purchase-contract',
      component: () => import('@/views/procurement-module-management/purchase-contract/List'),
      meta: {
        title: '采购合同',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/procurement-module-management/purchase-contract-action',
      name: 'procurement-module-management-purchase-contract-action',
      component: () => import('@/views/procurement-module-management/purchase-contract/modules/AddForm'),
      props: true,
      meta: {
        title: '采购合同',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/procurement-module-management/purchase-contract-preview',
      name: 'procurement-module-management-purchase-contract-preview',
      component: () => import('@/views/procurement-module-management/purchase-contract/modules/previewContract'),
      props: true,
      meta: {
        title: '预览采购合同',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    }
  ]
}
