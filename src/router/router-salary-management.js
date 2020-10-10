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

export default {
  //薪酬管理
  path: '/salary-management',
  name: 'salary-management',
  component: PageView,
  meta: {
    title: '薪酬管理',
    icon: 'shop',
    permission: ['permission']
  },
  redirect: '/salary-management',
  children: [{
    path: '/salary-management/bonus',
    name: 'salary-management_bonus',
    component: RouteView,
    meta: {
      title: '奖金管理',
      icon: 'select',
      keepAlive: false,
      permission: ['permission']
    },
    children: [{
        path: '/salary-management/bonus/bonusRules',
        name: 'salary-management_bonusRules',
        component: RouteView,
        meta: {
          title: '奖金规则',
          icon: 'select',
          keepAlive: false,
          permission: ['permission']
        },
        children: [{
            path: '/salary-management/bonus/bonusRules/research',
            name: 'bonusRules_research',
            component: () => import('@/views/salary-management/bonus/bonusRules/research/research_List'),
            meta: {
              title: '研发提成奖金规则',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/salary-management/bonus/bonusRules/overtime',
            name: 'bonusRules_overtime',
            component: () => import('@/views/salary-management/bonus/bonusRules/overtime/overtime_List'),
            meta: {
              title: '加班奖金规则',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/salary-management/bonus/bonusRules/attendance',
            name: 'bonusRules_attendance',
            component: () => import('@/views/salary-management/bonus/bonusRules/attendance/attendance_List'),
            meta: {
              title: '全勤奖金规则',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
          }
        ]
      },
      {
        path: '/salary-management/bonus/year_end_bonus',
        name: 'salary_year_bonus',
        component: () => import('@/views/salary-management/bonus/year_end_bonus/year_end_bonus_List'),
        meta: {
          title: '年终奖金',
          icon: 'select',
          keepAlive: false,
          permission: ['permission']
        },
      },
      {
        path: '/salary-management/bonus/other_bonus',
        name: 'salary_other_bonus',
        component: () => import('@/views/salary-management/bonus/other_bonus/other_bonus_List'),
        meta: {
          title: '其他奖金',
          icon: 'select',
          keepAlive: false,
          permission: ['permission']
        },
      }
    ]
  }, {
    path: '/salary-management/capital',
    name: 'salary_year_capital',
    component: RouteView,

    meta: {
      title: '应扣资金',
      icon: 'select',
      keepAlive: false,
      permission: ['permission']
    },
    children: [{
        path: '/salary-management/capital/Meals',
        name: 'salary_capital_Meals',
        component: () => import('@/views/salary-management/capital/Meals/Meals_List'),
        meta: {
          title: '餐费扣款规则',
          icon: 'select',
          keepAlive: false,
          permission: ['permission']
        },
      },
      {
        path: '/salary-management/capital/bill',
        name: 'salary_capital_bill',
        component: () => import('@/views/salary-management/capital/bill/bill_list'),
        meta: {
          title: '罚款单',
          icon: 'select',
          keepAlive: false,
          permission: ['permission']
        },
      }
    ]
  }, ]
}
