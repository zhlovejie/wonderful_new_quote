<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="confirmLoading" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 25%">任务单编号</td>
            <td style="width: 25%">{{ record.taskDocumentNum }}</td>
            <td style="width: 25%">网点名称</td>
            <td style="width: 25%">
              {{ record.networkName }}
            </td>
          </tr>
          <tr>
            <td>业务员</td>
            <td>{{ record.serviceUser.split(',')[0] }}</td>
            <td>业务员手机号</td>
            <td>
              {{ record.serviceUser.split(',')[1] }}
            </td>
          </tr>
          <tr>
            <td>首次故障排查费（元/次）</td>
            <td>
              <a-form-item>
                <a-input
                  style="width: 200px"
                  :disabled="isDisabled"
                  @change="onchange"
                  placeholder="输入首次故障排查费（元/次）"
                  v-decorator="[
                    'screeningCost',
                    { rules: [{ required: true, message: '输入首次故障排查费（元/次）!' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td>故障处理费</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  @change="onchange1"
                  style="width: 200px"
                  placeholder="输入故障处理费"
                  v-decorator="['troubleshootingCost', { rules: [{ required: true, message: '输入故障处理费!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
        <h3>付款信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>客户名称</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  style="width: 200px"
                  placeholder="输入客户名称"
                  v-decorator="['customerName', { rules: [{ required: true, message: '输入客户名称!' }] }]"
                />
              </a-form-item>
            </td>
            <td>开户行名称</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  style="width: 200px"
                  placeholder="输入开户行名称"
                  v-decorator="['bankName', { rules: [{ required: true, message: '输入开户行名称!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>账号</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  style="width: 200px"
                  placeholder="输入账号"
                  v-decorator="['account', { rules: [{ required: true, message: '输入账号!' }] }]"
                />
              </a-form-item>
            </td>
            <td>付款总额</td>
            <td>
              {{ Number(arr) + Number(arr1) }}
            </td>
          </tr>
          <tr>
            <td>付款附言</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  :disabled="isDisabled"
                  placeholder="输入付款附言"
                  v-decorator="['paymentPostscript', { rules: [{ required: false, message: '输入付款附言!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>

    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-modal>
</template>

<script>
import {
  networkPaymentRequestDetail,
  approvalNetworkPaymentRequest,
  addAndUpdateNetworkPaymentRequest,
} from '@/api/after-sales-management'
import Approval from './Approval'
export default {
  name: 'EnterpriseSynopsis',
  components: {
    Approval,
  },
  data() {
    return {
      arr: undefined,
      arr1: undefined,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      Warehouse: [],
      serviceUserVoList: [],
      visible: false,
      confirmLoading: false,
      addOredit: 'add',
      type: 0,
      record: {},
      recordDetails: {},
      toolType: 0,
      queryBoolean: false,
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
    modalTitle() {
      let txt = this.isView ? '查看' : this.isEdit ? '修改' : '新增'
      return `${txt}`
    },
    isView() {
      return this.addOredit === 'view'
    },
    isAdd() {
      return this.addOredit === 'add'
    },
    isEdit() {
      return this.addOredit === 'edit'
    },
    isApproval() {
      return this.addOredit === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
  },
  methods: {
    onchange(e) {
      const v = e.target.value
      this.arr = v
    },
    onchange1(e) {
      const v = e.target.value
      this.arr1 = v
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      approvalNetworkPaymentRequest(values)
        .then((res) => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.close()
        })
        .catch((err) => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
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
    handleAdd() {
      this.$refs.dictionaries.query()
    },

    async query(type, record) {
      let that = this
      that.visible = true
      that.addOredit = type
      that.record = record
      if (type !== 'add') {
        networkPaymentRequestDetail({ id: record.id }).then((res) => {
          that.recordDetails = res.data
          this.arr = res.data.screeningCost
          this.arr1 = res.data.troubleshootingCost
          that.$nextTick(() => {
            this.form.setFieldsValue({
              screeningCost: res.data.screeningCost,
              troubleshootingCost: res.data.troubleshootingCost,
              customerName: res.data.customerName,
              bankName: res.data.bankName,
              account: res.data.account,
              paymentPostscript: res.data.paymentPostscript,
            })
          })
        })
      }
    },

    close() {
      this.form.resetFields() // 清空表
      this.visible = false
    },
    handleOk() {
      const _this = this
      if (this.isView) {
        return (this.visible = false)
      }
      if (this.isEdit) {
        _this.form.validateFields((err, values) => {
          if (!err) {
            console.log(values)

            let params = {
              instanceId: this.record.instanceId,
              id: this.recordDetails.id,
              taskDocumentId: this.recordDetails.taskDocumentId,
              account: values.account,
              bankName: values.bankName,
              customerName: values.customerName,
              networkId: this.recordDetails.networkId,
              paymentPostscript: values.paymentPostscript,
              screeningCost: values.screeningCost,
              troubleshootingCost: values.troubleshootingCost,
              totalPayment: values.screeningCost + values.troubleshootingCost,
            }

            _this.spinning = true
            addAndUpdateNetworkPaymentRequest(params)
              .then((res) => {
                _this.spinning = false
                console.log(res)
                _this.form.resetFields() // 清空表
                _this.visible = false
                _this.$message.info(res.msg)
                _this.$emit('filet')
              })
              .catch((err) => (_this.spinning = false))
          }
        })
      }
    },

    handleCancel() {
      this.close()
    },
  },
}
</script>

<style scoped >
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.input_video {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
.ant-form-item {
  margin-bottom: 0;
}
</style>
