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
      <template v-if="isEdit">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction()">驳回</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction()">认领</a-button>
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
            <td style="width: 160px">项目描述</td>
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

          <template v-if="isViews">
            <tr>
              <td>倒计时(H)</td>
              <td>{{ carCodeDetail.countdownTime }}</td>
            </tr>
          </template>
          <template v-if="isSuspend">
            <tr>
              <td>倒计时(H)</td>
              <td>{{ carCodeDetail.countdownTime }}</td>
            </tr>
            <tr>
              <td>暂停原因</td>
              <td>
                <a-form-item>
                  <a-textarea
                    placeholder="暂停原因"
                    :rows="2"
                    v-decorator="['reason', { rules: [{ required: true, message: '请输入暂停原因' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
          </template>

          <template v-if="isGiveUp">
            <tr>
              <td>倒计时(H)</td>
              <td>{{ carCodeDetail.countdownTime }}</td>
            </tr>
            <tr>
              <td>放弃原因</td>
              <td>
                <a-form-item>
                  <a-textarea
                    placeholder="放弃原因"
                    :rows="2"
                    v-decorator="['reason', { rules: [{ required: true, message: '请输入放弃原因' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>放弃类别</td>
              <td>
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
import {
  task_listStopHis,
  task_getDevelopmentTaskInfo,
  task_listclaimHis,
  task_listoverruledHis,
  task_listWaiveHis,
} from '@/api/researchManagement'
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
      type: 'View',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    modalTitle() {
      let tit = this.isEdit ? '认领' : '查看'
      return `${tit}`
    },
    isViews() {
      return this.type === 'views'
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.type === 'Dispatch'
    },
    isSuspend() {
      return this.type === 'suspend'
    },
    isGiveUp() {
      return this.type === 'giveUp'
    },

    isDisabled() {
      return this.isView || this.isEditSalary
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
      task_getDevelopmentTaskInfo({ id: record.id }).then((res) => {
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
      let that = this
      if (that.isView) {
        return (that.visible = false)
      }
      that.form.validateFields((err, values) => {
        if (!err) {
          if (that.isSuspend) {
            let react = {
              taskId: this.record.id,
              reason: values.reason,
              operationType: 2,
            }
            values.developmentTaskExcuteHis = react
            delete values.reason

            task_listStopHis(values)
              .then((res) => {
                that.spinning = false
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('finish')
              })
              .catch((err) => (that.spinning = false))
          }
          if (that.isGiveUp) {
            let react = {
              taskId: this.record.id,
              reason: values.reason,
              giveUpType: values.giveUpType,
              operationType: 5,
            }
            values.developmentTaskExcuteHis = react
            delete values.reason
            delete values.giveUpType

            task_listWaiveHis(values)
              .then((res) => {
                that.spinning = false
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('finish')
              })
              .catch((err) => (that.spinning = false))
          }

          // let react = {
          //   taskId: this.record.id,
          // }
          // values.developmentTaskExcuteHis = react

          //   task_appointHis(values)
          //     .then((res) => {
          //       that.spinning = false
          //       that.form.resetFields() // 清空表
          //       that.visible = false
          //       that.$message.info(res.msg)
          //       that.$emit('finish')
          //     })
          //     .catch((err) => (that.spinning = false))
        }
      })
    },
    // 认领任务
    // submitAction(opt) {

    // },
    passAction() {
      let that = this
      let values = {
        developmentTaskExcuteHis: {
          taskId: that.record.id,
          operationType: 1,
        },
      }
      that.spinning = true
      task_listclaimHis(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //驳回意见
      let that = this
      let values = {
        developmentTaskExcuteHis: {
          taskId: that.record.id,
          operationType: 6,
          reason: opinion,
        },
      }
      that.spinning = true
      task_listoverruledHis(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
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