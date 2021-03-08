<template>
  <a-form :form="form" class="wdf-custom-add-form-wrapper">
    <a-form-item hidden>
      <a-input v-decorator="['id']" />
    </a-form-item>
    <a-form-item hidden>
      <a-input v-decorator="['instanceId']" />
    </a-form-item>
    <h3>
      <span>经销商合同信息</span>
      <a v-if="isView" href="javascript:void(0);" style="float:right;" @click="viewContract">预览合同</a>
    </h3>
    <table class="custom-table custom-table-border">
      <tr>
        <td style="width: 15%">合同编号</td>
        <td style="width: 35%">
          <span v-if="!isDisabled" style="color: #999">系统自动生成</span>
          <span v-else>{{ detail.contractNum }}</span>
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
            <span v-else>{{ detail.signingDate }}</span>
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>有效期</td>
        <td>
          <a-form-item>
            <a-range-picker
              v-if="!isDisabled"
              style="width: 100%"
              :allowClear="true"
              v-decorator="[
                `effective`,
                {
                  initialValue: [
                    detail.effectiveStart ? moment(detail.effectiveStart) : moment(), 
                    detail.effectiveEnd ? moment(detail.effectiveEnd) : moment()
                  ],
                  rules: [{ required: true, message: '请选择代班时间' }],
                },
              ]"
              @change="rangePickerChange"
            />
            <span v-else>{{ detail.effectiveStart }} ~ {{ detail.effectiveEnd }}</span>
          </a-form-item>
        </td>
        <td>单位全称</td>
        <td>
          <a-form-item>
            <a-input
              v-if="!isDisabled"
              v-decorator="[
                'fullName',
                { initialValue: detail.fullName, rules: [{ required: true, message: '请输入单位全称' }] },
              ]"
            />
            <span v-else>{{ detail.fullName }}</span>
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>电话/传真</td>
        <td>
          <a-form-item>
            <a-input
              v-if="!isDisabled"
              v-decorator="[
                'tel',
                { initialValue: detail.tel, rules: [{ required: true, message: '请输入电话/传真' }] },
              ]"
            />
            <span v-else>{{ detail.tel }}</span>
          </a-form-item>
        </td>
        <td>地址</td>
        <td>
          <a-form-item>
            <a-input v-if="!isDisabled" v-decorator="['address', { initialValue: detail.address }]" />
            <span v-else>{{ detail.address }}</span>
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>微信号</td>
        <td>
          <a-form-item>
            <a-input v-if="!isDisabled" v-decorator="['customerWxNum', { initialValue: detail.customerWxNum }]" />
            <span v-else>{{ detail.customerWxNum }}</span>
          </a-form-item>
        </td>
        <td>邮政编码</td>
        <td>
          <a-form-item>
            <a-input v-if="!isDisabled" v-decorator="['postalCode', { initialValue: detail.postalCode }]" />
            <span v-else>{{ detail.postalCode }}</span>
          </a-form-item>
        </td>
      </tr>
    </table>
    <p v-if="isView && detail.accessory">
      已上传文件：<a target="_blank" v-download="detail.accessory">{{ detail.accessory }}</a>
    </p>
    <p style="text-align: center">
      <template v-if="isAdd">
        <a-button key="cancel" :loading="spinning" @click="handleCancel">取消</a-button>
        <a-button style="margin-left: 10px" key="save" type="primary" :loading="spinning" @click="() => handleOk(1)"
          >保存</a-button
        >
        <a-button style="margin-left: 10px" key="submit" type="primary" :loading="spinning" @click="() => handleOk(2)"
          >提交</a-button
        >
      </template>
    </p>
    <PreviewDistributorContract ref="previewDistributorContract" />
  </a-form>
</template>

<script>
import { dealerContractAddOrUpdate, dealerContractDetail } from '@/api/qualificationsBorrowManagement'
import PreviewDistributorContract from '@/views/sales-management/distributor-contract-management/module/View.vue'
import moment from 'moment'
export default {
  name: 'AddForm',
  components: {
    PreviewDistributorContract
  },
  data() {
    return {
      form: this.$form.createForm(this,{name:'qualifications-borrow-management-step1-1'}),
      visible: false,
      actionType: 'add',
      opinion: '', //审批意见
      spinning: false,
      contractId: undefined,
      detail: {
        effectiveStart:moment().format('YYYY-MM-DD'),
        effectiveEnd:moment().format('YYYY-MM-DD'),
      },
      record: {},
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}经销商合同`
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
  methods: {
    moment: moment,
    init() {
      //let that = this
      //return Promise.all([])
    },
    handleOk(saveType) {
      const that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          //debugger
          values.signingDate = values.signingDate.format('YYYY-MM-DD')
          values.saveType = saveType

          if(values.effective){
            values.effectiveStart = values.effective[0].format('YYYY-MM-DD')
            values.effectiveEnd = values.effective[1].format('YYYY-MM-DD')
          }
          delete values.effective
          that.$emit('click', { ...values })
        } else {
          that.$emit('click', null)
        }
      })
    },
    handleOkSubmit(values) {
      let that = this
      return dealerContractAddOrUpdate(values)
        .then((res) => {
          if (res.code === 200) {
            that.form.resetFields() // 清空表
            that.visible = false
            that.$message.info(res.msg)
          } else {
            that.$message.info(res.msg)
          }
          return { ...res }
        })
        .catch((err) => {
          return { code: 500, msg: err.message }
        })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.resetData()
      that.actionType = type
      that.record = record || {}
      that.detail = {}
      that.form.resetFields()
      await that.init()
      that.visible = true
      //debugger
      if (that.isAdd) {
        if(record){
          let delAttrs = ['id','borrowId','instanceId','accessory','pdfUrl','status']
          let _values = {...record}
          delAttrs.map(key => delete _values[key])
          that.form.setFieldsValue({
            ..._values,
            effective:[moment(_values.effectiveStart),moment(_values.effectiveEnd)],
            signingDate:moment(_values.signingDate)
          })
        }else{
          that.form.setFieldsValue({effective:[moment(),moment()] })
        }
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

      const _detail = await dealerContractDetail(param).then((res) => res.data)
      that.detail = _detail
    },
    resetData() {
      let that = this
      that.detail = {}
      that.visible = false
      that.actionType = 'add'
      that.opinion = '' //审批意见
      that.spinning = false
    },
    rangePickerChange(arr, strs) {
      console.log(arguments,arr[0] instanceof moment,arr[1] instanceof moment)
      this.detail = {
        ...this.detail,
        effectiveStart: arr[0] instanceof moment ? arr[0].format('YYYY-MM-DD') : undefined,
        effectiveEnd: arr[1] instanceof moment ? arr[1].format('YYYY-MM-DD') : undefined,
      }
      this.form.setFieldsValue({ effective: arr })
    },
    viewContract(){
      this.$refs.previewDistributorContract.query('view',{id:this.detail.id})
    }
  }
}
</script>

<style scoped>
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