// eslint-disable-next-line
import { PageView, RouteView } from '@/layouts'

export default {
  //BOM管理
  path: '/bom-management',
  name: 'bom-management',
  component: PageView,
  meta: {
    title: 'BOM管理',
    icon: 'setting',
    permission: ['permission']
  },
  redirect: '/bom-management/list',
  children: [
    {
      path: '/bom-management/list',
      name: 'bom-management_list',
      component: () => import('@/views/bom-management/List'),
      meta: {
        title: 'BOM资料',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: []
    },
    {
      path: '/bom-management/approval',
      name: 'bom-management_approval',
      component: RouteView,
      meta: {
        title: 'BOM审核',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [
        {
          path: '/bom-management/approval/mysubmit',
          name: 'bom-management_approval_mysubmit',
          component: () => import('@/views/bom-management/ApprovalList'),
          meta: {
            title: '我提交的',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/bom-management/approval/myaction',
          name: 'bom-management_approval_myaction',
          component: () => import('@/views/bom-management/ApprovalList'),
          meta: {
            title: '待我处理的',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/bom-management/comprehensive',
      name: 'bom-management_comprehensive',
      component: () => import('@/views/bom-management/ComprehensiveList'),
      meta: {
        title: 'BOM综合',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: []
    },
    {
      path: '/bom-management/diff',
      name: 'bom-management_diff',
      component: () => import('@/views/bom-management/DiffList'),
      meta: {
        title: 'BOM差异分析',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: []
    }
  ]
}
