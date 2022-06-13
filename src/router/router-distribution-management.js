// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView, UserLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export default {
  //物流管理

  path: '/distribution-management',
  name: 'distribution-management',
  component: PageView,
  meta: {
    title: '物流管理',
    icon: 'shop',
    permission: ['permission']
  },
  redirect: '/distribution-management',
  children: [
    {
      path: '/distribution-management/Distribution',
      name: 'distribution_Distribution',
      component: () => import('@/views/distribution-management/Distribution/Distribution_List'),
      meta: {
        title: '配货站信息登记',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/distribution-management/logistics',
      name: 'distribution_logistics',
      component: () => import('@/views/distribution-management/logistics/logistics_List'),
      meta: {
        title: '物流信息登记',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/distribution-management/logistics/module',
      name: 'basicInform',
      hidden: true,
      component: () => import('@/views/distribution-management/logistics/module/AddForm'),
      meta: {
        title: '新增物流信息登记',
        permission: ['permission']
      }
    },
    {
      path: '/distribution-management/Invoice',
      name: 'distribution_Invoice',
      component: () => import('@/views/distribution-management/Invoice/List'),
      meta: {
        title: '发货单',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/sale/invoice/modules',
      name: 'distribution_InvoiceModules',
      hidden: true,
      component: () => import('@/views/distribution-management/Invoice/modules/invoiceModules'),
      meta: {
        title: '发货单申请',
        permission: ['permission']
      }
    },
    {
      path: '/sale/invoice/modules',
      name: 'distribution_InvoiceApproval',
      hidden: true,
      component: () => import('@/views/distribution-management/Invoice/modules/invoiceApproval'),
      meta: {
        title: '发货单审批',
        permission: ['permission']
      }
    },
    {
      path: '/distribution-management/quotedPrice',
      name: 'distribution_quotedPrice',
      component: () => import('@/views/distribution-management/quotedPrice/List'),
      meta: {
        title: '物流报价记录',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/distribution-management/transport',
      name: 'distribution_transport',
      component: () => import('@/views/distribution-management/transport/List'),
      meta: {
        title: '我方货物运输记录',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/distribution-management/HandlingManagement',
      name: 'Handling_management',
      component: () => import('@/views/distribution-management/HandlingManagement/List'),
      meta: {
        title: '搬运管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/distribution-management/Return',
      name: 'distribution-management_Return',
      component: RouteView,
      meta: {
        title: '回访信息',
        icon: 'audit',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/distribution-management/Return/rule',
      children: [
        {
          path: '/distribution-management/Return/rule',
          name: 'distribution_management_rule',
          component: () => import('@/views/distribution-management/Return/rule/List'),
          meta: {
            title: '回访规则',
            icon: 'audit',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/distribution-management/Return/Additional',
          name: 'distribution_management_Additional',
          component: () => import('@/views/distribution-management/Return/Additional/List'),
          meta: {
            title: '回访记录',
            icon: 'audit',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/distribution-management/expense',
      name: 'distribution-management_expense',
      component: RouteView,
      meta: {
        title: '管理费提成列表',
        icon: 'audit',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/distribution-management/expense/Commission',
      children: [
        {
          path: '/distribution-management/expense/Commission',
          name: 'distribution_management_Commission',
          component: () => import('@/views/distribution-management/expense/Commission/List'),
          meta: {
            title: '提成规则',
            icon: 'audit',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/distribution-management/expense/Netprofit',
          name: 'distribution_management_Netprofit',
          component: () => import('@/views/distribution-management/expense/Netprofit/List'),
          meta: {
            title: '净利润列表',
            icon: 'audit',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/distribution-management/expense/Collection',
          name: 'distribution_management_Collection',
          component: () => import('@/views/distribution-management/expense/Collection/List'),
          meta: {
            title: '收款明细',
            icon: 'audit',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    }
  ]
}
