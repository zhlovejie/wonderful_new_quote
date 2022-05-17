// eslint-disable-next-line
import { PageView } from '@/layouts'

export default {
  //监控管理
  path: '/monitor-device-management',
  name: 'monitor-device-management',
  component: PageView,
  meta: {
    title: '监控管理',
    icon: 'team',
    permission: ['permission']
  },
  redirect: '/monitor-device-management/device-list',
  children: [
    {
      path: '/monitor-device-management/device-list',
      name: 'monitor-device-management-device-list',
      component: () => import('@/views/monitor-device-management/DeviceList'),
      meta: {
        title: '设备列表',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/monitor-device-management/device-monitor',
      name: 'monitor-device-management-device-monitor',
      component: () => import('@/views/monitor-device-management/MonitorList'),
      meta: {
        title: '监控画面',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    }
  ]
}
