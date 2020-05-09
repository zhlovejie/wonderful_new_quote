<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false" 
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction" >不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr v-if="!isAdd">
            <td style="width:150px;">申诉人</td>
            <td>
              <a-form-item>
                {{detail.createName}}
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['id']" />
                <a-input v-decorator="['instanceId']" />
              </a-form-item>
            </td>
          </tr>
          <tr v-if="!isAdd">
            <td>申诉部门</td>
            <td>
              <a-form-item>
                {{detail.departmentName}}
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>客户名称</td>
            <td>
              <a-form-item>
                {{detail.customerName}}
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>原因</td>
            <td >
              <a-form-item>
                <a-textarea 
                  v-if="isAdd"
                  :disabled="isView"
                  placeholder=""
                  :rows="2"
                  v-decorator="['reason', {rules: [{ required: true, message: '请输入原因' }] }]"
                />
                <span v-else>{{detail.reason}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>附件</td>
            <td >
              <a-form-item>
                <UploadFile ref="f1" v-if="isAdd" />
                <div v-else v-html="formatFiles()" />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import {
  customerAppealDetail,
  customerAppealApproval,
  customerAppealAdd
} from '@/api/customerReleaseRule'
import UploadFile from './UploadFile'
import Approval from './Approval'
import moment from 'moment'
export default {
  name: 'AddForm',
  components: {
    UploadFile,
    Approval
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      actionType: 'add',
      record:{},
      spinning: false,
      detail:{}
    }
  },
  computed: {
    modalTitle() {
      let tit = this.isAdd ? '新增' : this.isView ? '查看' : '审批'
      return `${tit}申诉单`
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
    }
  },
  methods: {
    moment: moment,
    disabledDate(current) {
      return current && current < this.moment().endOf('day')
    },
    init() {
      let that = this
      return Promise.all([])
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      let files = that.$refs.f1.getFiles()
      if(files.length <= 0){
        that.$message.info('您还没有上传附件')
        return
      }

      that.form.validateFields((err, values) => {
        if (!err) {

          let _values = {
            ...values,
            ...that.detail,
            fileUrl:files.map(f =>f.url).join(',')
          }
          console.log(_values)
          //提交
          that.spinning = true
          customerAppealAdd(_values)
            .then(res => {
              that.spinning = false
              console.log(res)
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch(err => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.form.resetFields()
      await that.init()
      that.visible = true
      if (that.isAdd) {
        let _detail = {...that.detail}
        _detail.customerId = that.record.id
        _detail.customerName = that.record.name
        that.detail = _detail
      }else{
        customerAppealDetail({id:that.record.id}).then(res =>{
          that.detail = {...res.data}
        })
      }
    },
    formatFiles(){
      if(this.detail.fileUrl){
        return this.detail.fileUrl.split(',').map(url =>{
          return `<div><a href="${url}" target="_blank">${url}</a></div>`
        }).join('')
      }else{
        return ''
      }
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      customerAppealApproval(values)
        .then(res => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch(err => (that.spinning = false))
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
        opinion: opinion
      })
    },
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
.add-form-wrapper >>> .ant-form-item{
  margin-bottom: 0;
}
</style>