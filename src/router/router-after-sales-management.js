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


export default { //售后管理

  path: '/after-sales-management',
  name: 'after-sales-management',
  component: PageView,
  meta: {
    title: '售后管理',
    icon: 'idcard',
    permission: ['permission']
  },
  redirect: '/after-sales-management',
  children: [{
      path: '/after-sales-management/analysis',
      name: 'after-sales-management_analysis',
      component: () => import('@/views/after-sales-management/analysis/List'),
      meta: {
        title: '售后分析',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/after-sales-management/equipment',
      name: 'after-sales-management_equipment',
      component: () => import('@/views/after-sales-management/equipment/List'),
      meta: {
        title: '设备档案',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },


    {
      path: '/after-sales-management/taskList',
      name: 'after-sales-management_taskList',
      component: RouteView,
      meta: {
        title: '任务单',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/after-sales-management/taskList/repair/List',
      children: [{
          path: '/after-sales-management/taskList/repair',
          name: 'access_office_repair',
          component: () => import('@/views/after-sales-management/taskList/repair/List'),
          meta: {
            title: '维修任务单申请',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/after-sales-management/taskList/detailed',
          name: 'access_office_detailed',
          component: () => import('@/views/after-sales-management/taskList/detailed/List'),
          meta: {
            title: '任务单明细',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/after-sales-management/taskList/My-mission',
          name: 'access_office_My-mission',
          component: () => import('@/views/after-sales-management/taskList/My-mission/List'),
          meta: {
            title: '我的任务单',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },

      ]
    },
    {
      path: '/after-sales-management/Network',
      name: 'after-sales-management_Network',
      component: RouteView,
      meta: {
        title: '网点管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/after-sales-management/Network/networkManagement/List',
      children: [{
          path: '/after-sales-management/Network/networkManagement',
          name: 'access_sidewalk_networkManagement',
          component: () => import('@/views/after-sales-management/Network/networkManagement/List'),
          meta: {
            title: '网点管理',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/after-sales-management/Network/enterprise',
          name: 'access_sidewalk_enterprise',
          component: () => import('@/views/after-sales-management/Network/enterprise/List'),
          meta: {
            title: '企业网点申请',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        }, {
          path: '/after-sales-management/Network/payment',
          name: 'access_sidewalk_payment',
          component: () => import('@/views/after-sales-management/Network/payment/List'),
          meta: {
            title: '网点付款记录',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
      ]
    },
    {
      path: '/after-sales-management/parts',
      name: 'after-sales-management_parts',
      component: RouteView,
      meta: {
        title: '售后配件管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/after-sales-management/parts/detailedList/List',
      children: [{
          path: '/after-sales-management/parts/detailedList',
          name: 'access_sidewalk_detailedList',
          component: () => import('@/views/after-sales-management/parts/detailedList/List'),
          meta: {
            title: '配件清单',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/after-sales-management/parts/mail',
          name: 'access_sidewalk_mail',
          component: () => import('@/views/after-sales-management/parts/mail/List'),
          meta: {
            title: '邮件记录',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        }, {
          path: '/after-sales-management/parts/collectionDetails',
          name: 'access_sidewalk_collectionDetails',
          component: () => import('@/views/after-sales-management/parts/collectionDetails/List'),
          meta: {
            title: '配件收款明细',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
      ]
    },
  ]
}
