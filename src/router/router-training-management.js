// eslint-disable-next-line
import { PageView } from '@/layouts'

export default {
  //培训管理

  path: '/training-management',
  name: 'training-management',
  component: PageView,
  meta: {
    title: '培训管理',
    icon: 'shop',
    permission: ['permission']
  },
  redirect: '/training-management',
  children: [
    {
      path: '/training-management/training_materials',
      name: 'training-management_materials',
      component: () => import('@/views/training-management/training_materials/materials_List'),
      meta: {
        title: '培训资料',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/training-management/dispersed',
      name: 'training-management_dispersed',
      component: () => import('@/views/training-management/dispersed/dispersed_List'),
      meta: {
        title: '分散培训',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/training-management/focus',
      name: 'training-management_focus',
      component: () => import('@/views/training-management/focus/focus_List'),
      meta: {
        title: '集中培训',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/training-management/annual_programme',
      name: 'training-management_programme',
      component: () => import('@/views/training-management/annual_programme/annual_List'),
      meta: {
        title: '年度培训方案',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/training-management/my_information',
      name: 'training-management_information',
      component: () => import('@/views/training-management/my_information/information_List'),
      meta: {
        title: '我的培训资料',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/training-management/my_training',
      name: 'training-management_training',
      component: () => import('@/views/training-management/my_training/training_List'),
      meta: {
        title: '我的培训',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      }
    }
  ]
}
