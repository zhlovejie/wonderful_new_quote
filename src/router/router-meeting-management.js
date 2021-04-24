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
    },
    {
      path: '/meeting-management/monitor',
      name: 'meetingManagementMonitor',
      component: () => import('@/views/meeting-management/monitor/List'),
      meta: {
        title: '会议监控',
        icon: 'video-camera',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/meeting-management/penalty-rules',
      name: 'meeting-penalty-rules',
      component: () => import('@/views/meeting-management/penalty-rules/List'),
      meta: {
        title: '会议罚款规则',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/meeting-management/meeting-leave-record',
      name: 'meeting-leave-record',
      component: () => import('@/views/meeting-management/meeting-leave/List'),
      meta: {
        title: '会议请假记录',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
  ]
}
