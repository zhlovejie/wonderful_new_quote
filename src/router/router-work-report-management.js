// eslint-disable-next-line
import { PageView } from '@/layouts'

export default {
  //工作上报管理
  path: '/work-report-management',
  name: 'work-report-management',
  component: PageView,
  meta: {
    title: '工作上报管理',
    icon: 'dollar',
    permission: ['permission']
  },
  redirect: '/work-report-management',
  children: [
    {
      path: '/work-report-management/report-set',
      name: 'wrm-report-set',
      component: () => import('@/views/work-report-management/report-set/List'),
      meta: {
        title: '工作上报设置',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/work-report-management/report-daily-set',
      name: 'wrm-report-daily-set',
      component: () => import('@/views/work-report-management/report-daily-set/List'),
      meta: {
        title: '日报',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/work-report-management/report-week-set',
      name: 'wrm-report-week-set',
      component: () => import('@/views/work-report-management/report-week-set/List'),
      meta: {
        title: '周报',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/work-report-management/report-month-set',
      name: 'wrm-report-month-set',
      component: () => import('@/views/work-report-management/report-month-set/List'),
      meta: {
        title: '月报',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    }
  ]
}
