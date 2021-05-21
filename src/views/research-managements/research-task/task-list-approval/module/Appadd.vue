<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="approvalsuspend || approvalgiveUp">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction()">不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction()">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>任务编号</td>
            <td>{{ carCodeDetail.taskNum }}</td>
          </tr>
          <tr>
            <td>来源</td>
            <td>{{ carCodeDetail.taskSource === 1 ? '销售订单' : '核价单' }}</td>
          </tr>
          <tr>
            <td>单据编号</td>
            <td>{{ carCodeDetail.sourceNum }}</td>
          </tr>
          <tr>
            <td>销售负责人</td>
            <td>{{ carCodeDetail.salerName }}</td>
          </tr>
          <tr>
            <td>产品名称</td>
            <td>{{ carCodeDetail.productName }}</td>
          </tr>
          <tr>
            <td>产品代码</td>
            <td>{{ carCodeDetail.productCode }}</td>
          </tr>
          <tr>
            <td>项目描述</td>
            <td>{{ carCodeDetail.productDesc }}</td>
          </tr>
          <tr>
            <td>项目负责人</td>
            <td>{{ carCodeDetail.chargeName }}</td>
          </tr>
          <tr>
            <td>难易系数</td>
            <td>{{ carCodeDetail.difficult }}</td>
          </tr>
          <tr>
            <td>计划完成时间</td>
            <td>{{ carCodeDetail.explainFinishTime }}</td>
          </tr>
          <template v-if="viewsuspend || approvalsuspend">
            <tr>
              <td>倒计时(H)</td>
              <td>{{ carCodeDetail.countdownTime }}</td>
            </tr>
            <tr>
              <td>暂停原因</td>
              <td>{{ carCodeDetail.reason }}</td>
            </tr>
          </template>

          <template v-if="viewgiveUp || approvalgiveUp">
            <tr>
              <td>倒计时(H)</td>
              <td>{{ carCodeDetail.countdownTime }}</td>
            </tr>
            <tr>
              <td>放弃原因</td>
              <td>{{ carCodeDetail.reason }}</td>
            </tr>
            <tr>
              <td>放弃类别</td>
              <td>{{ carCodeDetail.giveUpType === 1 ? '私人原因' : '公司政策' }}</td>
              <!-- <td>
                <a-form-item>
                  <a-select
                    placeholder="选择放弃类别"
                    v-decorator="['giveUpType', { rules: [{ required: true, message: '请选择放弃类别' }] }]"
                    :allowClear="true"
                    style="width: 70%"
                  >
                    <a-select-option :value="1">私人原因</a-select-option>
                    <a-select-option :value="2">公司政策</a-select-option>
                  </a-select>
                </a-form-item>
              </td> -->
            </tr>
            <tr>
              <td>工作效率</td>
              <td>
                <a-form-item>
                  <a-input
                    placeholder="输入工作效率"
                    v-decorator="['workEfficiencyRetio', { rules: [{ required: true, message: '输入工作效率' }] }]"
                    :allowClear="true"
                    style="width: 100%"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>完成度</td>
              <td>
                <a-form-item>
                  <a-input
                    placeholder="输入完成度"
                    v-decorator="['finishScale', { rules: [{ required: true, message: '输入完成度' }] }]"
                    :allowClear="true"
                    style="width: 100%"
                  />
                </a-form-item>
              </td>
            </tr>
          </template>
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { task_getTaskExcuteHisDetail, task_approvalHis } from '@/api/researchManagement'
import moment from 'moment'
import Approval from './Approval'
export default {
  name: 'BecomingForm',
  components: {
    Approval,
  },

  data() {
    return {
      departmentList: [], //所有部门
      degree: [],
      carCodeDetail: {},
      postSelectDataSource: [],
      visible: false,
      spinning: false,
      record: {},
      carCodeList: [],
      type: 'viewsuspend',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    modalTitle() {
      let tit = this.approvalsuspend || this.approvalgiveUp ? '审批' : '查看'
      return `${tit}`
    },
    viewsuspend() {
      return this.type === 'viewsuspend'
    },
    approvalsuspend() {
      return this.type === 'approvalsuspend'
    },
    viewgiveUp() {
      return this.type === 'viewgiveUp'
    },
    approvalgiveUp() {
      return this.type === 'approvalgiveUp'
    },
  },
  watch: {},
  created() {},
  methods: {
    moment,
    query(type, record) {
      console.log(record)
      this.record = record
      this.type = type
      this.visible = true
      this.fillData(record)
    },

    fillData(record) {
      task_getTaskExcuteHisDetail({ id: record.id }).then((res) => {
        console.log(res)
        if (res.data.countdownTime !== null) {
          let react = res.data.countdownTime.toString()
          let arr = react.split('.')
          let str = '0.' + arr[1]
          res.data.countdownTime = arr[0] + '小时' + parseInt(str * 60) + '分钟'
        }
        this.carCodeDetail = res.data
      })
    },
    handleOk() {
      this.visible = false
      // let that = this
      // if (that.isView) {
      //   return (that.visible = false)
      // }
      // that.form.validateFields((err, values) => {
      //   if (!err) {
      //     if (that.isSuspend) {
      //       let react = {
      //         taskId: this.record.id,
      //         reason: values.reason,
      //         operationType: 2,
      //       }
      //       values.developmentTaskExcuteHis = react
      //       delete values.reason

      //       task_listStopHis(values)
      //         .then((res) => {
      //           that.spinning = false
      //           that.form.resetFields() // 清空表
      //           that.visible = false
      //           that.$message.info(res.msg)
      //           that.$emit('finish')
      //         })
      //         .catch((err) => (that.spinning = false))
      //     }
      //     if (that.isGiveUp) {
      //       let react = {
      //         taskId: this.record.id,
      //         reason: values.reason,
      //         giveUpType: values.giveUpType,
      //         operationType: 5,
      //       }
      //       values.developmentTaskExcuteHis = react
      //       delete values.reason
      //       delete values.giveUpType

      //       task_listWaiveHis(values)
      //         .then((res) => {
      //           that.spinning = false
      //           that.form.resetFields() // 清空表
      //           that.visible = false
      //           that.$message.info(res.msg)
      //           that.$emit('finish')
      //         })
      //         .catch((err) => (that.spinning = false))
      //     }
      //   }
      // })
    },
    // 审批
    submitAction(opt) {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          if (this.approvalsuspend) {
            values = {
              approveId: this.record.id,
              isAdopt: opt.isAdopt,
              opinion: opt.opinion,
            }
          } else {
            values = {
              approveId: this.record.id,
              isAdopt: opt.isAdopt,
              opinion: opt.opinion,
              finishScale: values.finishScale,
              workEfficiencyRetio: values.workEfficiencyRetio,
            }
          }

          that.spinning = true
          task_approvalHis(values)
            .then((res) => {
              that.spinning = false
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        opinion: '通过',
      })
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
    handleCancel() {
      this.form.resetFields() // 清空表
      this.visible = false
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 10px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
.process_tips {
  background-color: antiquewhite;
}
.process_header_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: antiquewhite;
  font-weight: 700;
  border: 1px solid #ddd;
}
.process_header_wrapper .draggable-columns-2 {
  flex: 1;
}
.process_main_wrapper {
  border: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.process_main_wrapper .draggable-columns-item:last-child {
  border-bottom: none;
}
.process_main_wrapper .draggable-columns-2 {
  flex: 1;
}
.draggable-columns {
  text-align: center;
  line-height: 35px;
  cursor: move;
}
.draggable-columns-1,
.draggable-columns-3 {
  width: 50%;
}
.draggable-columns-3 {
  cursor: pointer;
}
.ghost {
  background-color: rgba(250, 235, 215, 0.5);
}
</style>