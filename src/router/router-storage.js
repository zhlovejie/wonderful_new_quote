// 仓储管理
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
  path: '/storageManagement',
  name: 'storageManagement',
  component: PageView,
  meta: {
    title: '仓储管理',
    icon: 'database',
    permission: ['permission']
  },
  redirect: '/storageManagement',
  children: [{
      path: '/storageManagement/configure', // 访问路径
      name: 'configure',
      component: RouteView,
      meta: {
        title: '配置',
        icon: 'team',
        keepAlive: true,
        permission: ['permission']
      },
      children: [{
          path: '/storageManagement/configure/Warehouse',
          name: 'WarehouseList',
          component: () => import('@/views/storageManagement/configure/Warehouse/List'),
          meta: {
            title: '仓库管理',
            permission: ['permission']
          }
        },
        {
          path: '/storageManagement/configure/Reservoir',
          name: 'ReservoirList',
          component: () => import('@/views/storageManagement/configure/Reservoir/List'),
          meta: {
            title: '库区管理',
            permission: ['permission']
          }
        },
        {
          path: '/storageManagement/configure/LiKu',
          name: 'LiKuList',
          component: () => import('@/views/storageManagement/configure/LiKu/List'),
          meta: {
            title: '立库货架管理',
            permission: ['permission']
          }
        },
        {
          path: '/storageManagement/configure/shelves',
          name: 'shelvesList',
          component: () => import('@/views/storageManagement/configure/shelves/List'),
          meta: {
            title: '货架管理',
            permission: ['permission']
          }
        },
        {
          path: '/storageManagement/configure/PlaneLibrary',
          name: 'PlaneLibrary',
          component: () => import('@/views/storageManagement/configure/PlaneLibrary/List'),
          meta: {
            title: '平面库位管理',
            permission: ['permission']
          }
        },
        {
          path: '/storageManagement/configure/container',
          name: 'containerList',
          component: () => import('@/views/storageManagement/configure/container/List'),
          meta: {
            title: '容器/托盘管理',
            permission: ['permission']
          }
        },
        {
          path: '/storageManagement/configure/platform',
          name: 'platformList',
          component: () => import('@/views/storageManagement/configure/platform/List'),
          meta: {
            title: '站台管理',
            permission: ['permission']
          }
        },
        {
          path: '/storageManagement/configure/tunnel',
          name: 'tunnelList',
          component: () => import('@/views/storageManagement/configure/tunnel/List'),
          meta: {
            title: '巷道管理',
            keepAlive: false,
            permission: ['permission']
          }
        },

      ]
    },
    {
      path: '/storageManagement/stock',
      component: RouteView,
      name: 'stockManagement',
      meta: {
        title: '库存',
        icon: 'book',
        keepAlive: true,
        permission: ['permission']
      },
      children: [{
          path: '/storageManagement/stock/immediate',
          name: 'immediateList',
          component: () => import('@/views/storageManagement/stock/immediate/List'),
          meta: {
            title: '即时库存',
            permission: ['permission']
          }
        },
        {
          path: '/storageManagement/stock/InsideTheLibrary',
          name: 'InsideTheLibraryList',
          component: () => import('@/views/storageManagement/stock/InsideTheLibrary/List'),
          meta: {
            title: '库内移位',
            permission: ['permission']
          }
        },
        {
          path: '/storageManagement/stock/allocation',
          name: 'allocation',
          component: () => import('@/views/storageManagement/stock/allocation/List'),
          meta: {
            title: '库存调拨',
            permission: ['permission']
          }
        },
        {
          path: '/storageManagement/stock/visualization',
          name: 'visualizationList',
          component: () => import('@/views/storageManagement/stock/visualization/List'),
          meta: {
            title: '库存可视化',
            permission: ['permission']
          }
        },
        {
          path: '/storageManagement/stock/Dull',
          component: RouteView,
          name: 'stock_Dull_Management',
          meta: {
            title: '呆滞料统计',
            icon: 'book',
            keepAlive: true,
            permission: ['permission']
          },
          children: [{
              path: '/storageManagement/stock/Dull/Specification',
              name: 'SpecificationList',
              component: () => import('@/views/storageManagement/stock/Dull/Specification/List'),
              meta: {
                title: '呆滞品规范',
                permission: ['permission']
              }
            },
            {
              path: '/storageManagement/stock/Dull/DullList',
              name: 'DullList',
              component: () => import('@/views/storageManagement/stock/Dull/DullList/List'),
              meta: {
                title: '呆滞品列表',
                permission: ['permission']
              }
            },
          ]
        },
      ]
    },

  ]
}
