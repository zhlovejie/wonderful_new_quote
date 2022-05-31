// eslint-disable-next-line
import {
  BasicLayout,
  BlankLayout,
  PageView,
  RouteView,
  UserLayout
} from '@/layouts'

export default { //委外管理
  path: '/router-outsourcing-management',
  name: 'router-outsourcing-management',
  component: PageView,
  redirect: '/router-outsourcing-management/fac-info',
  meta: {
    title: '委外管理',
    icon: 'dollar',
    permission: ['permission']
  },
  children: [
    {
      path: '/router-outsourcing-management/fac-info',
      name: 'outsourcing-fac-info',
      component: () => import('@/views/router-outsourcing-management/fac-info/List'),
      meta: {
        title: '加工商信息',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/router-outsourcing-management/fac-info-need',
      name: 'outsourcing-fac-info-need',
      component: () => import('@/views/router-outsourcing-management/fac-info-need/List'),
      meta: {
        title: '加工需求单',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/router-outsourcing-management/order-change',
      name: 'outsourcing-order-change',
      component: RouteView,
      meta: {
        title: '加工需求变更单',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/router-outsourcing-management/order-change/refuelling',
      children: [
        {
          path: '/router-outsourcing-management/order-change/refuelling',
          name: 'outsourcing-order-change-refuelling',
          component: () => import('@/views/router-outsourcing-management/order-change/refuelling/List'),
          meta: {
            title: '换料单',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/router-outsourcing-management/order-change/working',
          name: 'outsourcing-order-change-working',
          component: () => import('@/views/router-outsourcing-management/order-change/working/List'),
          meta: {
            title: '工序变更单',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    }
  ]
}
