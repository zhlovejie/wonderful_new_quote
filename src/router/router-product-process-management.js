// eslint-disable-next-line
import {
  PageView,
  RouteView
} from '@/layouts'

export default { //工艺管理
  path: '/product-process-management',
  name: 'product-process-management',
  component: PageView,
  meta: {
    title: '工艺管理',
    icon: 'setting',
    permission: ['permission']
  },
  redirect: '/product-process-management/workshop-management',
  children: [{
      path: '/product-process-management/workshop-management',
      name: 'product-process-management_workshop-management',
      component: () => import('@/views/product-process-management/workshop/List'),
      meta: {
        title: '车间管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: []
    },
    {
      path: '/product-process-management/mould-management',
      name: 'product-process-management_mould-management',
      component: () => import('@/views/product-process-management/mould/List'),
      meta: {
        title: '模具管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/product-process-management/step-management',
      name: 'product-process-management_step-management',
      component: () => import('@/views/product-process-management/step/List'),
      meta: {
        title: '工序管理',
        icon: 'cluster',
        keepAlive: false,
        permission: ['permission']
      },
      children: []
    },
    {
      path: '/product-process-management/equipment-management',
      name: 'product-process-management_equipment-management',
      component: RouteView,
      meta: {
        title: '设备管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/product-process-management/equipment-management/list',
      children: [{
          path: '/product-process-management/equipment-management/list',
          name: 'product-process-management_equipment-management_list',
          component: () => import('@/views/product-process-management/equipment/List'),
          meta: {
            title: '设备列表',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: []
        },
        {
          path: '/product-process-management/equipment-management/fix',
          name: 'product-process-management_equipment-management_fix',
          component: () => import('@/views/product-process-management/equipment/FixList'),
          meta: {
            title: '设备维修记录',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: []
        },
        {
          path: '/product-process-management/equipment-management/maintenance',
          name: 'product-process-management_equipment-management_maintenance',
          component: () => import('@/views/product-process-management/equipment/MaintenanceList'),
          meta: {
            title: '设备保养日志',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: []
        },
      ]
    },

    {
      path: '/product-process-management/process-route-management',
      name: 'product-process-management_process-route-management',
      component: RouteView,
      meta: {
        title: '工艺路线管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/product-process-management/process-route-management/route',
      children: [{
          path: '/product-process-management/process-route-management/route',
          name: 'product-process-management_process-route-management_route',
          component: () => import('@/views/product-process-management/process-route/List'),
          meta: {
            title: '工艺路线',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: []
        },
        {
          path: '/product-process-management/process-route-management/approval',
          name: 'product-process-management_process-route-management_approval',
          component: RouteView,
          meta: {
            title: '工艺路线审核',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: [
            {
              path: '/product-process-management/process-route-management/approval/mysubmit',
              name: 'product-process-management_process-route-management_approval_mysubmit',
              component: () => import('@/views/product-process-management/process-route/Approval'),
              meta: {
                title: '我提交的',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              }
            },
            {
              path: '/product-process-management/process-route-management/approval/myaction',
              name: 'product-process-management_process-route-management_approval_myaction',
              component: () => import('@/views/product-process-management/process-route/Approval'),
              meta: {
                title: '待我处理的',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              }
            }
          ]
        }
      ]
    }
  ]
}
