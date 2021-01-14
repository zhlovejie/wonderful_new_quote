// eslint-disable-next-line
import {
  BasicLayout,
  BlankLayout,
  PageView,
  RouteView,
  UserLayout
} from '@/layouts'
import {
  bxAnaalyse
} from '@/core/icons'


export default { //人力资源

  path: '/access_control',
  name: 'access_control',
  component: PageView,
  meta: {
    title: '门禁管理',
    icon: 'idcard',
    permission: ['permission']
  },
  redirect: '/access_control',
  children: [{
      path: '/access_control/vehicle_barrier',
      name: 'access_control_vehicle_barrier',
      component: RouteView,
      meta: {
        title: '车辆道闸管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/access_control/vehicle_barrier/Vehicle_List',
      children: [{
          path: '/access_control/vehicle_barrier/Vehicle_List',
          name: 'access_control_vehicleList',
          component: () => import('@/views/access_control/vehicle_barrier/Vehicle_List'),
          meta: {
            title: '车辆列表',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/access_control/vehicle_barrier/Vehicle_information',
          name: 'access_control_Vehicle_information',
          component: () => import('@/views/access_control/vehicle_barrier/Vehicle_information'),
          meta: {
            title: '车辆信息',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },

      ]
    },

    {
      path: '/access_control/office_gate',
      name: 'access_control_office_gate',
      component: RouteView,
      meta: {
        title: '办公室门闸管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/access_control/office_gate/Gate_equipment_List',
      children: [{
          path: '/access_control/office_gate/Gate_equipment_List',
          name: 'access_office_equipment',
          component: () => import('@/views/access_control/office_gate/Gate_equipment_List'),
          meta: {
            title: '门闸设备列表',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/access_control/office_gate/Gate_information',
          name: 'access_office_information',
          component: () => import('@/views/access_control/office_gate/Gate_information'),
          meta: {
            title: '门闸信息',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },

      ]
    },

    {
      path: '/access_control/sidewalk_gate',
      name: 'access_control_sidewalk_gate',
      component: RouteView,
      meta: {
        title: '人行道闸管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/access_control/sidewalk_gate/sidewalk_gate_List',
      children: [{
          path: '/access_control/sidewalk_gate/sidewalk_gate_List',
          name: 'access_sidewalk',
          component: () => import('@/views/access_control/sidewalk_gate/sidewalk_gate_List'),
          meta: {
            title: '人行道闸信息',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },

      ]
    },

  ]
}
