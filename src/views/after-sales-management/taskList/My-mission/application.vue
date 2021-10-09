<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">保存</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>任务单编号</td>
            <td>{{ record.taskNum }}</td>
          </tr>
          <tr>
            <td>网点人员信息</td>
            <td>
              <a-form-item>
                <a-cascader
                  style="width: 400px"
                  disabled
                  :field-names="{ label: 'networkName', value: 'id', children: 'serviceUserVoList' }"
                  :options="options"
                  v-decorator="['networkId', { rules: [{ required: true, message: '请选择上门服务人员信息!' }] }]"
                  placeholder="请选择上门服务人员信息"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>首次故障排查费（元/次）</td>
            <td>
              <a-form-item>
                <a-input
                  style="width: 400px"
                  disabled
                  placeholder="输入首次故障排查费（元/次）"
                  v-decorator="[
                    'screeningCost',
                    { rules: [{ required: true, message: '输入首次故障排查费（元/次）!' }] },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>故障处理费</td>
            <td>
              <a-form-item>
                <a-input
                  style="width: 400px"
                  disabled
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
                  style="width: 200px"
                  placeholder="输入账号"
                  v-decorator="['account', { rules: [{ required: true, message: '输入账号!' }] }]"
                />
              </a-form-item>
            </td>
            <td>付款总额</td>
            <td>
              {{
                recordDetails.taskUserInfo &&
                recordDetails.taskUserInfo.troubleshootingCost + recordDetails.taskUserInfo &&
                recordDetails.taskUserInfo.screeningCost
              }}
            </td>
          </tr>
          <tr>
            <td>付款附言</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  placeholder="输入付款附言"
                  v-decorator="['paymentPostscript', { rules: [{ required: false, message: '输入付款附言!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  networkManagementList,
  addAndUpdateNetworkPaymentRequest,
  taskDocumentDetail,
} from '@/api/after-sales-management' //机构名称
export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      opinionData: [],
      birthplaceOptions: [], //籍贯 级联 省市
      labelName: undefined,
      record: {},
      mobile: '',
      options: [],
      recordDetails: {},
      visible: false,
      sceneType: false,
      serType: false,
      spinning: false,
      previewImage: '',
      previewVisible1: false,
      saleuserShow: false,
      type: 'add',

      userInfo: this.$store.getters.userInfo,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
    }
  },
  computed: {
    modalTitle() {
      let txt = this.isAdd ? '新增' : this.isVeiw ? '详情' : '修改'
      return `${txt}付款申请`
    },
    isAdd() {
      //查看
      return this.type === 'add'
    },
    isVeiw() {
      return this.type === 'veiw'
    },
    isEditSalary() {
      //修改
      return this.type === 'handle'
    },
    isDisabled() {
      return this.isVeiw
    },
  },

  created() {},
  methods: {
    async query(type, record) {
      this.visible = true
      this.fileList = []
      this.fileList1 = []
      this.type = type
      this.record = record
      networkManagementList().then(
        (res) =>
          (this.options = res.data.map((i) => {
            return {
              networkName: i.networkName,
              id: i.id,
              serviceUserVoList: i.serviceUserVoList.map((u) => {
                return {
                  networkName: `${u.serviceUserName}(${u.contactInformation})`,
                  id: `${u.serviceUserName}(${u.contactInformation})`,
                }
              }),
            }
          }))
      )
      this.fillData()
    },
    fillData() {
      let that = this
      let id = {
        id: this.record.id,
      }
      taskDocumentDetail(id).then((res) => {
        that.recordDetails = res.data
        this.$nextTick(() => {
          this.form.setFieldsValue({
            screeningCost: res.data.taskUserInfo.screeningCost,
            troubleshootingCost: res.data.taskUserInfo.troubleshootingCost,
            networkId: [res.data.taskUserInfo.networkId, res.data.taskUserInfo.serviceUserName],
          })
        })
      })
    },
    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.type === 'add') {
        that.form.validateFields((err, values) => {
          if (!err) {
            console.log(values)

            let params = {
              // id: this.recordDetails.taskUserInfo.id,
              taskDocumentId: this.record.id,
              account: values.account,
              bankName: values.bankName,
              customerName: values.customerName,
              networkId: values.networkId[0],
              paymentPostscript: values.paymentPostscript,
              screeningCost: this.recordDetails.taskUserInfo.screeningCost,
              troubleshootingCost: this.recordDetails.taskUserInfo.troubleshootingCost,
              totalPayment:
                this.recordDetails.taskUserInfo.screeningCost + this.recordDetails.taskUserInfo.troubleshootingCost,
            }

            that.spinning = true
            addAndUpdateNetworkPaymentRequest(params)
              .then((res) => {
                that.spinning = false
                console.log(res)
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('filet')
              })
              .catch((err) => (that.spinning = false))
          }
        })
      }
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
  padding: 15px 10px;
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
</style>