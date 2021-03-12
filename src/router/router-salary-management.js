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
  children: [{ //工资参照表
      path: '/salary-management/salary-reference-record',
      name: 'salary-reference-record',
      component: () => import('@/views/salary-management/salary-reference-record/List'),
      meta: {
        title: '工资参照表',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
    { //薪资项设置
      path: '/salary-management/salary-options-setting',
      name: 'salary-options-setting',
      component: () => import('@/views/salary-management/salary-options-setting/List'),
      meta: {
        title: '薪资项设置',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
    },
    { //基本工资表
      path: '/salary-management/salary-base-record',
      name: 'salary-base-record',
      component: RouteView,
      meta: {
        title: '基本工资表',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/salary-management/salary-base-common-record',
      children: [{
          path: '/salary-management/salary-base-common-record',
          name: 'salary-base-common-record',
          component: () => import('@/views/salary-management/salary-base-common-record/List'),
          meta: {
            title: '基本工资表',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        // {
        //   path: '/salary-management/salary-base-sale-rules',
        //   name: 'salary-base-sale-rules',
        //   component: () => import('@/views/salary-management/salary-base-sale-rules/List'),
        //   meta: {
        //     title: '销售基本工资规则',
        //     icon: 'select',
        //     keepAlive: false,
        //     permission: ['permission']
        //   },
        // }, {
        //   path: '/salary-management/salary-base-sale-rules/module',
        //   name: 'salary-base-sale-module',
        //   component: () => import('@/views/salary-management/salary-base-sale-rules/module/See'),
        //   meta: {
        //     title: '销售基本工资规则明细',
        //     icon: 'select',
        //     hidden: true,
        //     keepAlive: false,
        //     permission: ['permission']
        //   },
        // }
      ]
    },
    { //工资
      path: '/salary-management/salary-info',
      name: 'salary-info',
      component: RouteView,
      meta: {
        title: '工资',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/salary-management/salary-details',
      children: [{
          path: '/salary-management/salary-details',
          name: 'salary-details',
          component: () => import('@/views/salary-management/salary-details/List'),
          meta: {
            title: '工资条',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },

      ]
    },

    { //提成
      path: '/salary-management/commission',
      name: 'commission',
      component: RouteView,
      meta: {
        title: '提成',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/salary-management/commission/rule',
          name: 'commission-rules',
          component: RouteView,
          meta: {
            title: '规则',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: [{
              path: '/salary-management/commission/rule/salary-base-sale-rules',
              name: 'salary-base-sale-rules',
              component: () => import('@/views/salary-management/commission/rule/salary-base-sale-rules/List'),
              meta: {
                title: '销售基本工资规则',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
            }, {
              path: '/salary-management/commission/rule/salary-base-sale-rules/module',
              name: 'salary-base-sale-module',
              component: () => import('@/views/salary-management/commission/rule/salary-base-sale-rules/module/See'),
              meta: {
                title: '销售基本工资规则明细',
                icon: 'select',
                hidden: true,
                keepAlive: false,
                permission: ['permission']
              },
            },
            {
              path: '/salary-management/commission/rule/research',
              name: 'salary-research',
              component: () => import('@/views/salary-management/commission/rule/research/List'),
              meta: {
                title: '研发提成规则',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
            },
            {
              path: '/salary-management/commission/rule/Hardware',
              name: 'salary-Hardware',
              component: () => import('@/views/salary-management/commission/rule/Hardware/List'),
              meta: {
                title: '软件/硬件提成规则',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
            },
          ]
        },
        {
          path: '/salary-management/commission/collection',
          name: 'collection',
          component: () => import('@/views/salary-management/commission/collection/List'),
          meta: {
            title: '销售部收款分析表',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/salary-management/commission/order',
          name: 'commission-order',
          component: () => import('@/views/salary-management/commission/order/List'),
          meta: {
            title: '销售部订单提成分析表',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/salary-management/commission/sale-commission-bonus',
          name: 'sale-commission',
          component: () => import('@/views/salary-management/commission/sale-commission-bonus/List'),
          meta: {
            title: '销售提成奖金',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/salary-management/commission/research-commission-bonus',
          name: 'research-commission',
          component: () => import('@/views/salary-management/commission/research-commission-bonus/List'),
          meta: {
            title: '研发提成奖金',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },

        {
          path: '/salary-management/commission/softwareAndHardware',
          name: 'softwareAndHardware',
          component: () => import('@/views/salary-management/commission/softwareAndHardware/List'),
          meta: {
            title: '软件/硬件提成奖金',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        }



      ]
    },
    { //补贴
      path: '/salary-management/salary-subsidy',
      name: 'salary-subsidy',
      component: RouteView,
      meta: {
        title: '补贴',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/salary-management/salary-subsidy-rules',
          name: 'salary-subsidy-rules',
          component: RouteView,
          meta: {
            title: '补贴规则',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: [{
              path: '/salary-management/salary-subsidy-engineer-rules',
              name: 'salary-subsidy-engineer-rules',
              component: () => import('@/views/salary-management/salary-subsidy-engineer-rules/List'),
              meta: {
                title: '油补/通讯/高级工程师规则',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
            },
            {
              path: '/salary-management/salary-subsidy-rules-record',
              name: 'salary-subsidy-rules-record',
              component: () => import('@/views/salary-management/salary-subsidy-rules-record/List'),
              meta: {
                title: '多类补贴',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
            },
            {
              path: '/salary-management/engineer_subsidy',
              name: 'engineer_subsidy',
              component: () => import('@/views/salary-management/engineer_subsidy/List'),
              meta: {
                title: '高级工程师补贴规则',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
            },
            {
              path: '/salary-management/salary-subsidy-workyears-rules',
              name: 'salary-subsidy-workyears-rules',
              component: () => import('@/views/salary-management/salary-subsidy-workyears-rules/List'),
              meta: {
                title: '工龄补贴规则',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
            },

            {
              path: '/salary-management/salary-subsidy-workovertime-rules',
              name: 'salary-subsidy-workovertime-rules',
              component: () => import('@/views/salary-management/salary-subsidy-workovertime-rules/List'),
              meta: {
                title: '加班补贴规则',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
            },
            {
              path: '/salary-management/salary-subsidy-traffic-rules',
              name: 'salary-subsidy-traffic-rules',
              component: () => import('@/views/salary-management/salary-subsidy-traffic-rules/List'),
              meta: {
                title: '交通补贴规则',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
            },
            {
              path: '/salary-management/salary-subsidy-heat-rules',
              name: 'salary-subsidy-heat-rules',
              component: () => import('@/views/salary-management/salary-subsidy-heat-rules/List'),
              meta: {
                title: '高温补贴规则',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
            }
          ]
        },
        {
          path: '/salary-management/salary-subsidy-oil',
          name: 'salary-subsidy-oil',
          component: () => import('@/views/salary-management/salary-subsidy-oil/List'),
          meta: {
            title: '油补',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/salary-management/salary-subsidy-communication',
          name: 'salary-subsidy-communication',
          component: () => import('@/views/salary-management/salary-subsidy-communication/List'),
          meta: {
            title: '通讯补贴',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/salary-management/salary-subsidy-cover',
          name: 'salary-subsidy-cover',
          component: () => import('@/views/salary-management/salary-subsidy-cover/List'),
          meta: {
            title: '代班补贴',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/salary-management/salary-subsidy-other',
          name: 'salary-subsidy-other',
          component: () => import('@/views/salary-management/salary-subsidy-other/List'),
          meta: {
            title: '其它补贴',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/salary-management/salary-subsidy-industrial-accident',
          name: 'salary-subsidy-industrial-accident',
          component: () => import('@/views/salary-management/salary-subsidy-industrial-accident/List'),
          meta: {
            title: '工伤补贴',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
        }
      ]
    },
    { //xucongcong-奖金管理
      path: '/salary-management/bonus',
      name: 'salary-management_bonus',
      component: RouteView,
      meta: {
        title: '奖金管理',
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
    },
    { //xucongcong-应扣资金
      path: '/salary-management/capital',
      name: 'salary_year_capital',
      component: RouteView,
      meta: {
        title: '应扣资金',
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
    },
    { //保底年薪制
      path: '/salary-management/salary-year',
      name: 'salary-year',
      component: RouteView,
      meta: {
        title: '保底年薪制',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/salary-management/salary-year-rules',
      children: [{
        path: '/salary-management/salary-year-rules',
        name: 'salary-year-rules',
        component: () => import('@/views/salary-management/salary-year-rules/List'),
        meta: {
          title: '年薪制规则',
          icon: 'select',
          keepAlive: false,
          permission: ['permission']
        },
      }]
    }
  ]
}
