// eslint-disable-next-line
import {BasicLayout,BlankLayout,PageView,RouteView,UserLayout } from '@/layouts'
import {bxAnaalyse } from '@/core/icons'

export default {
  path: '/dashboard',
  name: 'dashboard',
  redirect: '/dashboard/workplace',
  component: RouteView,
  hideChildrenInMenu: false,
  meta: {
    title: '万德福',
    keepAlive: true,
    icon: bxAnaalyse,
    permission: ['dashboard']
  },
  children: [{
      path: '/dashboard/analysis',
      name: 'Analysis',
      hidden: true,
      component: () => import('@/views/dashboard/Analysis'),
      meta: {
        title: '分析页',
        keepAlive: false,
        permission: ['dashboard']
      }
    },
    // 外部链接：万德福官网链接
    {
      path: 'http://www.xzwonderful.com/',
      name: 'Monitor',
      hidden: true,
      meta: {
        title: '监控页（外部）',
        target: '_blank'
      }
    },
    {
      path: '/dashboard/workplace',
      name: 'Workplace',
      component: () => import('@/views/dashboard/Workplace'),
      meta: {
        title: '万德福云',
        keepAlive: true,
        permission: ['dashboard']
      }
    }
  ]
}