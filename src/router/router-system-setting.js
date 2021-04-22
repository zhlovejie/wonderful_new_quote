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
          path: '/system-setting/permission/devision-management',
          name: 'DevisionManagement',
          component: () => import('@/views/system-setting/permission/DevisionManagement'),
          meta: {
            title: '部门管理',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/permission/position-management',
          name: 'PositionManagement',
          component: () => import('@/views/system-setting/permission/PositionManagement'),
          meta: {
            title: '岗位管理',
            permission: ['permission']
          }
        },
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
        },
        {
          path: '/system-setting/permission/approval-process',
          name: 'ApprovalProcess',
          component: () => import('@/views/system-setting/permission/ApprovalProcess'),
          meta: {
            title: '审批流程',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/activity',
          name: 'activity',
          component: () => import('@/views/system-setting/activity/ActivitiProcDefList'),
          meta: {
            title: '流程定义',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/permission/SysJobList',
          name: 'sysJob',
          component: () => import('@/views/system-setting/permission/SysJobList'),
          meta: {
            title: '任务调度管理',
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
        },
        {
          path: '/system-setting/messagePush',
          name: 'messagePush',
          component: () => import('@/views/system-setting/messagePush/list'),
          meta: {
            title: '消息推送',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/sharingSettings',
          name: 'sharing_settings',
          component: () => import('@/views/system-setting/sharingSettings/list'),
          meta: {
            title: '推送共享设置',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/CommonSeal',
          name: 'CommonSeal',
          component: () => import('@/views/system-setting/work-box/CommonSeal'),
          meta: {
            title: '公章管理',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/security-settings/WhiteList',
          name: 'WhiteList',
          component: () => import('@/views/system-setting/security-settings/WhiteList'),
          meta: {
            title: '白名单管理',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/permission/SysLog',
          name: 'sysLog',
          component: () => import('@/views/system-setting/permission/SysLog'),
          meta: {
            title: '系统日志',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/security-settings/Monitor',
          name: 'SysMonitor',
          component: () => import('@/views/system-setting/monitor/monitorIndex'),
          meta: {
            title: '运行监控',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/AndroidVersion',
          name: 'AndroidVersion',
          component: () => import('@/views/system-setting/work-box/AndroidVersion'),
          meta: {
            title: '安卓版本信息',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/AndroidequipmentType',
          name: 'AndroidequipmentType',
          component: () => import('@/views/system-setting/work-box/AndroidequipmentType'),
          meta: {
            title: '安卓设备类型',
            permission: ['permission']
          }
        },
        {
          path: '/attendance-management/attendance-device',
          name: 'AndroidequipmentHardware',
          component: () => import('@/views/attendance-management/attendance-device/List'),
          meta: {
            title: '安卓设备硬件信息',
            permission: ['permission']
          }
        }
      ]
    },
    {

      path: '/system-setting/work-box',
      component: PageView,
      name: 'workBox',
      meta: {
        title: '工具箱',
        icon: 'hdd',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/system-setting/work-box/SoftwareProductList',
          name: 'SoftwareProductList',
          component: () => import('@/views/system-setting/work-box/SoftwareProductList'),
          meta: {
            title: '软件产品信息',
            permission: ['permission']
          }
        },

        {
          path: '/system-setting/work-box/Qualification',
          name: 'Qualification',
          component: () => import('@/views/system-setting/work-box/Qualification'),
          meta: {
            title: '资质认证',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/companyInformation/AccountBank',
          name: 'AccountBank',
          component: () => import('@/views/system-setting/work-box/companyInformation/AccountBank'),
          meta: {
            title: '公司账户',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/companyInformation/EnterpriseVideo',
          name: 'EnterpriseVideo',
          component: () => import('@/views/system-setting/work-box/companyInformation/EnterpriseVideo'),
          meta: {
            title: '企业视频',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/companyInformation/EnterpriseSynopsis',
          name: 'EnterpriseSynopsis',
          component: () => import('@/views/system-setting/work-box/companyInformation/EnterpriseSynopsis'),
          meta: {
            title: '企业简介',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/companyInformation/ProductPromotionVideo',
          name: 'ProductPromotionVideo',
          component: () => import('@/views/system-setting/work-box/companyInformation/ProductPromotionVideo'),
          meta: {
            title: '产品宣传视频',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/companyInformation/TeachingVideoOfProductUse',
          name: 'TeachingVideoOfProductUse',
          component: () => import('@/views/system-setting/work-box/companyInformation/TeachingVideoOfProductUse'),
          meta: {
            title: '产品使用教学视频',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/companyInformation/ProductFunctionIntroduction',
          name: 'ProductFunctionIntroduction',
          component: () => import('@/views/system-setting/work-box/companyInformation/ProductFunctionIntroduction'),
          meta: {
            title: '产品功能简介',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/OperationalScheme',
          name: 'OperationalScheme',
          component: () => import('@/views/system-setting/work-box/OperationalScheme'),
          meta: {
            title: '运行方案',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/ProductInspectionReport',
          name: 'ProductInspectionReport',
          component: () => import('@/views/system-setting/work-box/ProductInspectionReport'),
          meta: {
            title: '产品检验报告',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/GuidanceManual',
          name: 'GuidanceManual',
          component: () => import('@/views/system-setting/work-box/GuidanceManual'),
          meta: {
            title: '运营指导手册',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/DescriptionDocument',
          name: 'DescriptionDocument',
          component: () => import('@/views/system-setting/work-box/DescriptionDocument'),
          meta: {
            title: '软件说明文档',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/ElectronicAtlas',
          name: 'ElectronicAtlas',
          component: () => import('@/views/system-setting/work-box/ElectronicAtlas'),
          meta: {
            title: '电子图册',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/ProductPoster',
          name: 'ProductPoster',
          component: () => import('@/views/system-setting/work-box/ProductPoster'),
          meta: {
            title: '产品海报',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/ProjectCaseList',
          name: 'ProjectCaseList',
          component: () => import('@/views/system-setting/work-box/ProjectCaseList'),
          meta: {
            title: '工程案例',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/ToolPostExplain',
          name: 'ToolPostExplain',
          component: () => import('@/views/system-setting/work-box/ToolPostExplain'),
          meta: {
            title: '岗位说明书',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/SalesSkill',
          name: 'SalesSkil',
          component: () => import('@/views/system-setting/work-box/SalesSkillList'),
          meta: {
            title: '销售技巧',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/ProductDescription',
          name: 'ProductDescription',
          component: () => import('@/views/system-setting/work-box/ProductDescriptionList'),
          meta: {
            title: '产品说明书',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/ClassifiedPublicityVideo',
          name: 'ClassifiedPublicityVideo',
          component: () => import('@/views/system-setting/work-box/ClassifiedPublicityVideo'),
          meta: {
            title: '分类宣传小视频',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box/companyInformation/EnterpriseQualification',
          name: 'EnterpriseQualification',
          component: () => import('@/views/system-setting/work-box/companyInformation/EnterpriseQualification'),
          meta: {
            title: '企业资质',
            permission: ['permission']
          }
        },
      ]
    },
    {

      path: '/system-setting/work-box-foreign-trade',
      component: PageView,
      name: 'workBoxForeignTrade',
      redirect: '/system-setting/work-box-foreign-trade/Qualification',
      meta: {
        title: '外贸工具箱',
        icon: 'hdd',
        keepAlive: false,
        permission: ['permission']
      },
      children: [
        // {
        //   path: '/system-setting/work-box-foreign-trade/Qualification',
        //   name: 'ForeignTradeQualification',
        //   component: () => import('@/views/system-setting/work-box-foreign-trade/Qualification'),
        //   meta: { title: '资质认证', keepAlive: false ,permission: ['permission'] }
        // },
        {
          path: '/system-setting/work-box-foreign-trade/AccountBank',
          name: 'ForeignTradeAccountBank',
          component: () => import('@/views/system-setting/work-box-foreign-trade/AccountBank'),
          meta: {
            title: '公司账户',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box-foreign-trade/EnterpriseVideo',
          name: 'ForeignTradeEnterpriseVideo',
          component: () => import('@/views/system-setting/work-box-foreign-trade/EnterpriseVideo'),
          meta: {
            title: '企业视频',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box-foreign-trade/EnterpriseSynopsis',
          name: 'ForeignTradeEnterpriseSynopsis',
          component: () => import('@/views/system-setting/work-box-foreign-trade/EnterpriseSynopsis'),
          meta: {
            title: '企业简介',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box-foreign-trade/OperationalScheme',
          name: 'ForeignTradeOperationalScheme',
          component: () => import('@/views/system-setting/work-box-foreign-trade/OperationalScheme'),
          meta: {
            title: '技术参数',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box-foreign-trade/DescriptionDocument',
          name: 'ForeignTradeDescriptionDocument',
          component: () => import('@/views/system-setting/work-box-foreign-trade/DescriptionDocument'),
          meta: {
            title: '软件说明文档',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box-foreign-trade/ProductPromotionVideo',
          name: 'ForeignTradeProductPromotionVideo',
          component: () => import('@/views/system-setting/work-box-foreign-trade/ProductPromotionVideo'),
          meta: {
            title: '产品宣传视频',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box-foreign-trade/TeachingVideoOfProductUse',
          name: 'ForeignTradeTeachingVideoOfProductUse',
          component: () => import('@/views/system-setting/work-box-foreign-trade/TeachingVideoOfProductUse'),
          meta: {
            title: '产品使用教学视频',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box-foreign-trade/ElectronicAtlas',
          name: 'ForeignTradeElectronicAtlas',
          component: () => import('@/views/system-setting/work-box-foreign-trade/ElectronicAtlas'),
          meta: {
            title: '电子图册',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box-foreign-trade/ProductPoster',
          name: 'ForeignTradeProductPoster',
          component: () => import('@/views/system-setting/work-box-foreign-trade/ProductPoster'),
          meta: {
            title: '产品海报',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box-foreign-trade/ProductDescription',
          name: 'ForeignTradeProductDescription',
          component: () => import('@/views/system-setting/work-box-foreign-trade/ProductDescription'),
          meta: {
            title: '产品使用说明书',
            permission: ['permission']
          }
        },
        {
          path: '/system-setting/work-box-foreign-trade/ClassifiedPublicityVideo',
          name: 'ForeignTradeClassifiedPublicityVideo',
          component: () => import('@/views/system-setting/work-box-foreign-trade/ClassifiedPublicityVideo'),
          meta: {
            title: '分类宣传小视频',
            permission: ['permission']
          }
        }
      ]
    }
  ]
}
