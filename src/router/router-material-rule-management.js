// eslint-disable-next-line
import {
  PageView,
  RouteView
} from '@/layouts'

export default {
  path: '/material-rule-management',
  name: 'material-rule-management',
  component: PageView,
  meta: {
    title: '物料管理',
    icon: 'setting',
    permission: ['permission']
  },
  redirect: '/material-rule-management/rule',
  children: [{
      path: '/material-rule-management/rule',
      name: 'material-rule-management-rule',
      redirect: '/material-rule-management/rule/routine',
      component: RouteView,
      meta: {
        title: '规则',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/material-rule-management/rule/routine',
          name: 'material-rule-management-routine',
          component: () => import('@/views/material-management/rule/RoutineList'),
          meta: {
            title: '常规物料规则',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/material-rule-management/rule/finished-product',
          name: 'material-rule-management-finished-product',
          component: () => import('@/views/material-management/rule/FinishedProductList'),
          meta: {
            title: '成品物料规则',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/material-rule-management/audit/routine',
      name: 'material-rule-management-audit-routine',
      component: () => import('@/views/material-management/audit/RoutineList'),
      meta: {
        title: '常规物料规则审核',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
      props:true
    },
    {
      path: '/material-rule-management/audit/finished-product',
      name: 'material-rule-management-audit-finished-product',
      component: () => import('@/views/material-management/audit/FinishedProductList'),
      meta: {
        title: '成品物料规则审核',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
      props:true
    }
  ]
}
