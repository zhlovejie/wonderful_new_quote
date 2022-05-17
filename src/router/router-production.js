// eslint-disable-next-line
import { PageView, RouteView } from '@/layouts'

export default {
  path: '/production',
  name: 'production',
  component: PageView,
  meta: {
    title: '生产管理',
    icon: 'build',
    permission: ['permission']
  },
  redirect: '/production/retrospect',
  children: [
    {
      path: '/production/retrospect',
      name: 'retrospect',
      component: RouteView,
      meta: {
        title: '产品追溯',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [
        {
          path: '/production/retrospect/processList',
          name: 'ProcessList',
          component: () => import('@/views/production/retrospect/ProcessList'),
          meta: {
            title: '生产工序',
            permission: ['permission']
          }
        },
        {
          path: '/production/retrospect/codeList',
          name: 'CodeList',
          component: () => import('@/views/production/retrospect/CodeList'),
          meta: {
            title: '产品代码',
            permission: ['permission']
          }
        },
        {
          path: '/production/retrospect/recordList',
          name: 'RecordList',
          component: () => import('@/views/production/retrospect/RecordList'),
          meta: {
            title: '产品档案',
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/production/event',
      name: 'productionEvent',
      component: RouteView,
      meta: {
        title: '质量事件',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [
        {
          path: '/production/event/EventList',
          name: 'eventList',
          component: () => import('@/views/production/event/EventList'),
          meta: {
            title: '质量事件列表',
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/production/cutCost',
      name: 'productionCutCost',
      component: RouteView,
      meta: {
        title: '降本',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [
        {
          path: '/production/cutCostRecord',
          name: 'cutCostRecord',
          component: () => import('@/views/production/cut-cost/RecordList'),
          meta: {
            title: '降本申请记录',
            permission: ['permission']
          }
        },
        {
          path: '/production/cutCostRule',
          name: 'cutCostRule',
          component: () => import('@/views/production/cut-cost/RuleList'),
          meta: {
            title: '考核规则',
            permission: ['permission']
          }
        },
        {
          path: '/production/cutCostRuleRecord',
          name: 'cutCostRuleRecord',
          component: () => import('@/views/production/cut-cost/RuleRecordList'),
          meta: {
            title: '考核记录',
            permission: ['permission']
          }
        }
      ]
    }
  ]
}
