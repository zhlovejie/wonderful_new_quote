// eslint-disable-next-line
import {
  PageView,
  RouteView
} from '@/layouts'

export default {
  path: '/quality-management',
  name: 'quality-management',
  component: PageView,
  meta: {
    title: '质量管理',
    icon: 'build',
    permission: ['permission']
  },
  redirect: '/quality-management/parameter-term',
  children: [{
      path: '/quality-management/parameter-term',
      name: 'quality-management_parameter-term',
      component: () => import('@/views/quality-management/checkParameterTerm/List'),
      meta: {
        title: '检验参数配置',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/quality-management/tool-authentication',
      name: 'quality-management_tool-authentication',
      component: () => import('@/views/quality-management/checkToolAuthentication/List'),
      meta: {
        title: '检验工具认证',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/quality-management/standard',
      name: 'quality-management_standard',
      component: RouteView,
      redirect: '/quality-management/standard/inspection-basis',
      meta: {
        title: '检验标准',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/quality-management/standard/inspection-basis',
          name: 'quality-management_standard_inspection-basis',
          component: () => import('@/views/quality-management/checkInspectionBasis/List'),
          meta: {
            title: '检验依据',
            permission: ['permission']
          }
        },
        {
          path: '/quality-management/standard/inspection-scheme-set',
          name: 'quality-management_standard_inspection-scheme-set',
          component: () => import('@/views/quality-management/checkInspectionSchemeSet/List'),
          meta: {
            title: '检验方案设置',
            permission: ['permission']
          }
        },
        {
          path: '/quality-management/standard/inspection-standard-set',
          name: 'quality-management_standard_inspection-standard-set',
          component: () => import('@/views/quality-management/checkInspectionStandardSet/List'),
          meta: {
            title: '检验标准制定',
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/quality-management/Warehousing',
      name: 'quality-management_Warehousing',
      component: RouteView,
      redirect: '/quality-management/Warehousing/incoming',
      meta: {
        title: '入库检验记录单',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/quality-management/Warehousing/incoming',
          name: 'quality-management_Warehousing_incoming',
          component: () => import('@/views/quality-management/Warehousing/incoming/List'),
          meta: {
            title: '来料检验记录单',
            permission: ['permission']
          }
        },
        {
          path: '/quality-management/Warehousing/Outsourcing',
          name: 'quality-management_Warehousing_Outsourcing',
          component: () => import('@/views/quality-management/Warehousing/Outsourcing/List'),
          meta: {
            title: '委外检验记录单',
            permission: ['permission']
          }
        },
        {
          path: '/quality-management/Warehousing/Processt',
          name: 'quality-management_Warehousing_Processt',
          component: () => import('@/views/quality-management/Warehousing/Process/List'),
          meta: {
            title: '制程检验记录单',
            permission: ['permission']
          }
        },
        {
          path: '/quality-management/Warehousing/exchange',
          name: 'quality-management_Warehousing_exchange',
          component: () => import('@/views/quality-management/Warehousing/exchange/List'),
          meta: {
            title: '入库申请检验单',
            permission: ['permission']
          }
        },
        {
          path: '/quality-management/Warehousing/Scrap',
          name: 'quality-management_Warehousing_Scrap',
          component: () => import('@/views/quality-management/Warehousing/Scrap/List'),
          meta: {
            title: '报废检验记录单',
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/quality-management/rejects',
      name: 'quality-management_rejects',
      component: () => import('@/views/quality-management/rejects/List'),
      meta: {
        title: '不良品处置单',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/quality-management/Purchase',
      name: 'quality-management_Purchase',
      component: () => import('@/views/quality-management/Purchase/List'),
      meta: {
        title: '采购议价记录单',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
  ]
}
