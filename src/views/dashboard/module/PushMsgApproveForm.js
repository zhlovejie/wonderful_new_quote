import ApproveBusinessTrip from '@/views/attendance-management/business-trip-apply/AddForm.vue'
import ApproveOverTime from '@/views/attendance-management/over-time-apply/AddForm.vue'
import ApproveSupplementCard from '@/views/attendance-management/supplement-card-apply/AddForm.vue'
import ApproveLeave from '@/views/attendance-management/leave-apply/AddForm.vue'
import ApproveGoing from '@/views/attendance-management/going-apply/AddForm.vue'
import ViewCanteenMenu from '@/views/canteen-menu-management/config/AddForm.vue'
import ViewIncomeReceipt from '@views/sale/income-receipt/module/AddForm.vue'
import ApprovePresentReceipt from '@views/sale/present-receipt/module/AddForm.vue'
import ApproveRefundReceipt from '@views/sale/refund-receipt/module/AddForm.vue'
import ViewMeetingManagement from '@views/meeting-management/records/module/AddForm.vue'
import ApproveVehicleManagement from '@views/vehicle-management/use-record/AddForm.vue'

import ApproveDistributorContractManagement from '@views/sales-management/distributor-contract-management/module/AddForm.vue'
import ApproveStrategicCooperationAgreement from '@views/sales-management/strategic-cooperation-agreement/module/AddForm.vue'
import ApproveRefundApply from '@views/sale/refund-apply/module/AddForm.vue'
import ApproveRecordDeducted from '@views/sale/record-deducted/module/AddForm.vue'
import ApproveBusinessBorrowing from '@views/sales-management/businessBorrowing/AddForm.vue'
import ApproveBidBorrowing from '@views/sales-management/bidBorrowing/AddForm.vue'
import ApproveAfterSales from '@views/sales-management/afterSales/AddForm.vue'

import ApproveYearEndBonus from '@views/salary-management/bonus/year_end_bonus/module/Formadd.vue'
import ApproveOtherBonus from '@/views/salary-management/bonus/other_bonus/module/Formadd.vue'
import ApproveSeniorWorker from '@/views/Human-resource-management/senior_worker/module/Formadd.vue'

import ApproveCapitalBill from '@/views/salary-management/capital/bill/module/Formadd.vue'
// import ApproveSalaryDetails from '@/views/salary-management/salary-details/module/Formadd.vue'
// import ApproveSalaryAccounting from '@/views/salary-management/Salary_accounting/module/Formadd.vue'

import ApproveResearchCommissionBonus from '@/views/salary-management/commission/research-commission-bonus/module/Formadd.vue'

import ApproveSaleCommissionBonus from '@/views/salary-management/commission/sale-commission-bonus/module/AddForm.vue'
import ApproveSoftwareAndHardware from '@/views/salary-management/commission/softwareAndHardware/module/Formadd.vue'
export default {
  //考勤模块
  42: ApproveBusinessTrip, //出差申请
  43: ApproveLeave, //请假申请
  41: ApproveSupplementCard, //补卡申请
  45: ApproveSupplementCard, //补卡申请
  40: ApproveOverTime, //加班申请
  46: ApproveOverTime, //加班申请
  47: ApproveOverTime,
  84: ApproveGoing, //外出申请
  //考勤模块 END
  34: ViewCanteenMenu, //食堂菜单
  28: 'ROUTE:wrm-report-daily-set', //日报
  29: 'ROUTE:wrm-report-week-set', //周报
  30: 'ROUTE:wrm-report-month-set', //月报

  25: ApproveRefundReceipt, //退款单
  26: ApprovePresentReceipt, //赠送单
  27: ViewIncomeReceipt, //进款单
  31: ViewMeetingManagement, //会议管理消息，进入会议详情
  32: ViewMeetingManagement, //会议启动消息，提示进入会议列表
  62: ApproveVehicleManagement, //用车申请
  69: ApproveYearEndBonus, //年终奖金
  70: ApproveOtherBonus, // 其他奖金
  71: ApproveCapitalBill, //罚款单
  72: ApproveSeniorWorker, // 高级工程师
  74: ApproveSaleCommissionBonus, // 销售提成奖金
  // 80: ApproveSalaryDetails, // 工资条
  80: 'ROUTE:salary-details', // 工资条

  88: ApproveDistributorContractManagement, //经销商合同
  89: ApproveStrategicCooperationAgreement, //战略合作协议
  90: ApproveRefundApply, //返款申请
  91: ApproveRecordDeducted, //业绩扣除单
  92: ApproveBusinessBorrowing, //经营借用协议
  93: ApproveBidBorrowing, //资质借用投标借用协议
  94: { //代签购货合同
    name: 'previewTripartiteContracts',
    _customRoute: true,
    props: function (id, action, from) {
      return {
        queryOneData: {
          id
        },
        action,
        from
      }
    }
  },
  95: ApproveAfterSales, //产品售后服务外包协议
  97: ApproveResearchCommissionBonus, // 研发提成奖金
  98: { //常规物料规则
    name: 'material-rule-management-audit-routine',
    _customRoute: true,
    props: function (id, action, from) {
      // action 'view' 查看  'approval' 审批
      return {
        type: 1,
        tabKey: action === 'view' ? 1 : 2
      }
    }
  },
  99: { //成品物料规则
    name: 'material-rule-management-audit-finished-product',
    _customRoute: true,
    props: function (id, action, from) {
      return {
        type: 2,
        tabKey: action === 'view' ? 1 : 2
      }
    }
  },
  101: ApproveSoftwareAndHardware, // 软硬件提成奖金
  102: ApproveSaleCommissionBonus, // 销售提成奖金
  // 103: ApproveSalaryAccounting, // 薪资核算
  103: 'ROUTE:Salary_accounting', // 薪资核算

}
