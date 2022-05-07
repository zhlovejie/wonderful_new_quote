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
  path: '/system-setting',
  name: 'SystemSetting',
  component: RouteView,
  meta: {
    title: '系统设置',
    icon: 'tool',
    permission: ['admin']
  },
  redirect: '/system-setting/permission',
  children: [{
      path: '/system-setting/permission/devision-management',
      component: PageView,
      name: 'AuthManagement',
      redirect: '/system-setting/permission/devision-management',
      meta: {
        title: '权限维护',
        icon: 'slack',
        keepAlive: true,
        permission: ['permission']
      },
      children: [
        {
          path: '/system-setting/permission/role-management',
          name: 'RoleManagement',
          component: () => import('@/views/system-setting/permission/RoleManagement'),
          meta: {
            title: '角色管理',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/permission/system-user',
          name: 'SystemUser',
          component: () => import('@/views/system-setting/permission/SystemUser'),
          meta: {
            title: '系统用户',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/permission/MenuList',
          name: 'Menumanagement',
          component: () => import('@/views/system-setting/permission/MenuList'),
          meta: {
            title: '菜单管理',
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/system-setting/security-settings',
      component: PageView,
      name: 'SecuritySetting',
      meta: {
        title: '安全设置',
        icon: 'layout'
      },
      children: [{
          path: '/system-setting/work-box/dataDictionary',
          name: 'dataDictionary',
          component: () => import('@/views/system-setting/work-box/dataDictionary'),
          meta: {
            title: '数据字典',
            permission: ['permission']
          }
        }
      ]
    }
  ]
}
