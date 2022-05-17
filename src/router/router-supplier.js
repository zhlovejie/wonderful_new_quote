// eslint-disable-next-line
import { PageView } from '@/layouts'

export default {
  //供应商管理
  path: '/supplier',
  name: 'supplier',
  component: PageView,
  meta: {
    title: '供应商管理',
    icon: 'account-book',
    permission: ['permission']
  },
  redirect: '/supplier/list',
  children: [
    {
      path: '/supplier/list',
      name: 'SupplierList',
      component: () => import('@/views/supplier/List'),
      meta: {
        title: '供应商管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/supplier/list/modules',
      name: 'Supplierdetails',
      component: () => import('@/views/supplier/modules/details'),
      meta: {
        title: '供应商详情',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    }
  ]
}
