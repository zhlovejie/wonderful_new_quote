<template>
  <a-form :form="form" class="wdf-custom-add-form-wrapper">
    <a-form-item hidden>
      <a-input v-decorator="['id']" />
    </a-form-item>
    <a-form-item hidden>
      <a-input v-decorator="['instanceId']" />
    </a-form-item>
    <h3>
      <span>战略合作协议合同信息</span>
      <a v-if="isView" href="javascript:void(0);" style="float:right;" @click="viewContract">预览合同</a>
    </h3>
    <table class="custom-table custom-table-border">
      <tr>
        <td style="width: 15%">合同编号</td>
        <td style="width: 35%">
          <span v-if="!isDisabled" style="color: #999">{{ detail.contractNum || '系统自动生成'}}</span>
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
        <td>合作期限(年)</td>
        <td>
          <a-form-item>
            <a-input-number
              v-if="!isDisabled"
              :min="1"
              :max="99"
              :step="1"
              style="width: 100%"
              v-decorator="[
                'cooperationYear',
                {
                  initialValue: detail.cooperationYear,
                  rules: [{ required: true, message: '请输入合作期限' }],
                },
              ]"
            />
            <span v-else>{{ detail.cooperationYear }}</span>
          </a-form-item>
        </td>
        <td colspan="2"></td>
      </tr>
    </table>
    <p v-if="isView && detail.accessory">
      已上传文件：<a target="_blank" v-download="detail.accessory">{{ detail.accessory }}</a>
    </p>
    <!-- <StatusView :statusFn="statusFn"/> -->
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
      <template v-else></template>
    </p>
    <PreviewStrategicCooperationAgreement ref="previewStrategicCooperationAgreement" />
  </a-form>
</template>

<script>
import { cooperationProtocolAddOrUpdate, cooperationProtocolDetail } from '@/api/qualificationsBorrowManagement'
import PreviewStrategicCooperationAgreement from '@/views/sales-management/strategic-cooperation-agreement/module/View.vue'
import moment from 'moment'
//import StatusView from '@/components/CustomerList/StatusView'

export default {
  name: 'AddForm',
  components: {
    PreviewStrategicCooperationAgreement
  },
  inject: ['rootInstanceFrom'],
  data() {
    return {
      form: this.$form.createForm(this,{name:'qualifications-borrow-management-step1-2'}),
      visible: false,
      actionType: 'add',
      opinion: '', //审批意见
      spinning: false,
      contractId: undefined,
      detail: {},
      record: {},
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}战略合作协议`
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

    },
    async handleOk(saveType) {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      that.form.validateFields((err, values) => {
        if (!err) {
          values.saveType = saveType
          //提交
          that.$emit('click', { ...values })
        } else {
          that.$emit('click', null)
        }
      })
    },
    handleOkSubmit(values) {
      let that = this
      return cooperationProtocolAddOrUpdate(values)
        .then((res) => {
          that.spinning = false
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
      const that = this
      that.form.resetFields()
      that.$nextTick(() => {
        that.rootInstanceFrom.handleCancel()
      })
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
      if (that.isAdd) {
        if(record){
          that.detail = {...record}
        }
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
      //填充数据
      const _detail = await cooperationProtocolDetail(param).then((res) => res.data)
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
    statusFn() {
      let map = {
        1: '待提交',
        2: '待审批',
        3: '通过',
        4: '不通过',
        5: '已撤回',
      }
      let detail = this.detail
      if (!this.isView || !(detail && 'status' in detail)) {
        return null
      }
      let cur = +detail.status
      return {
        map,
        cur,
        pass: 3,
        nopass: 4,
      }
    },
    viewContract(){
      this.$refs.previewStrategicCooperationAgreement.query('view',{id:this.detail.id})
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
