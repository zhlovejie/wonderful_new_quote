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

export default { //产品报价管理
  path: '/product-offer-management',
  name: 'product-offer-management',
  component: PageView,
  meta: {
    title: '产品报价管理',
    icon: 'dollar',
    permission: ['permission']
  },
  children: [{
      path: '/product-offer-management/product-config',
      name: 'pom-product-config',
      component: () => import('@/views/product-offer-management/product-config/List'),
      meta: {
        title: '产品配置',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/product-offer-management/products-price',
      name: 'pom-products-price',
      component: () => import('@/views/product-offer-management/products-price/List'),
      meta: {
        title: '产品价格配置',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/product-offer-management/4d0/central-control-system-config',
      name: 'pom-central-control-system-config4d0',
      component: () => import('@/views/product-offer-management/central-control-system-config/List'),
      meta: {
        title: '中控系统模块配置',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
      children: []
    },
    {
      path: '/product-offer-management/4d0/priceAdjustProductQuote',
      name: 'pom-products-quotation-list4d0',
      component: () => import('@/views/product-offer-management/products-quotation/QuoteList'),
      meta: {
        title: '产品报价列表',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    },
    {
      path: '/product-offer-management/2d0', // 访问路径
      name: 'product-offer-management2d0',
      component: RouteView,
      meta: {
        title: '2.0产品配置',
        icon: 'team',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/product-offer-management/2d0/products-config',
          name: 'pom-products-config2d0',
          component: () => import('@/views/product-offer-management/products-config/List2'),
          meta: {
            title: '系列产品配置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/product-offer-management/2d0/productPriceCoefficient',
          name: 'productPriceCoefficient2d0',
          component: () => import('@/views/system-setting/work-box/productPriceCoefficient/List2'),
          meta: {
            title: '产品价格系数',
            permission: ['permission']
          }
        },
      ]
    },
    {
      path: '/product-offer-management/4d0', // 访问路径
      name: 'product-offer-management4d0',
      component: RouteView,
      meta: {
        title: '4.0产品配置',
        icon: 'team',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/product-offer-management/4d0/products-config',
          name: 'pom-products-config4d0',
          component: () => import('@/views/product-offer-management/products-config/List'),
          meta: {
            title: '系列产品配置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/product-offer-management/4d0/productPriceCoefficient',
          name: 'productPriceCoefficient4d0',
          component: () => import('@/views/system-setting/work-box/productPriceCoefficient/List'),
          meta: {
            title: '产品价格系数',
            permission: ['permission']
          }
        },

      ]
    },
    {
      path: '/product-offer-management/5d0', // 访问路径
      name: 'product-offer-management5d0',
      component: RouteView,
      meta: {
        title: '5.0产品配置',
        icon: 'team',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/product-offer-management/5d0/products-config',
          name: 'pom-products-config5d0',
          component: () => import('@/views/product-offer-management/products-config/List3'),
          meta: {
            title: '系列产品配置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/product-offer-management/5d0/productPriceCoefficient',
          name: 'productPriceCoefficient5d0',
          component: () => import('@/views/system-setting/work-box/productPriceCoefficient/List3'),
          meta: {
            title: '产品价格系数',
            permission: ['permission']
          }
        },

      ]
    },
    {
      path: '/product-offer-management/waste', // 访问路径
      name: 'product-offer-managementWaste',
      component: RouteView,
      meta: {
        title: '厨余产品配置',
        icon: 'team',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/product-offer-management/waste/products-config',
          name: 'pom-products-configWaste',
          component: () => import('@/views/product-offer-management/products-config/List4'),
          meta: {
            title: '系列产品配置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          },
        },
        {
          path: '/product-offer-management/waste/productPriceCoefficient',
          name: 'productPriceCoefficientWaste',
          component: () => import('@/views/system-setting/work-box/productPriceCoefficient/List4'),
          meta: {
            title: '产品价格系数',
            permission: ['permission']
          }
        },

      ]
    },
    {
      path: '/product-offer-management/products-quotation',
      name: 'pom-products-quotation',
      component: () => import('@/views/product-offer-management/products-quotation/List'),
      meta: {
        title: '产品报价',
        icon: 'setting',
        keepAlive: false,
        permission: ['permission']
      },
    }
  ]
}
