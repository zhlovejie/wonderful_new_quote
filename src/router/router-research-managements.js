// eslint-disable-next-line
import {BasicLayout,BlankLayout,PageView,RouteView,UserLayout } from '@/layouts'
import {bxAnaalyse } from '@/core/icons'

export default {//研发管理
        
  path: '/research-managements',
  name: 'research-managements',
  component: PageView,
  meta: {
    title: '研发管理',
    icon: 'shop',
    permission: ['permission']
  },
  redirect: '/research-managements/drawing-managements/permissions',
  children: [{
    path: '/research-managements/drawing-managements',
    name: 'research-managements-drawing-managements',
    component: RouteView,
    meta: {
      title: '图纸管理',
      icon: 'select',
      keepAlive: false,
      permission: ['permission']
    },
    children: [{
        path: '/research-managements/drawing-managements/permissions',
        name: 'research-managements-drawing-managements-permissions',
        component: () => import('@/views/research-managements/drawing-managements/permissions/List'),
        meta: {
          title: '图纸权限',
          icon: 'setting',
          keepAlive: false,
          permission: ['permission']
        },
      },
      {
        path: '/research-managements/drawing-managements/management',
        name: 'research-managements-drawing-managements-management',
        component: () => import('@/views/research-managements/drawing-managements/management/List'),
        meta: {
          title: '图纸管理',
          icon: 'profile',
          keepAlive: false,
          permission: ['permission']
        },
      }
    ]
  }]
}