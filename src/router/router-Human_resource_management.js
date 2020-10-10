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

export default { //人力资源管理 

  path: '/Human-resource-management',
  name: 'Human-resource-management',
  component: PageView,
  meta: {
    title: '人力资源管理',
    icon: 'shop',
    permission: ['permission']
  },
  redirect: '/Human-resource-management',
  children: [{
      path: '/Human-resource-management/senior_worker',
      name: 'Human_senior_worker',
      component: () => import('@/views/Human-resource-management/senior_worker/senior_worker_List'),
      meta: {
        title: '高级工程师管理 ',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/Human-resource-management/shuttle_Bus',
      name: 'Human_shuttle_Bus',
      component: () => import('@/views/Human-resource-management/shuttle_Bus/shuttle_Bus_List'),
      meta: {
        title: '申请班车记录',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    }
  ]
}
