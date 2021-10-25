// eslint-disable-next-line
import {PageView,RouteView } from '@/layouts'

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
  children: [
    {
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
      children: [
        {
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
    }
  ]
}
