// eslint-disable-next-line
import { PageView, RouteView } from '@/layouts'

export default {
  //车辆管理

  path: '/vehicle-management',
  name: 'vehicle-management',
  component: PageView,
  meta: {
    title: '车辆管理',
    icon: 'car',
    permission: ['permission']
  },
  redirect: '/vehicle-management/car-info-list',
  children: [
    {
      path: '/vehicle-management/car-info-list',
      name: 'vehicle-management-car-info-list',
      component: () => import('@/views/vehicle-management/car-info-list/List'),
      meta: {
        title: '车辆信息',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/vehicle-management/gas-card',
      name: 'vehicle-management-gas-card',
      component: () => import('@/views/vehicle-management/gas-card/List'),
      meta: {
        title: '油卡管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/vehicle-management/use-record',
      name: 'vehicle-management-use-record',
      component: () => import('@/views/vehicle-management/use-record/List'),
      meta: {
        title: '用车记录',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/vehicle-management/author-record',
      name: 'vehicle-management-author-record',
      component: () => import('@/views/vehicle-management/author-record/List'),
      meta: {
        title: '驾驶权限记录',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/vehicle-management/supervision',
      name: 'vehicle-management-supervision',
      component: RouteView,
      meta: {
        title: '车辆监管',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/vehicle-management/supervision/gas-record',
      children: [
        {
          path: '/vehicle-management/supervision/gas-record',
          name: 'vehicle-management-supervision-gas-record',
          component: () => import('@/views/vehicle-management/supervision/gas-record/List'),
          meta: {
            title: '加油记录',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
        },

        {
          path: '/vehicle-management/supervision/fix-record',
          name: 'vehicle-management-supervision-fix-record',
          component: () => import('@/views/vehicle-management/supervision/fix-record/List'),
          meta: {
            title: '维修记录',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
        },

        {
          path: '/vehicle-management/supervision/maintenance-record',
          name: 'vehicle-management-supervision-maintenance-record',
          component: () => import('@/views/vehicle-management/supervision/maintenance-record/List'),
          meta: {
            title: '保养记录',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
        },

        {
          path: '/vehicle-management/supervision/accident-record',
          name: 'vehicle-management-supervision-accident-record',
          component: () => import('@/views/vehicle-management/supervision/accident-record/List'),
          meta: {
            title: '违法/事故记录',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
        },

        {
          path: '/vehicle-management/supervision/issues-record',
          name: 'vehicle-management-supervision-issues-record',
          component: () => import('@/views/vehicle-management/supervision/issues-record/List'),
          meta: {
            title: '车辆问题上报记录',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/vehicle-management/supervision/travelPath',
          name: 'vehicle-management-supervision-travelPath',
          component: () => import('@/views/vehicle-management/supervision/travelPath/travelPathList'),
          meta: {
            title: '行程轨迹 ',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    }
  ]
}
