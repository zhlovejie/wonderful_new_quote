// eslint-disable-next-line
import {BasicLayout,BlankLayout,PageView,RouteView,UserLayout } from '@/layouts'
import {bxAnaalyse } from '@/core/icons'

export default {
  path: '/sales-management',
  name: 'salesManagement',
  component: PageView,
  meta: {
    title: '销售管理',
    icon: 'dollar',
    permission: ['permission']
  },
  redirect: '/sales-management',
  children: [{
      path: '/sales-management/customer', // 访问路径
      name: 'customer',
      component: RouteView,
      meta: {
        title: '客户管理',
        icon: 'team',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/sales-management/customer/dep-customer',
          name: 'DepCustomerList',
          component: () => import('@/views/sales-management/customer/dep-customer/DepCustomerList'),
          meta: {
            title: '部门客户',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/customer/common-customer',
          name: 'CommonCutomerList',
          component: () => import('@/views/sales-management/customer/common-customer/CommonCutomerList'),
          meta: {
            title: '公共客户',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/customer/all-customer',
          name: 'AllCustomerList',
          component: () => import('@/views/sales-management/customer/all-customer/AllCustomerList'),
          meta: {
            title: '所有客户',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/customer/salesman',
          name: 'Salesman',
          component: () => import('@/views/sales-management/customer/salesman/SalesmanList'),
          meta: {
            title: '销售人员管理',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/customer/customer_delay_record',
          name: 'customer_delay_record',
          component: () => import('@/views/sales-management/customer/customer_delay_record/CustomerDelayRecordList'),
          meta: {
            title: '客户延时',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/customer/customer-release-rule',
          name: 'customerReleaseRule',
          component: () => import('@/views/sales-management/customer/customerReleaseRule/List'),
          meta: {
            title: '客户释放规则',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/customer/customer-appeal',
          name: 'customerAppeal',
          component: () => import('@/views/sales-management/customer/customerAppeal/List'),
          meta: {
            title: '客户申诉单',
            keepAlive: false,
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/sales-management/contract-template-management',
      component: RouteView,
      name: 'contractManagement',
      redirect: '/sales-management/contract-template-management',
      meta: {
        title: '合同模版管理',
        icon: 'book',
        keepAlive: true,
        permission: ['permission']
      },
      children: [{
          path: '/sales-management/contract-template-management/salesContractTemplate',
          name: 'salesContractTemplate',
          component: () => import('@/views/sales-management/contract-template-management/salesContractTemplate'),
          meta: {
            title: '销售合同模板',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/contract-template-management/productOrderFormTemplate',
          name: 'productOrderFormTemplate',
          component: () => import('@/views/sales-management/contract-template-management/productOrderFormTemplate'),
          meta: {
            title: '产品订货单模板',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/contract-template-management/tripartiteContractTemplate',
          name: 'tripartiteContractTemplate',
          component: () => import('@/views/sales-management/contract-template-management/tripartiteContractTemplate'),
          meta: {
            title: '三方合同模板',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/contract-template-management/softwareContractTemplate',
          name: 'softwareContractTemplate',
          component: () => import('@/views/sales-management/contract-template-management/softwareContractTemplate'),
          meta: {
            title: '软件合同模板',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/contract-template-management/agencyContractTemplate',
          name: 'agencyContractTemplate',
          component: () => import('@/views/sales-management/contract-template-management/agencyContractTemplate'),
          meta: {
            title: '代理合同模板',
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/sale/electronic-receipt', // 访问路径
      name: 'electronic-receipt',
      component: RouteView,
      meta: {
        title: '单据管理',
        icon: 'team',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/sale/electronic-receipt/electronicReceipt',
          name: 'electronicReceipt',
          component: () => import('@/views/sale/electronic-receipt/electronicReceipt'),
          meta: {
            title: '电子收据',
            permission: ['permission']
          }
        },
        {
          path: '/sale/electronic-receipt/modules',
          name: 'receiptModule',
          hidden: true,
          component: () => import('@/views/sale/electronic-receipt/modules/receiptModule'),
          meta: {
            title: '查看收据',
            permission: ['permission']
          }
        },
        {
          path: '/sale/addReceipt',
          name: 'addReceipt',
          hidden: true,
          component: () => import('@/views/sale/electronic-receipt/addReceipt'),
          meta: {
            title: '申请收据',
            permission: ['permission']
          }
        },
        {
          path: '/sale/order',
          name: 'order',
          component: () => import('@/views/sale/order/order'),
          meta: {
            title: '销售订单',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/sale/order/modules',
          name: 'orderModule',
          hidden: true,
          component: () => import('@/views/sale/order/modules/orderModule'),
          meta: {
            title: '订单详情',
            permission: ['permission']
          }
        },
        {
          path: '/sale/invoice',
          name: 'invoice',
          keepAlive: false,
          component: () => import('@/views/sale/invoice/invoice'),
          meta: {
            title: '发货单',
            permission: ['permission']
          }
        },
        {
          path: '/sale/invoice/modules',
          name: 'invoiceModules',
          hidden: true,
          component: () => import('@/views/sale/invoice/modules/invoiceModules'),
          meta: {
            title: '发货单申请',
            permission: ['permission']
          }
        },
        {
          path: '/sale/invoice/modules',
          name: 'invoiceApproval',
          hidden: true,
          component: () => import('@/views/sale/invoice/modules/invoiceApproval'),
          meta: {
            title: '发货单审批',
            permission: ['permission']
          }
        },
        {
          path: '/sale/delayed_payment',
          name: 'delayedPayment',
          keepAlive: false,
          component: () => import('@/views/sale/delayed_payment/delayedPayment'),
          meta: {
            title: '延迟付款单',
            permission: ['permission']
          }
        }, {
          path: '/sale/delayed_payment/modules',
          name: 'addDelayedPayment',
          hidden: true,
          component: () => import('@/views/sale/delayed_payment/modules/addDelayedPayment'),
          meta: {
            title: '延迟付款单新增',
            permission: ['permission']
          }
        }, {
          path: '/sale/delayed_payment/modules',
          name: 'addSoftDelayedPayment',
          hidden: true,
          component: () => import('@/views/sale/delayed_payment/modules/addSoftDelayedPayment'),
          meta: {
            title: '延迟付款单新增',
            permission: ['permission']
          }
        }, {
          path: '/sale/delayed_payment/modules',
          name: 'lookDelayedPayment',
          hidden: true,
          component: () => import('@/views/sale/delayed_payment/modules/lookDelayedPayment'),
          meta: {
            title: '延迟付款单查看',
            permission: ['permission']
          }
        }, {
          path: '/sale/delayed_payment/modules',
          name: 'lookSoftDelayedPayment',
          hidden: true,
          component: () => import('@/views/sale/delayed_payment/modules/lookSoftDelayedPayment'),
          meta: {
            title: '延迟付款单查看',
            permission: ['permission']
          }
        }, {
          path: '/sale/delayed_payment/modules',
          name: 'resubmit',
          hidden: true,
          component: () => import('@/views/sale/delayed_payment/modules/resubmit'),
          meta: {
            title: '延迟付款单重新提交',
            permission: ['permission']
          }
        }, {
          path: '/sale/delayed_payment/modules',
          name: 'softResubmit',
          hidden: true,
          component: () => import('@/views/sale/delayed_payment/modules/softResubmit'),
          meta: {
            title: '延迟付款单重新提交',
            permission: ['permission']
          }
        }, {
          path: '/sale/delayed_payment/modules',
          name: 'createPromise',
          hidden: true,
          component: () => import('@/views/sale/delayed_payment/modules/createPromise'),
          meta: {
            title: '延迟付款承诺书',
            permission: ['permission']
          }
        },
        {
          path: '/sale/receipt/ReceiptList',
          name: 'receiptList',
          component: () => import('@/views/sale/receipt/ReceiptList'),
          meta: {
            title: '收款单',
            permission: ['user']
          }
        },
        {
          path: '/sale/receipt/ReceiptAdd',
          name: 'ReceiptAdd',
          hidden: true,
          component: () => import('@/views/sale/receipt/ReceiptAdd'),
          meta: {
            title: '销售收款添加',
            permission: ['permission']
          }
        },
        {
          path: '/sale/receipt/ReceiptSoftwareAdd',
          name: 'ReceiptSoftwareAdd',
          hidden: true,
          component: () => import('@/views/sale/receipt/ReceiptSoftwareAdd'),
          meta: {
            title: '软件收款添加',
            permission: ['permission']
          }
        },
        {
          path: '/sale/receipt/ReceiptAgency',
          name: 'ReceiptAgency',
          hidden: true,
          component: () => import('@/views/sale/receipt/ReceiptAgencyForm'),
          meta: {
            title: '代理收款单',
            permission: ['permission']
          }
        },
        {
          path: '/sale/receipt/ReceiptVue',
          name: 'ReceiptVue',
          hidden: true,
          component: () => import('@/views/sale/receipt/ReceiptVue'),
          meta: {
            title: '查看',
            permission: ['permission']
          }
        },
        {
          path: '/sale/receipt/ReceiptSoftwareVue',
          name: 'ReceiptSoftwareVue',
          hidden: true,
          component: () => import('@/views/sale/receipt/ReceiptSoftwareVue'),
          meta: {
            title: '查看',
            permission: ['permission']
          }
        },
        {
          path: '/sale/receipt/ReceiptAudit',
          name: 'ReceiptAudit',
          hidden: true,
          component: () => import('@/views/sale/receipt/ReceiptAudit'),
          meta: {
            title: '审批',
            permission: ['permission']
          }
        }, {
          path: '/sale/receipt/ReceiptSoftwareAudit',
          name: 'ReceiptSoftwareAudit',
          hidden: true,
          component: () => import('@/views/sale/receipt/ReceiptSoftwareAudit'),
          meta: {
            title: '审批',
            permission: ['permission']
          }
        },
        {
          path: '/sale/advances/AdvancesList',
          name: 'advancesList',
          component: () => import('@/views/sale/advances/AdvancesList'),
          meta: {
            title: '预收款单',
            permission: ['user']
          }
        },
        {
          path: '/sales-management/pricing-module/pricing',
          name: 'pricing',
          component: () => import('@/views/sales-management/pricing-module/pricing'),
          meta: {
            title: '核价单',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/pricing-module/ApplyNuclearPrice',
          name: 'ApplyNuclearPrice',
          hidden: true,
          component: () => import('@/views/sales-management/pricing-module/ApplyNuclearPrice'),
          meta: {
            title: '申请核价',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/pricing-module/LookNuclearPrice',
          name: 'LookNuclearPrice',
          hidden: true,
          component: () => import('@/views/sales-management/pricing-module/LookNuclearPrice'),
          meta: {
            title: '查看核价',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/pricing-module/NuclearPriceApproval',
          name: 'NuclearPriceApproval',
          hidden: true,
          component: () => import('@/views/sales-management/pricing-module/NuclearPriceApproval'),
          meta: {
            title: '核价单界面',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/pricing-module/ReApplyNuclearPrice',
          name: 'ReApplyNuclearPrice',
          hidden: true,
          component: () => import('@/views/sales-management/pricing-module/ReApplyNuclearPrice'),
          meta: {
            title: '核价单重新提交',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/sale/openpaper/OpenPaperList',
          name: 'openPaperList',
          component: () => import('@/views/sale/openpaper/OpenPaperList'),
          meta: {
            title: '开票单',
            permission: ['user']
          }
        }, {
          path: '/sale/openpaper/OpenPaperAdd',
          name: 'openPaperAdd',
          hidden: true,
          component: () => import('@/views/sale/openpaper/OpenPaperAdd'),
          meta: {
            title: '开票申请',
            permission: ['permission']
          }
        }, {
          path: '/sale/openpaper/modules/SoftwareOpenPaperAdd',
          name: 'softwareOpenPaperAdd',
          hidden: true,
          component: () => import('@/views/sale/openpaper/modules/SoftwareOpenPaperAdd'),
          meta: {
            title: '软件合同开票申请',
            permission: ['permission']
          }
        }, {
          path: '/sale/openpaper/OpenPaperVue',
          name: 'openPaperVue',
          hidden: true,
          component: () => import('@/views/sale/openpaper/OpenPaperVue'),
          meta: {
            title: '查看开票单',
            permission: ['permission']
          }
        },
        {
          path: '/sale/openpaper/modules/SoftwareOpenPaperView',
          name: 'softwareOpenPaperView',
          hidden: true,
          component: () => import('@/views/sale/openpaper/modules/SoftwareOpenPaperView'),
          meta: {
            title: '查看开票单',
            permission: ['permission']
          }
        },
        {
          path: '/sale/openpaper/EditPaperVue',
          name: 'editPaperVue',
          hidden: true,
          component: () => import('@/views/sale/openpaper/EditPaperVue'),
          meta: {
            title: '重新提交',
            permission: ['permission']
          }
        },
        {
          path: '/sale/openpaper/modules/EditSoftwareOpenPaper',
          name: 'editSoftwareOpenPaper',
          hidden: true,
          component: () => import('@/views/sale/openpaper/modules/EditSoftwareOpenPaper'),
          meta: {
            title: '重新提交',
            permission: ['permission']
          }
        },
        {
          path: '/sale/after/AfterList',
          name: 'afterList',
          component: () => import('@/views/sale/after/AfterList'),
          meta: {
            title: '产品调试任务单',
            permission: ['user']
          }
        }, {
          path: '/sale/after/AfterAdd',
          name: 'afterAdd',
          hidden: true,
          component: () => import('@/views/sale/after/AfterAdd'),
          meta: {
            title: '产品调试任务单',
            permission: ['permission']
          }
        }, {
          path: '/sale/after/AfterVueOfAudit',
          name: 'AfterVueOfAudit',
          hidden: true,
          component: () => import('@/views/sale/after/AfterVueOfAudit'),
          meta: {
            title: '产品调试任务单',
            permission: ['permission']
          }
        },
        {
          path: '/sale/refund/List',
          name: 'refundReceipt',
          hidden: true,
          component: () => import('@/views/sale/refund-receipt/List'),
          meta: {
            title: '退款单',
            permission: ['permission']
          }
        },
        {
          path: '/sale/present/List',
          name: 'presentReceipt',
          hidden: true,
          component: () => import('@/views/sale/present-receipt/List'),
          meta: {
            title: '赠送单',
            permission: ['permission']
          }
        },
        // {
        //   path: '/sale/present-order/List',
        //   name: 'presentOrder',
        //   hidden: true,
        //   component: () => import('@/views/sale/present-order/List'),
        //   meta: { title: '赠送订单', permission: ['permission'] }
        // },
        {
          path: '/sale/present-order/List',
          name: 'presentOrder',
          hidden: true,
          component: () => import('@/views/sale/present-order/List'),
          meta: {
            title: '赠送订单',
            permission: ['permission']
          }
        },
        {
          path: '/sale/income/List',
          name: 'incomeReceipt',
          hidden: true,
          component: () => import('@/views/sale/income-receipt/List'),
          meta: {
            title: '进款单',
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/sales-management/contract-list-management',
      name: 'contractListManagement',
      component: RouteView,
      meta: {
        title: '合同列表管理',
        icon: 'table',
        permission: ['permission']
      },
      children: [{
          path: '/sales-management/contract-list-management/distributionContractList',
          name: 'distributionContractList',
          component: () => import('@/views/sales-management/contract-list-management/distributionContractList'),
          meta: {
            title: '销售合同',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/contract-list-management/step-forms/basicInformation1',
          name: 'basicInformation1',
          hidden: true,
          component: () => import('@/views/sales-management/contract-list-management/step-forms/basicInformation1'),
          meta: {
            title: '申请合同',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/contract-list-management/step-forms-edit/basicInformation1',
          name: 'basicInformationEdit',
          hidden: true,
          component: () => import('@/views/sales-management/contract-list-management/step-forms-edit/basicInformation1'),
          meta: {
            title: '申请合同',
            permission: ['permission']
          }
        },
        // {
        //   path: '/sales-management/contract-list-management/preview/previewSalesContract',
        //   name: 'preview',
        //   hidden:true,
        //   component: () => import('@/views/sales-management/contract-list-management/preview/previewSalesContract'),
        //   meta: { title: '合同预览', permission: ['permission'] },
        //   // redirect: '/sales-management/contract-list-management/step-forms/preview/previewSalesContract',
        //   children: [
        {
          path: '/sales-management/contract-list-management/preview/previewSalesContract',
          name: 'previewSalesContract',
          hidden: true,
          component: () => import('@/views/sales-management/contract-list-management/preview/previewSalesContract'),
          meta: {
            title: '销售合同',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/contract-list-management/preview/previewProductOrderForm',
          name: 'previewProductOrderForm', //产品订货单
          hidden: true,
          component: () => import('@/views/sales-management/contract-list-management/preview/previewProductOrderForm'),
          meta: {
            title: '销售合同',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/contract-list-management/preview/previewTripartiteContract',
          name: 'previewTripartiteContract', //三方合同
          hidden: true,
          component: () => import('@/views/sales-management/contract-list-management/preview/previewTripartiteContract'),
          meta: {
            title: '销售合同',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/software-contract-management/softwareContractList',
          name: 'softwareContractList',
          component: () => import('@/views/sales-management/software-contract-management/softwareContractList'),
          meta: {
            title: '软件合同',
            keepAlive: true,
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/software-contract-management/softwareContractModel',
          name: 'softwareContractModel',
          component: () => import('@/views/sales-management/software-contract-management/softwareContractModel'),
          meta: {
            title: '软件合同编辑',
            keepAlive: false,
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/software-contract-management/preview/previewSoftwareContract',
          name: 'previewSoftwareContract',
          component: () => import('@/views/sales-management/software-contract-management/preview/previewSoftwareContract'),
          meta: {
            title: '软件合同预览',
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/agency-contract-management/agencyContractList',
          name: 'agencyContractList',
          component: () => import('@/views/sales-management/agency-contract-management/agencyContractList'),
          meta: {
            title: '代理合同',
            keepAlive: true,
            permission: ['permission']
          }
        },
        {
          path: '/sales-management/agency-contract-management/preview/agencyContractView',
          name: 'agencyContractView',
          component: () => import('@/views/sales-management/agency-contract-management/agencyContractView'),
          meta: {
            title: '代理合同预览',
            permission: ['permission']
          }
        },
      ]
    },
    {
      path: '/sale', // 访问路径
      name: 'sale',
      component: RouteView,
      meta: {
        title: '项目授权',
        icon: 'team',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
        path: '/sale/record/InvestigateList',
        name: 'investigateList',
        component: () => import('@/views/sale/record/InvestigateList'),
        meta: {
          title: '授权列表',
          permission: ['permission']
        }
      }]
    },
    {
      path: '/sales-record-new', // 访问路径
      name: 'salesRecordNew',
      component: RouteView,
      meta: {
        title: '项目备案',
        icon: 'team',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
        path: '/sale/recordNew/List',
        name: 'recordNewList',
        component: () => import('@/views/sale/recordNew/List'),
        meta: {
          title: '备案列表',
          permission: ['permission']
        }
      }]
    },
    {
      path: '/sales-report', // 访问路径
      name: 'salesReport',
      component: RouteView,
      meta: {
        title: '销售报表',
        icon: 'chart',
        keepAlive: false,
        permission: ['permission']
      },
      children: [{
          path: '/sale/salesReport/SaleOrderReport',
          name: 'SaleOrderReport',
          component: () => import('@/views/sale/report/SaleOrderReport'),
          meta: {
            title: '订单详情',
            permission: ['permission']
          }
        },
        {
          path: '/sale/salesReport/InvoiceProductReport',
          name: 'InvoiceProductReport',
          component: () => import('@/views/sale/report/InvoiceProductReport'),
          meta: {
            title: '发货分析',
            permission: ['permission']
          }
        },
        {
          path: '/sale/salesReport/PersonnelPerformanceReport',
          name: 'PersonnelPerformanceReport',
          component: () => import('@/views/sale/report/PersonnelPerformanceReport'),
          meta: {
            title: '人员业绩分析',
            permission: ['permission']
          }
        },
        {
          path: '/sale/salesReport/DepartmentPerformanceReport',
          name: 'DepartmentPerformanceReport',
          component: () => import('@/views/sale/report/DepartmentPerformanceReport'),
          meta: {
            title: '部门业绩分析',
            permission: ['permission']
          }
        },
        {
          path: '/sale/salesReport/DepartmentSalemanTop',
          name: 'DepartmentSalemanTop',
          component: () => import('@/views/sale/report/DepartmentSalemanTop'),
          meta: {
            title: '销售额排行榜',
            permission: ['permission']
          }
        },
        {
          path: '/sale/salesReport/AdvancePaymentChart',
          name: 'AdvancePaymentChart',
          component: () => import('@/views/sale/report/AdvancePaymentChart'),
          meta: {
            title: '客户预收款表',
            permission: ['permission']
          }
        },
        {
          path: '/sale/salesReport/AdvancesChart',
          name: 'AdvancesChart',
          component: () => import('@/views/sale/report/AdvancesChart'),
          meta: {
            title: '预收账款分析',
            permission: ['permission']
          }
        },
        {
          path: '/sale/salesReport/GrossMarginChart',
          name: 'GrossMarginChart',
          component: () => import('@/views/sale/report/GrossMarginChart'),
          meta: {
            title: '毛利率分析表',
            permission: ['permission']
          }
        },
        {
          path: '/sale/salesReport/GrossMarginSummaryChart',
          name: 'GrossMarginSummaryChart',
          component: () => import('@/views/sale/report/GrossMarginSummaryChart'),
          meta: {
            title: '毛利率分析汇总',
            permission: ['permission']
          }
        },
        {
          path: '/sale/salesReport/ProfitMarginSummaryChart',
          name: 'ProfitMarginSummaryChart',
          component: () => import('@/views/sale/report/ProfitMarginSummaryChart'),
          meta: {
            title: '利润率分析汇总',
            permission: ['permission']
          }
        },{
          path: '/sale/salesReport/ProfitMarginSummaryChart',
          name: 'ProfitMarginSummaryChart',
          component: () => import('@/views/sale/report/ProfitMarginSummaryChart'),
          meta: {
            title: '客户预收款表',
            permission: ['permission']
          }
        }
      ]
    },
    {
      path: '/system-setting/work-box/ProductList',
      name: 'productList',
      component: () => import('@/views/system-setting/work-box/ProductList'),
      meta: {
        title: '产品信息',
        keepAlive: false,
        permission: ['permission']
      }
    },
    {
      path: '/system-setting/work-box/ProductPrice',
      name: 'ProductPrice',
      component: () => import('@/views/system-setting/work-box/ProductPrice'),
      meta: {
        title: '产品价格',
        permission: ['permission']
      }
    },
  ]
}