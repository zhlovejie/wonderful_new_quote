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

export default {
  //考勤模块
  42:ApproveBusinessTrip,//出差申请
  43:ApproveLeave, //请假申请
  45:ApproveSupplementCard, //补卡申请
  46:ApproveOverTime,//加班申请
  47:ApproveOverTime,
  84:ApproveGoing, //外出申请
  //考勤模块 END
  34:ViewCanteenMenu, //食堂菜单
  28:'ROUTE:wrm-report-daily-set',//日报
  29:'ROUTE:wrm-report-week-set', //周报
  30:'ROUTE:wrm-report-month-set', //月报

  25:ApproveRefundReceipt, //退款单
  26:ApprovePresentReceipt,//赠送单
  27:ViewIncomeReceipt, //进款单

  31:ViewMeetingManagement, //会议管理消息，进入会议详情
  32:ViewMeetingManagement, //会议启动消息，提示进入会议列表

  62:ApproveVehicleManagement, //用车申请
}