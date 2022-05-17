// eslint-disable-next-line
import { PageView, RouteView } from '@/layouts'

export default {
  //人事管理
  path: '/personnel-management',
  name: 'personnel-management',
  component: PageView,
  meta: {
    title: '人事管理',
    icon: 'team',
    permission: ['permission']
  },
  redirect: '/personnel-management',
  children: [
    {
      path: '/personnel-management/personnel-reserve',
      name: 'personnel-reserve',
      component: () => import('@/views/personnel-management/reserve/ReserveList'),
      meta: {
        title: '人员储备',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: []
    },
    {
      path: '/personnel-management/annualLeave',
      name: 'personnel-annualLeave',
      component: () => import('@/views/personnel-management/annualLeave/annualLeaveList'),
      meta: {
        title: '调休/年假管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/personnel-management/organizational-structure',
      name: 'organizational-structure',
      component: () => import('@/views/personnel-management/structure/OrganizationalStructureChart'),
      meta: {
        title: '组织架构图',
        icon: 'cluster',
        keepAlive: false,
        permission: ['permission']
      },
      children: []
    },
    {
      path: '/personnel-management/report',
      name: 'personnel-report',
      component: () => import('@/views/personnel-management/report/ReportList'),
      meta: { title: '人事报表', icon: 'file', keepAlive: false, permission: ['permission'] },
      children: []
    },
    {
      path: '/personnel-management/personnel-apply',
      name: 'personnel-apply',
      component: RouteView,
      meta: {
        title: '人事申请',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [
        {
          path: '/personnel-management/personnel-apply/recruit-apply',
          name: 'recruit-apply',
          component: () => import('@/views/personnel-management/apply/recruit-apply/RecruitApplyList'),
          meta: {
            title: '招聘申请',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: []
        },
        {
          path: '/personnel-management/personnel-apply/becoming-apply',
          name: 'becoming-apply',
          component: () => import('@/views/personnel-management/apply/becoming-apply/BecomingApplyList'),
          meta: {
            title: '转正申请',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: []
        },
        {
          path: '/personnel-management/personnel-apply/probation-survey',
          name: 'probation-survey',
          component: () => import('@/views/personnel-management/apply/probation-survey/ProbationSurveyList'),
          meta: {
            title: '试用期调查表',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: []
        },
        {
          path: '/personnel-management/personnel-apply/adjust-apply',
          name: 'adjust-apply',
          component: () => import('@/views/personnel-management/apply/adjust-apply/List'),
          meta: {
            title: '调岗调薪申请',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: []
        },
        {
          path: '/personnel-management/personnel-apply/severance-apply',
          name: 'severance-apply',
          component: () => import('@/views/personnel-management/apply/severance-apply/List'),
          meta: {
            title: '离职申请',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: []
        },
        {
          path: '/personnel-management/personnel-apply/accident-report',
          name: 'accident-report',
          component: () => import('@/views/personnel-management/apply/accident-report/List'),
          meta: {
            title: '事故调查报告',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: []
        },
        {
          path: '/personnel-management/personnel-apply/severance-agreement',
          name: 'severance-agreement',
          component: () => import('@/views/personnel-management/apply/severance-agreement/List'),
          meta: {
            title: '离职协议',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: []
        }
      ]
    },
    {
      path: '/personnel-management/interview-record',
      name: 'interview-record',
      component: () => import('@/views/personnel-management/interview-record/InterviewRecordList'),
      meta: {
        title: '面试记录',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: []
    }
  ]
}
