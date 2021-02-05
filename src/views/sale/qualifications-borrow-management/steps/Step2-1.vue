<template>
  <a-spin :spinning="spinning">
    <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
      <a-form-item hidden>
        <a-input v-decorator="['id', { initialValue: detail.id }]" />
      </a-form-item>
      <a-form-item hidden>
        <a-input v-decorator="['instanceId', { initialValue: detail.instanceId }]" />
      </a-form-item>

      <table class="custom-table custom-table-border">
        <h3>基本信息</h3>
        <tr>
          <td>销售人员</td>
          <td>
            <a-form-item>
              <a-select
                v-if="!isDisabled && !isEdit"
                :disabled="isEdit"
                :allowClear="true"
                v-decorator="[
                  'userId',
                  { initialValue: detail.userId, rules: [{ required: true, message: '请选择销售人员' }] },
                ]"
                placeholder="请选择销售人员"
                @change="saleUserChange"
              >
                <a-select-option v-for="item in saleUsers" :value="item.userId" :key="item.userId">{{
                  item.salesmanName
                }}</a-select-option>
              </a-select>
              <span v-else>{{ detail.trueName }}</span>
            </a-form-item>
          </td>
          <td>客户名称</td>
          <td>
            <!-- <CustomerSelect
              v-if="!isDisabled && !isEdit"
              ref="customerSelect"
              :needOptions="needOptions"
              :options="customerSelectOptions"
              @selected="handleCustomerSelected"
            /> -->
            <a-form-item>
              <a-input
                v-if="!isDisabled && !isEdit"
                hidden
                v-decorator="[
                  'customerName',
                  { initialValue: detail.customerName, rules: [{ required: true, message: '请选择客户名称' }] },
                ]"
              />
              <span v-else>{{ detail.customerName }}</span>
            </a-form-item>
            <a-form-item hidden>
              <a-input v-decorator="['customerName', { initialValue: detail.customerName }]" />
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>微信号</td>
          <td>
            <a-form-item>
              <a-input
                v-if="!isDisabled && !isEdit"
                type="text"
                v-decorator="[
                  'wxNum',
                  { initialValue: detail.wxNum, rules: [{ required: true, message: '填写微信号' }] },
                ]"
              />
              <span v-else>{{ detail.wxNum }}</span>
            </a-form-item>
          </td>
          <td>邮箱</td>
          <td>
            <a-form-item>
              <a-input
                v-if="!isDisabled && !isEdit"
                type="text"
                v-decorator="[
                  'email',
                  {
                    initialValue: detail.email,
                    rules: [{ required: true, message: '填写电子邮箱' }],
                  },
                ]"
              />
              <span v-else>{{ detail.email }}</span>
            </a-form-item>
          </td>
        </tr>

        <h3 style="margin-top: 10px">合同信息</h3>
        <tr>
          <td style="width: 15%">合同编号</td>
          <td style="width: 35%">
            <span>{{ detail.contractNum }}</span>
          </td>
          <td style="width: 15%">签订日期</td>
          <td style="width: 35%">
            <a-form-item>
              <a-date-picker
                v-if="!isDisabled"
                placeholder="签订日期"
                v-decorator="[
                  'signingDate',
                  {
                    initialValue: detail.signingDate ? moment(detail.signingDate) : moment(),
                    rules: [{ required: true, message: '选择签订日期' }],
                  },
                ]"
                style="width: 100%"
              />
              <span v-else :style="{ color: moment().format('YYYY-MM-DD') !== detail.signingDate ? 'red' : '' }">{{
                detail.signingDate
              }}</span>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>项目名称</td>
          <td>
            <a-form-item>
              <a-input
                v-if="!isDisabled"
                style="width: 100%"
                v-decorator="[
                  'projectName',
                  { initialValue: detail['projectName'], rules: [{ required: true, message: '请输入项目名称' }] },
                ]"
              />
              <span v-else>{{ detail.projectName }}</span>
            </a-form-item>
          </td>
          <td>项目编号</td>
          <td>
            <a-form-item>
              <a-input
                v-if="!isDisabled"
                style="width: 100%"
                v-decorator="[
                  'projectNum',
                  { initialValue: detail['projectNum'], rules: [{ required: true, message: '请输入项目编号' }] },
                ]"
              />
              <span v-else>{{ detail.projectNum }}</span>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>保证金(万元)</td>
          <td colspan="3">
            <a-form-item>
              <a-input-number
                v-if="!isDisabled"
                style="width: 300px"
                :min="0"
                :step="1"
                :precision="2"
                v-decorator="[
                  'earnestMoney',
                  { initialValue: detail['earnestMoney'], rules: [{ required: true, message: '请输入保证金' }] },
                ]"
              />
              <span v-else>{{ detail['earnestMoney'] | moneyFormatNumber }}</span>
            </a-form-item>
          </td>
        </tr>
      </table>
    </a-form>
    <div style="margin: 20px 0" v-if="isAdd">
        <div style="text-align: center">
          <!-- <a-button v-if="isDisabled" key="submit1" type="primary" @click="() => handleSubmit(1)">预览</a-button> -->
          <a-button
            style="margin-left: 10px"
            key="submit2"
            type="primary"
            @click="() => handleSubmit(2)"
            >保存</a-button
          >
          <a-button
            style="margin-left: 10px"
            key="submit3"
            type="primary"
            @click="() => handleSubmit(3)"
            >提交审批</a-button
          >
        </div>
    </div>
  </a-spin>
