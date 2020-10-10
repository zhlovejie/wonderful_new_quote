// eslint-disable-next-line
import {BasicLayout,BlankLayout,PageView,RouteView,UserLayout } from '@/layouts'
import {bxAnaalyse } from '@/core/icons'

export default {//应急管理
        
  path: '/contingency-management',
  name: 'contingency-management',
  component: PageView,
  meta: {
    title: '应急管理',
    icon: 'shop',
    permission: ['permission']
  },
  redirect: '/contingency-management/medicines',
  children: [{
      path: '/contingency-management/medicines',
      name: 'contingency-management-medicines',
      component: () => import('@/views/contingency-management/medicines/List'),
      meta: {
        title: '药品物资管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/contingency-management/medicines-cabinet-config',
      name: 'contingency-management-medicines-cabinet-config',
      component: () => import('@/views/contingency-management/medicines-cabinet-config/List'),
      meta: {
        title: '药品柜类型',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/contingency-management/medicines-cabinet',
      name: 'contingency-management-medicines-cabinet',
      component: () => import('@/views/contingency-management/medicines-cabinet/List'),
      meta: {
        title: '药品柜',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/contingency-management/medicines-record',
      name: 'contingency-management-medicines-record',
      component: () => import('@/views/contingency-management/medicines-record/List'),
      meta: {
        title: '领取记录',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
  ]
}