<template>

    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <a-form-item hidden>
          <a-input v-decorator="['instanceId', { initialValue: detail.instanceId }]" />
        </a-form-item>
        <a-form-item hidden>
          <a-input v-decorator="['borrowId', { initialValue: detail.borrowId }]" />
        </a-form-item>

        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>销售人员</td>
            <td>
              <a-form-item>
                <a-form-item hidden>
                  <a-input v-decorator="['userId', { initialValue: detail.userId }]" />
                </a-form-item>
                <span>{{ detail.trueName || detail.salesmanName }}</span>
              </a-form-item>
            </td>
            <td>客户名称</td>
            <td>
              <a-form-item hidden>
                <a-input v-decorator="['customerName', { initialValue: detail.customerName }]" />
              </a-form-item>
              <span>{{ detail.customerName }}</span>
            </td>
          </tr>
          <tr>
            <td>微信号</td>
            <td>
              <a-form-item hidden>
                <a-input v-decorator="['wxNum', { initialValue: detail.wxNum }]" />
              </a-form-item>
              <span>{{ detail.wxNum }}</span>
            </td>
            <td>邮箱</td>
            <td>
              <a-form-item hidden>
                <a-input v-decorator="['email', { initialValue: detail.email }]" />
              </a-form-item>
              <span>{{ detail.email }}</span>
            </td>
          </tr>
        </table>
          <h3 style="margin-top: 10px">
            <span>合同信息</span>
            <a v-if="isView" href="javascript:void(0);" style="float:right;" @click="viewContract">预览合同</a>
          </h3>
          <table class="custom-table custom-table-border">
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
      <div style="margin: 20px 0">
        <template v-if="isAdd">
          <!-- <a-button key="back" @click="handleCancel">取消</a-button> -->
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
        </template>
      </div>

      <a-modal
        title="预览合同"
        :width="1200"
        :visible="visible"
        :footer="null"
        @cancel="handleCancel"
      >
        <PreviewBidBorrowing :contractId="detail.id"/>
      </a-modal>
    </a-spin>
</template>
<script>
import { bidDetailBorrowId, bidaddOrUpdat, bidProtocolNum } from '@/api/agencyContract'
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
import ProvinceTreeCascade from '@/components/CustomerList/ProvinceTreeCascade'
import { getListSaleContractUser } from '@/api/contractListManagement'
import { getListByText } from '@/api/workBox'
import moment from 'moment'
import PreviewBidBorrowing from '../contractView/previewBidBorrowing'
let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'addForm',
  components: { ProvinceTreeCascade, CustomerSelect ,PreviewBidBorrowing},
  data() {
    return {
      form: this.$form.createForm(this,{name:'qualifications-borrow-management-step2-1'}),
      visible: false,
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
      let task2 = getListSaleContractUser().then((res) => {
        that.saleUsers = res.data
      })
      queue.push(task2)
      if (that.isAdd) {
        let task3 = bidProtocolNum().then((res) => {
          that.detail = {...that.detail,contractNum:res.data}
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
    async query(type, record={},fillData={}) {
      //debugger
      let that = this
      await that.form.resetFields()
      that.actionType = type
      that.record = Object.assign({}, record)
      that.detail = {}
      await that.init()

      if (that.isAdd) {
        that.detail = {...that.detail,...fillData,borrowId:that.record.borrowId}
        that.$nextTick(() =>{
          that.form.setFieldsValue({borrowId:that.record.borrowId || undefined})
          that.form.setFieldsValue(fillData)
        })
        return
      }

      let {id,borrowId} = that.record
      let param = {}
      if(id && borrowId){
        param.id = id
        param.borrowId = borrowId
      }else{
        param.id = id
      }

      await bidDetailBorrowId(param).then((res) => {
        that.detail = res.data
        // that.form.setFieldsValue({ ...that.detail })
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

          //productCategoryList
          console.log('Received values of form: ', values)
          //return
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
      this.$nextTick(() => (this.visible = false))
    },
    viewContract(){
      this.visible = true
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