</template>
<script>
import { biddetail, bidaddOrUpdat } from '@/api/agencyContract'
import ProvinceTreeCascade from '@/components/CustomerList/ProvinceTreeCascade'
import { getListSalesman } from '@/api/contractListManagement'
import { getListByText } from '@/api/workBox'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'addForm',
  components: { ProvinceTreeCascade },
  data() {
    return {
      form: this.$form.createForm(this),
      spinning: false,
      actionType: 'view',
      detail: {},
      record: {},
      spinning: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      saleUsers: [],
      productCategoryList: [],
      customerSelectOptions: {
        inputLabel: '',
        wrapperStyle: { flex: '1' },
        formLayout: 'inline',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired: true,
        inputAllowClear: true,
        inputDisable: false,
      },
      needOptions: {
        userId: undefined,
      },
      contractNum: undefined,
    }
  },
  computed: {
    modalTitle() {
      let obj = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${obj[this.actionType]}`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
  },
  watch: {},
  methods: {
    moment,
    init() {
      let that = this
      let queue = []
      let task1 = getListByText({ text: '产品类型' }).then((res) => {
        that.productCategoryList = res.data.records
      })
      queue.push(task1)
      let task2 = getListSalesman().then((res) => {
        that.saleUsers = res.data
      })
      queue.push(task2)
      if (that.isAdd) {
        let task3 = agencyContractGenerateContractNum().then((res) => {
          let detail = { ...that.detail, contractNum: res.data }
          that.detail = detail
        })
        queue.push(task3)
      }

      //let task4 = that.loadAreaAction(100000).then(res => that.birthplaceOptions = res)
      //queue.push(task4)
      //修改时 客户名称不可修改
      that.customerSelectOptions = { ...that.customerSelectOptions, inputDisable: that.isEdit }

      return Promise.all(queue)
    },
    handleCustomerSelected(item) {
      this.form.setFieldsValue({
        customerId: item && item.id ? item.id : undefined,
        customerName: item.name,
      })
    },
    saleUserChange(saleUserId) {
      //选择销售人员 填充对应的 微信和邮箱
      //特殊处理
      this.needOptions = { userId: saleUserId }
      this.$refs.customerSelect.handleClear()
      this.form.setFieldsValue({ customerId: undefined, customerName: undefined })
      //debugger
      //特殊处理
      let target = this.saleUsers.find((user) => +user.userId === parseInt(saleUserId))
      //console.log(target)
      if (target) {
        let email = undefined,
          wxNum = undefined
        if (target.email) {
          email = target.email
        } else if (target.userInfo && target.userInfo.email) {
          email = target.userInfo.email
        }
        email = email || undefined

        if (target.wxNum) {
          wxNum = target.wxNum
        } else if (target.userInfo && target.userInfo.wxNum) {
          wxNum = target.userInfo.wxNum
        }
        wxNum = wxNum || undefined
        this.form.setFieldsValue({ email, wxNum })
      }
    },

    provinceTreeCascadeChange(result) {
      //debugger
      let { val, txt } = result
      if (val && txt) {
        let str = `${val};${txt}`
        this.form.setFieldsValue({ salesArea: str })
        this.detail = { ...this.detail, salesAreaVal: val.split(',') }
      } else {
        this.form.setFieldsValue({ salesArea: undefined })
        this.detail = { ...this.detail, salesAreaVal: [] }
      }
    },
    getSaleManName(id) {
      let target = this.saleUsers.find((item) => +item.userId === +id)
      return target ? target.salesmanName : ''
    },
    async query(type, record) {
      //debugger
      let that = this
      await that.form.resetFields()
      that.actionType = type
      that.record = Object.assign({}, record)
      that.detail = {}
      await that.init()

      if (that.isAdd) {
        return
      }

      //填充数据
      let {id,borrowId} = that.record
      let param = {}
      if(id && borrowId){
        param.id = id
        param.borrowId = borrowId
      }else{
        param.id = id
      }

      await biddetail(param).then((res) => {
        that.detail = res.data
      })
    },
    handleSubmit(type) {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          values.saveType = +type === 3 ? 2 : 1
          values.contractNum = that.detail.contractNum
          if (that.isEdit) {
            values.id = that.record.id
            values.userId = that.detail.userId
            values.wxNum = that.detail.wxNum
            values.email = that.detail.email
          }
          values.signingDate = values.signingDate.format('YYYY-MM-DD')
          that.spinning = true
          bidaddOrUpdat(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    }

  }
}
</script>
<style>
.ant-upload-list-picture-card .ant-upload-list-item-info::before {
  left: 0;
}
</style>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 150px;
  text-align: left;
  padding-left: 20px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.customer-select-wrapper >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}

.custom-table >>> .custom-table {
  margin-bottom: 0;
  margin: -1px;
}
</style>