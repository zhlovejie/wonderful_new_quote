// eslint-disable-next-line
import {BasicLayout,BlankLayout,PageView,RouteView,UserLayout } from '@/layouts'
import {bxAnaalyse } from '@/core/icons'

export default {//会议管理
  path: '/meeting-management',
  name: 'meeting-management',
  component: PageView,
  meta: {
    title: '会议管理',
    icon: 'team',
    permission: ['permission']
  },
  redirect: '/meeting-management/settings',
  children: [{
      path: '/meeting-management/settings',
      name: 'meetingManagementSettings',
      component: () => import('@/views/meeting-management/settings/List'),
      meta: {
        title: '会议设置',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/meeting-management/records',
      name: 'meetingManagementRecords',
      component: () => import('@/views/meeting-management/records/List'),
      meta: {
        title: '会议记录',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    }
  ]
}