// eslint-disable-next-line
import { PageView, RouteView } from '@/layouts'

export default {
  //人力资源

  path: '/human_Resources',
  name: 'human_Resources',
  component: PageView,
  meta: {
    title: '人力资源',
    icon: 'user',
    permission: ['permission']
  },
  redirect: '/human_Resources',
  children: [
    {
      path: '/human_Resources/notice',
      name: 'human_Resources_notice',
      component: () => import('@/views/human_Resources/notice/Notice-List'),
      meta: {
        title: '公告管理',
        icon: 'read',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/human_Resources/security',
      name: 'human_Resources_security',
      component: RouteView,
      meta: {
        title: '社保管理',
        icon: 'audit',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/human_Resources/security/Insurance',
      children: [
        {
          path: '/human_Resources/security/Insurance',
          name: 'human_Resources_Insurance',
          component: () => import('@/views/human_Resources/security/Insurance/Insurance_List'),
          meta: {
            title: '保险配置',
            icon: 'audit',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/human_Resources/security/social',
          name: 'human_Resources_social',
          component: () => import('@/views/human_Resources/security/social/security_List'),
          meta: {
            title: '社保',
            icon: 'audit',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },
    {
      //补贴
      path: '/salary-management/salary-subsidy',
      name: 'salary-subsidy',
      component: RouteView,
      meta: {
        title: '补贴管理',
        icon: 'select',
        keepAlive: false,
        permission: ['permission']
      },
      children: [
        {
          path: '/Human-resource-management/senior_worker',
          name: 'Human_senior_worker',
          component: () => import('@/views/Human-resource-management/senior_worker/senior_worker_List'),
          meta: {
            title: '高级工程师管理 ',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/Human-resource-management/shuttle_Bus',
          name: 'Human_shuttle_Bus',
          component: () => import('@/views/Human-resource-management/shuttle_Bus/shuttle_Bus_List'),
          meta: {
            title: '申请班车记录',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/salary-management/salary-subsidy-oil',
          name: 'salary-subsidy-oil',
          component: () => import('@/views/salary-management/salary-subsidy-oil/List'),
          meta: {
            title: '油补申请',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/salary-management/replenishment-oil',
          name: 'replenishment-oil',
          component: () => import('@/views/salary-management/replenishment-oil/List'),
          meta: {
            title: '油补记录',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          }
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
          }
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
          }
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
          }
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
          }
        }
      ]
    },
    {
      path: '/human_Resources/security/social',
      name: 'humanResourcesSee',
      hidden: true,
      component: () => import('@/views/human_Resources/security/social/See'),
      meta: {
        title: '社保列表',
        permission: ['permission']
      }
    },
    {
      path: '/human_Resources/leagueBuilding',
      name: 'human_Resources_leagueBuilding',
      component: () => import('@/views/human_Resources/leagueBuilding/leagueBuilding_List'),
      meta: {
        title: '团建管理',
        icon: 'usergroup-delete',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/human_Resources/labor_contract',
      name: 'human_Resources_contract',
      component: RouteView,
      meta: {
        title: '劳动合同管理',
        icon: 'solution',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/human_Resources/labor_contract/post_allocation',
      children: [
        {
          path: '/human_Resources/labor_contract/post_allocation',
          name: 'human_Resources_allocation',
          component: () => import('@/views/human_Resources/labor_contract/post_allocation/post_allocation_List'),
          meta: {
            title: '岗位配置',
            icon: 'container',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/human_Resources/labor_contract/contractAgreement',
          name: 'human_Resources_contractAgreement',
          component: () => import('@/views/human_Resources/labor_contract/contractAgreement/contractAgreement_List'),
          meta: {
            title: '合同协议管理',
            icon: 'profile',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/human_Resources/dormitory',
      name: 'human_Resources_dormitory',
      component: RouteView,
      meta: {
        title: '宿舍管理',
        icon: 'solution',
        keepAlive: false,
        permission: ['permission']
      },
      redirect: '/human_Resources/dormitory/electricity',
      children: [
        {
          path: '/human_Resources/dormitory/electricity',
          name: 'human_Resources_electricity',
          component: () => import('@/views/human_Resources/dormitory/electricity/electricity_List'),
          meta: {
            title: '房间管理',
            icon: 'container',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/human_Resources/dormitory/personnel',
          name: 'human_Resources_personnel',
          component: () => import('@/views/human_Resources/dormitory/personnel/personnel_List'),
          meta: {
            title: '人员管理',
            icon: 'profile',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/human_Resources/dormitory/room',
          name: 'human_Resources_room',
          component: () => import('@/views/human_Resources/dormitory/room/room_List'),
          meta: {
            title: '电费管理',
            icon: 'profile',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/human_Resources/dormitory/securityHealth',
          name: 'human_Resources_securityHealth',
          component: () => import('@/views/human_Resources/dormitory/securityHealth/securityHealth_List'),
          meta: {
            title: '安全卫生考核',
            icon: 'profile',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/human_Resources/dormitory/electricityCharges',
          name: 'human_Resources_electricityCharges',
          component: () => import('@/views/human_Resources/dormitory/electricityCharges/electricityCharges_List'),
          meta: {
            title: '电费预警设置',
            icon: 'profile',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },
    {
      // 资产管理
      path: '/human_Resources/asset-management',
      name: 'asset-management',
      component: RouteView,
      meta: {
        title: '资产管理',
        icon: 'setting',
        permission: ['permission']
      },
      children: [
        {
          path: '/human_Resources/asset-management/mine',
          name: 'asset-management-mine',
          component: () => import('@/views/asset-management/mine/List'),
          meta: {
            title: '我的资产',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/human_Resources/asset-management/search',
          name: 'asset-management-search',
          component: () => import('@/views/asset-management/search/List'),
          meta: {
            title: '查询资产',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/human_Resources/asset-management/management',
          name: 'asset-management-management',
          component: () => import('@/views/asset-management/management/List'),
          meta: {
            title: '管理资产',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/human_Resources/asset-management/record',
          name: 'asset-management-record',
          component: () => import('@/views/asset-management/record/List'),
          meta: {
            title: '维修申请记录',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/human_Resources/asset-management/inventory-record-cycle',
          name: 'asset-management-inventory-record-cycle',
          component: () => import('@/views/asset-management/inventory-record-cycle/List'),
          meta: {
            title: '资产盘点周期',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/human_Resources/asset-management/inventory-record',
          name: 'asset-management-inventory-record',
          component: () => import('@/views/asset-management/inventory-record/List'),
          meta: {
            title: '资产盘点记录',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },

    {
      //通讯管理
      path: '/communication-management',
      name: 'communication-management',
      component: RouteView,
      meta: {
        title: '通讯管理',
        icon: 'phone',
        permission: ['permission']
      },
      redirect: '/communication-management/settings',
      children: [
        {
          path: '/communication-management/settings',
          name: 'communication-management-settings',
          component: () => import('@/views/communication-management/settings/List'),
          meta: {
            title: '通讯设置',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/communication-management/phone-number',
          name: 'communication-management-phone-number',
          component: () => import('@/views/communication-management/phone-number/List'),
          meta: {
            title: '手机号管理',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/communication-management/consume',
          name: 'communication-management-consume',
          component: () => import('@/views/communication-management/consume/List'),
          meta: {
            title: '消费详情',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/communication-management/account',
          name: 'communication-management-account',
          component: () => import('@/views/communication-management/account/List'),
          meta: {
            title: '账号管理',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/communication-management/group-leader',
          name: 'communication-management-group-leader',
          component: () => import('@/views/communication-management/group-leader/List'),
          meta: {
            title: '群主管理',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },

    {
      //制度文档管理
      path: '/files-management',
      name: 'files-management',
      component: RouteView,
      meta: {
        title: '制度文档管理',
        icon: 'file',
        permission: ['permission']
      },
      redirect: '/files-management/list',
      children: [
        {
          path: '/files-management/list',
          name: 'files-management-list',
          component: () => import('@/views/files-management/List'),
          meta: {
            title: '制度文档管理',
            icon: 'file',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },

    {
      //食堂菜单管理
      path: '/canteen-menu-management',
      name: 'canteen-menu-management',
      component: RouteView,
      meta: {
        title: '食堂菜单管理',
        icon: 'shop',
        permission: ['permission']
      },
      redirect: '/canteen-menu-management/config',
      children: [
        {
          path: '/canteen-menu-management/config',
          name: 'canteen-menu-management-config',
          component: () => import('@/views/canteen-menu-management/config/List'),
          meta: {
            title: '食堂菜单',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/canteen-menu-management/record',
          name: 'canteen-menu-management-record',
          component: () => import('@/views/canteen-menu-management/record/List'),
          meta: {
            title: '菜单记录',
            icon: 'profile',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/canteen-menu-management/evaluate',
          name: 'canteen-menu-management-evaluate',
          component: () => import('@/views/canteen-menu-management/evaluate/List'),
          meta: {
            title: '满意度调查',
            icon: 'file-done',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },

    {
      // 福利管理
      path: '/welfare-management',
      name: 'welfare-management',
      component: RouteView,
      meta: {
        title: '福利管理',
        icon: 'setting',
        permission: ['permission']
      },
      children: [
        {
          path: '/welfare-management/healthy',
          name: 'welfare-management-healthy',
          component: RouteView,
          meta: {
            title: '健康管理',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          },
          children: [
            {
              path: '/welfare-management/healthy/config',
              name: 'welfare-management-healthy-config',
              component: () => import('@/views/welfare-management/healthy/config/List'),
              meta: {
                title: '体检设置',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              }
            },
            {
              path: '/welfare-management/healthy/cycle-config',
              name: 'welfare-management-healthy-cycle-config',
              component: () => import('@/views/welfare-management/healthy/cycle-config/List'),
              meta: {
                title: '体检周期设置',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              }
            },
            {
              path: '/welfare-management/healthy/management',
              name: 'welfare-management-healthy-management',
              component: () => import('@/views/welfare-management/healthy/management/List'),
              meta: {
                title: '体检管理',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              }
            }
          ]
        },
        {
          path: '/welfare-management/employee-care',
          name: 'welfare-management-employee-care',
          component: RouteView,
          meta: {
            title: '员工关怀',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          },
          children: [
            {
              path: '/welfare-management/employee-care/config',
              name: 'welfare-management-employee-care-config',
              component: () => import('@/views/welfare-management/employee-care/config/List'),
              meta: {
                title: '关怀设置',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              }
            },
            {
              path: '/welfare-management/employee-care/config-record',
              name: 'welfare-management-employee-care-config-record',
              component: () => import('@/views/welfare-management/employee-care/config-record/List'),
              meta: {
                title: '关怀设置修改记录',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              }
            }
          ]
        },

        {
          path: '/welfare-management/holiday-gifts',
          name: 'welfare-management-holiday-gifts',
          component: RouteView,
          meta: {
            title: '过节礼品',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          },
          children: [
            {
              path: '/welfare-management/holiday-gifts/config',
              name: 'welfare-management-holiday-gifts-config',
              component: () => import('@/views/welfare-management/holiday-gifts/config/List'),
              meta: {
                title: '礼品标准',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              }
            },
            {
              path: '/welfare-management/holiday-gifts/money-config',
              name: 'welfare-management-holiday-gifts-money-config',
              component: () => import('@/views/welfare-management/holiday-gifts/money-config/List'),
              meta: {
                title: '过节费标准',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              }
            },
            {
              path: '/welfare-management/holiday-gifts/money-config-record',
              name: 'welfare-management-holiday-gifts-money-config-record',
              component: () => import('@/views/welfare-management/holiday-gifts/money-config-record/List'),
              meta: {
                title: '过节费修改记录',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              }
            }
          ]
        },
        {
          path: '/welfare-management/welfare',
          name: 'welfare-management-welfare',
          component: RouteView,
          meta: {
            title: '福利',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          },
          children: [
            {
              path: '/welfare-management/welfare/config',
              name: 'welfare-management-welfare-config',
              component: () => import('@/views/welfare-management/welfare/config/List'),
              meta: {
                title: '生日福利标准',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              }
            },
            {
              path: '/welfare-management/welfare/birthday-config',
              name: 'welfare-management-welfare-birthday-config',
              component: () => import('@/views/welfare-management/welfare/birthday-config/List'),
              meta: {
                title: '生日福利管理',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              }
            },
            {
              path: '/welfare-management/welfare/annual-meeting-config',
              name: 'welfare-management-welfare-annual-meeting-config',
              component: () => import('@/views/welfare-management/welfare/annual-meeting-config/List'),
              meta: {
                title: '年会福利管理',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              }
            }
          ]
        }
      ]
    }
  ]
}
