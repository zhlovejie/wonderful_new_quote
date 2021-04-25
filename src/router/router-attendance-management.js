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

export default { //考勤管理

  path: '/attendance-management',
  name: 'attendance-management',
  component: PageView,
  meta: {
    title: '考勤管理',
    icon: 'bell',
    permission: ['permission']
  },
  redirect: '/canteen-menu-management/config',
  children: [{
      path: '/attendance-management/rules-setting',
      name: 'attendance-rules-setting',
      component: RouteView,
      redirect: '/attendance-management/rules-setting/shift-rule',
      meta: {
        title: '考勤规则设置',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/attendance-management/rules-setting/shift-rule',
          name: 'attendance-rules-setting-shift-rule',
          component: () => import('@/views/attendance-management/rules-setting/shift-rule/List'),
          meta: {
            title: '班次设置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/attendance-management/rules-setting/supplement-card-rule',
          name: 'attendance-rules-setting-supplement-card-rule',
          component: () => import('@/views/attendance-management/rules-setting/supplement-card-rule/List'),
          meta: {
            title: '补卡规则设置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/attendance-management/rules-setting/rest-timeout',
          name: 'attendance-rules-setting-rest-timeout',
          component: () => import('@/views/attendance-management/rules-setting/rest-timeout/List'),
          meta: {
            title: '调休规则设置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/attendance-management/rules-setting/fine-rules',
          name: 'attendance-rules-setting-fine-rules',
          component: () => import('@/views/attendance-management/rules-setting/fine-rules/list'),
          meta: {
            title: '补卡罚款规则设置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },

        {
          path: '/attendance-management/rules-setting/over-time-rule',
          name: 'attendance-rules-setting-over-time-rule',
          component: () => import('@/views/attendance-management/rules-setting/over-time-rule/List'),
          meta: {
            title: '加班规则设置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/attendance-management/rules-setting/attendance-rule',
          name: 'attendance-rules-setting-attendance-rule',
          component: () => import('@/views/attendance-management/rules-setting/attendance-rule/List'),
          meta: {
            title: '出勤规则设置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/attendance-management/rules-setting/attendance-rule-edit',
          name: 'attendance-rules-setting-attendance-rule-edit',
          component: () => import('@/views/attendance-management/rules-setting/attendance-rule/ListEdit'),
          meta: {
            title: '出勤规则修改记录',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/attendance-management/rules-setting/vacation-rule',
          name: 'attendance-rules-setting-vacation-rule',
          component: () => import('@/views/attendance-management/rules-setting/vacation-rule/List'),
          meta: {
            title: '假期规则设置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/attendance-management/rules-setting/vacation-management',
          name: 'attendance-rules-setting-vacation-management',
          component: () => import('@/views/attendance-management/rules-setting/vacation-management/List'),
          meta: {
            title: '节假日管理',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/attendance-management/rules-setting/penaltyList',
      name: 'attendance-rules-setting-penaltyList',
      component: () => import('@/views/attendance-management/rules-setting/penaltyList/List'),
      meta: {
        title: '补卡罚款列表',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/attendance-management/business-trip-apply',
      name: 'attendance-business-trip-apply',
      component: () => import('@/views/attendance-management/business-trip-apply/List'),
      meta: {
        title: '出差申请',
        icon: 'car',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/attendance-management/over-time-apply',
      name: 'attendance-over-time-apply',
      component: () => import('@/views/attendance-management/over-time-apply/List'),
      meta: {
        title: '加班申请',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/attendance-management/going-apply',
      name: 'attendance-going-apply',
      component: () => import('@/views/attendance-management/going-apply/going_List'),
      meta: {
        title: '外出申请',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/attendance-management/attendance-abnormal-events',
      name: 'attendance-abnormal-events',
      component: () => import('@/views/attendance-management/attendance-abnormal-events/List'),
      meta: {
        title: '考勤异常事件',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/attendance-management/attence-months',
      name: 'attence-months',
      component: () => import('@/views/attendance-management/attence-months/List'),
      meta: {
        title: '考勤月历',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/attendance-management/supplement-card-apply',
      name: 'attendance-supplement-card-apply',
      component: () => import('@/views/attendance-management/supplement-card-apply/List'),
      meta: {
        title: '补卡申请',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/attendance-management/leave-apply',
      name: 'attendance-leave-apply',
      component: () => import('@/views/attendance-management/leave-apply/List'),
      meta: {
        title: '请假申请',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/attendance-management/face-record',
      name: 'attendance-face-record',
      component: () => import('@/views/attendance-management/face-record/List'),
      meta: {
        title: '人脸打卡记录',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/attendance-management/attendance-chart',
      name: 'attendance-chart',
      component: RouteView,
      redirect: '/attendance-management/chart/attendance-statistics',
      meta: {
        title: '考勤报表',
        icon: 'line-chart',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/attendance-management/chart/attendance-statistics',
          name: 'attendance-chart-attendance-statistics',
          component: () => import('@/views/attendance-management/chart/AttendanceStatisticsList'),
          meta: {
            title: '考勤统计',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/attendance-management/chart/work-meals-statistics',
          name: 'attendance-chart-work-meals-statistics',
          component: () => import('@/views/attendance-management/chart/WorkMealsStatisticsList'),
          meta: {
            title: '工作餐统计',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
      ]
    },
    {
      path: '/attendance-management/attendance-device',
      name: 'attendance-device',
      component: () => import('@/views/attendance-management/attendance-device/List'),
      meta: {
        title: '考勤设备',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },

    {
      path: '/attendance-management/no_rules',
      name: 'attendance-no_rules',
      component: () => import('@/views/attendance-management/no_rules/no_rules_LIst'),
      meta: {
        title: '未设规则用户',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      }
    }
  ]
}
