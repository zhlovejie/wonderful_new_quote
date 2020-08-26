<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :class="{'ant-modal_no_footer':isView}"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button
          key="submit"
          type="primary"
          icon="check"
          :loading="spinning"
          @click="passAction"
        >通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">员工级别</td>
            <td>{{detail.userLevel}}</td>
          </tr>

          <tr>
            <td style="width:120px;">原内容</td>
            <td style="padding:0;">
              <table class="custom-table custom-table-border">
                <tr>
                  <td style="width:50%;">节假日名称</td>
                  <td style="width:50%;">过节费(元)</td>
                </tr>
                <tr v-for="(item,idx) in detail.oldDetails" :key="idx">
                  <td>{{item.festivalName}}</td>
                  <td>{{item.money | moneyFormatNumber}}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">修改后内容</td>
            <td style="padding:0;">
              <table class="custom-table custom-table-border">
                <tr>
                  <td style="width:50%;">节假日名称</td>
                  <td style="width:50%;">过节费(元)</td>
                </tr>
                <tr v-for="(item,idx) in detail.newDetails" :key="idx">
                  <td>{{item.festivalName}}</td>
                  <td>{{item.money | moneyFormatNumber}}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr v-if="isApproval">
            <td style="width:120px;">备注信息</td>
            <td style="padding:0;">
              <div v-html="formatHTML(detail.remark)" />
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
  fbsRecordApprove,
  fbsRecordDetail
} from '@/api/welfareManagement'

import Approval from './Approval'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'welfare-management-holiday-gifts-money-config-record-addForm',
  components: { Approval },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      actionType: 'view',
      detail: {},
      record: {},
      spinning: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      festivalDetails:[]
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
      return Promise.all(queue)
    },
    async query(type, record) {
      //debugger
      let that = this
      await that.form.resetFields()
      that.actionType = type
      that.record = Object.assign({}, record)
      await that.init()
      that.visible = true
      if (that.isAdd) {
        that.detail = {}
        return
      }
      await fbsRecordDetail({ id: record.id }).then((res) => {
        //debugger
        let data = res.data
        that.detail = { ...data }
      })
    },
    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      fbsRecordApprove(values)
        .then((res) => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
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
    formatHTML(htmlStr){
      if(typeof htmlStr !== 'string') {
        return ''
      }
      htmlStr = htmlStr.replace(/[\n\r]/g,'<br/>')
      htmlStr = htmlStr.replace(/\s+/g,'&nbsp;')
      return htmlStr
    }
  }
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}

.custom-table >>> .custom-table {
  margin-bottom: 0;
  
  width: calc(100% + 2px);
  margin: -1px;
}
</style>