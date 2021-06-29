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

export default { //研发管理

  path: '/research-managements',
  name: 'research-managements',
  component: PageView,
  meta: {
    title: '研发管理',
    icon: 'shop',
    permission: ['permission']
  },
  redirect: '/research-managements/drawing-managements/permissions',
  children: [{
      path: '/research-managements/drawing-managements',
      name: 'research-managements-drawing-managements',
      component: RouteView,
      meta: {
        title: '图纸管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/research-managements/drawing-managements/permissions',
          name: 'research-managements-drawing-managements-permissions',
          component: () => import('@/views/research-managements/drawing-managements/permissions/List'),
          meta: {
            title: '图纸权限',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/research-managements/drawing-managements/management',
          name: 'research-managements-drawing-managements-management',
          component: () => import('@/views/research-managements/drawing-managements/management/List'),
          meta: {
            title: '图纸管理',
            icon: 'profile',
            keepAlive: false,
            permission: ['permission']
          },
        }
      ]
    },
    {
      path: '/research-managements/research-task',
      name: 'research-managements-research-task',
      component: RouteView,
      meta: {
        title: '任务',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/research-managements/research-task/task-list',
          name: 'research-task-list',
          component: () => import('@/views/research-managements/research-task/task-list/List'),
          meta: {
            title: '任务单',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/research-managements/research-task/my-task-list',
          name: 'research-task-my-task-list',
          component: () => import('@/views/research-managements/research-task/my-task-list/List'),
          meta: {
            title: '我的任务单',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/research-managements/research-task/task-list-approval',
          name: 'research-task-list-approval',
          component: () => import('@/views/research-managements/research-task/task-list-approval/List'),
          meta: {
            title: '任务单审核',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/research-managements/research-task/task-performance',
          name: 'research-task-performance',
          component: () => import('@/views/research-managements/research-task/task-performance/List'),
          meta: {
            title: '任务绩效',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/research-managements/research-task/task-bonus-shares',
          name: 'research-task-bonus-shares',
          component: () => import('@/views/research-managements/research-task/task-bonus-shares/List'),
          meta: {
            title: '奖金分配',
            keepAlive: false,
            permission: ['permission']
          },
        }
      ]
    },
    {
      path: '/research-managements/project-management',
      name: 'research-managements-project-management',
      component: RouteView,
      meta: {
        title: '项目管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/research-managements/project-management/Project-node',
          name: 'project-management-Project-node',
          component: () => import('@/views/research-managements/project-management/Project-node/List'),
          meta: {
            title: '项目节点关联项配置',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/research-managements/project-management/Project-selection',
          name: 'project-management-Project-selection',
          component: () => import('@/views/research-managements/project-management/Project-selection/List'),
          meta: {
            title: '项目节点选项配置',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/research-managements/project-management/Project-list',
          name: 'project-management-Project-list',
          component: () => import('@/views/research-managements/project-management/Project-list/List'),
          meta: {
            title: '项目列表',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/research-managements/project-management/My-project',
          name: 'project-management-My-project',
          component: () => import('@/views/research-managements/project-management/My-project/List'),
          meta: {
            title: '我的项目',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/research-managements/project-management/Project-audit',
          name: 'project-management-Project-audit',
          component: () => import('@/views/research-managements/project-management/Project-audit/List'),
          meta: {
            title: '项目审核',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/research-managements/project-management/Project-patent',
          name: 'project-management-Project-patent',
          component: () => import('@/views/research-managements/project-management/Project-patent/List'),
          meta: {
            title: '项目专利',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/research-managements/project-management/Inspection-report',
          name: 'project-management-Inspection-report',
          component: () => import('@/views/research-managements/project-management/Inspection-report/List'),
          meta: {
            title: '检验报告',
            keepAlive: false,
            permission: ['permission']
          },
        }
      ]
    }
  ]
}
