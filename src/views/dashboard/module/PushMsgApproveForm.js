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

import ApproveYearEndBonus from '@views/salary-management/bonus/bonusRules/yearDonusRules/module/Formadd.vue'
import ApproveOtherBonus from '@/views/salary-management/bonus/other_bonus/module/Formadd.vue'
import ApproveSeniorWorker from '@/views/Human-resource-management/senior_worker/module/Formadd.vue'

import ApproveCapitalBill from '@/views/salary-management/capital/bill/module/Formadd.vue'
// import ApproveSalaryDetails from '@/views/salary-management/salary-details/module/Formadd.vue'
// import ApproveSalaryAccounting from '@/views/salary-management/Salary_accounting/module/Formadd.vue'

import ApproveResearchCommissionBonus from '@/views/salary-management/commission/research-commission-bonus/module/Formadd.vue'

import ApproveSaleCommissionBonus from '@/views/salary-management/commission/sale-commission-bonus/module/AddForm.vue'
import ApproveSoftwareAndHardware from '@/views/salary-management/commission/softwareAndHardware/module/Formadd.vue'


import ApproveProcurementApply from '@/views/procurement-module-management/apply/AddForm.vue'
import ApprovePurchaseContract from '@/views/procurement-module-management/purchase-contract/modules/MsgView.vue'

import ApproveProcurementApplyChange from '@/views/procurement-module-management/applychange/AddForm.vue'

export default {
  //????????????
  42: ApproveBusinessTrip, //????????????
  43: ApproveLeave, //????????????
  41: ApproveSupplementCard, //????????????
  45: ApproveSupplementCard, //????????????
  40: ApproveOverTime, //????????????
  46: ApproveOverTime, //????????????
  47: ApproveOverTime,
  84: ApproveGoing, //????????????
  //???????????? END
  34: ViewCanteenMenu, //????????????
  28: 'ROUTE:wrm-report-daily-set', //??????
  29: 'ROUTE:wrm-report-week-set', //??????
  30: 'ROUTE:wrm-report-month-set', //??????

  25: ApproveRefundReceipt, //?????????
  26: ApprovePresentReceipt, //?????????
  27: ViewIncomeReceipt, //?????????
  31: ViewMeetingManagement, //???????????????????????????????????????
  32: ViewMeetingManagement, //?????????????????????????????????????????????
  62: ApproveVehicleManagement, //????????????
  69: ApproveYearEndBonus, //????????????
  70: ApproveOtherBonus, // ????????????
  71: ApproveCapitalBill, //?????????
  72: ApproveSeniorWorker, // ???????????????
  74: ApproveSaleCommissionBonus, // ??????????????????
  // 80: ApproveSalaryDetails, // ?????????
  80: 'ROUTE:salary-details', // ?????????

  88: ApproveDistributorContractManagement, //???????????????
  89: ApproveStrategicCooperationAgreement, //??????????????????
  90: ApproveRefundApply, //????????????
  91: ApproveRecordDeducted, //???????????????
  92: ApproveBusinessBorrowing, //??????????????????
  93: ApproveBidBorrowing, //??????????????????????????????
  94: { //??????????????????
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
  95: ApproveAfterSales, //??????????????????????????????
  97: ApproveResearchCommissionBonus, // ??????????????????
  98: { //??????????????????
    name: 'material-rule-management-audit-routine',
    _customRoute: true,
    props: function (id, action, from) {
      // action 'view' ??????  'approval' ??????
      return {
        type: 1,
        tabKey: action === 'view' ? 1 : 2
      }
    }
  },
  99: { //??????????????????
    name: 'material-rule-management-audit-finished-product',
    _customRoute: true,
    props: function (id, action, from) {
      return {
        type: 2,
        tabKey: action === 'view' ? 1 : 2
      }
    }
  },
  101: ApproveSoftwareAndHardware, // ?????????????????????
  102: ApproveSaleCommissionBonus, // ??????????????????
  // 103: ApproveSalaryAccounting, // ????????????
  103: 'ROUTE:Salary_accounting', // ????????????
  132:ApproveProcurementApply, // ????????????-??????????????????
  160:ApproveProcurementApplyChange,// ?????????????????????
  161:ApprovePurchaseContract, // ????????????
}
