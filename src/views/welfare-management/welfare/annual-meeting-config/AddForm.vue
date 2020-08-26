<template>
  <a-modal
    :title="modalTitle"
    :width="750"
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
            <td style="width:125px;">预算(元)</td>
            <td>
              <a-form-item>
                <a-input-number 
                  v-if="!isDisabled"
                  style="width:100%;"
                  :min="0"
                  :max="99999"
                  :step="1"
                  :precision="2"
                  v-decorator="['money', {initialValue:detail['money'], rules: [{ required: true, message: '请输入预算金额' }]}]"
                />
                <span v-else>{{detail['money'] | moneyFormatNumber}}</span>
              </a-form-item>
            </td>
          </tr>
        </table>

        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:50px;">序号</td>
            <td>名称</td>
            <td style="width:100px;">数量</td>
            <td>奖品</td>
            <td style="width:70px;" v-if="!isDisabled">操作</td>
          </tr>
          <tr v-for="(item,idx) in festivalDetails" :key="item.key">
            <td>{{idx + 1}}</td>
            <td>
              <a-form-item>
                <a-input 
                  v-if="!isDisabled"
                  placeholder="奖项名称"
                  :allowClear="true" 
                  v-decorator="[`festivalDetails.${idx}.awardName`,{initialValue:festivalDetails[idx]['awardName'],rules: [{required: true,message: '选择奖项名称'}]}]"
                  @change="inputChange($event,item.key,'awardName')"
                />
                <span v-else>{{festivalDetails[idx]['awardName']}}</span>
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-input-number 
                  v-if="!isDisabled"
                  style="width:100%;"
                  :min="0"
                  :max="99999"
                  :step="1" 
                  @change="inputChange($event,item.key,'amount')"
                  v-decorator="[`festivalDetails.${idx}.amount`, {initialValue:festivalDetails[idx]['amount'], rules: [{ required: true, message: '请输入数量' }]}]"
                />
                <span v-else>{{festivalDetails[idx]['amount']}}</span>
              </a-form-item>
            </td>
             <td>
              <a-form-item>
                <a-input 
                  v-if="!isDisabled"
                  placeholder="奖品名称"
                  :allowClear="true" 
                  v-decorator="[`festivalDetails.${idx}.prizeName`,{initialValue:festivalDetails[idx]['prizeName'],rules: [{required: true,message: '选择奖项名称'}]}]"
                  @change="inputChange($event,item.key,'prizeName')"
                />
                <span v-else>{{festivalDetails[idx]['prizeName']}}</span>
              </a-form-item>
            </td>
            <td style="width:70px;" v-if="!isDisabled">
              <a-form-item>
                <a href="javascript:void(0);" @click="itemAction('del',item.key)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button
          v-if="!isDisabled"
          style="width:100%;"
          type="dashed"
          icon="plus"
          @click="itemAction('add')"
        >添加</a-button>


      </a-form>
    </a-spin>

    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-modal>
</template>
<script>

import {
  annualMeetingSettingApprove,
  annualMeetingSettingDetail,
  annualMeetingSettingAddOrUpdate
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
      that.detail = {}
      that.festivalDetails = []
      await that.init()
      that.visible = true
      if (that.isAdd) {
        that.detail = {}
        return
      }
      await annualMeetingSettingDetail({ id: record.id }).then((res) => {
        //debugger
        let data = res.data
        that.detail = { ...data }
        
        that.festivalDetails = res.data.prizes.map(item =>{
          item.key = uuid()
          return item
        })
      })
    },
    inputChange(event,key,field){
      let festivalDetails = [...this.festivalDetails]
      let target = festivalDetails.find(item => item.key === key)
      if(target){
        target[field] = event instanceof Event ? event.target.value : event
        this.festivalDetails = festivalDetails
      }
      console.log(arguments)
    },
    itemAction(type,key){
      let festivalDetails = [...this.festivalDetails]
      if(type === 'add'){
        festivalDetails.push({
          key:uuid(),
          awardName:undefined,
          amount:undefined,
          prizeName:undefined
        })
        this.festivalDetails = festivalDetails
      }
      if(type === 'del'){
        this.festivalDetails = festivalDetails.filter(item => item.key !== key)
      }
    },

    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (that.isEdit) {
            values.id = that.record.id
          }
          values.prizes = values.festivalDetails
          that.spinning = true
          annualMeetingSettingAddOrUpdate(values)
            .then(res => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      annualMeetingSettingApprove(values)
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
  },
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
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  margin-bottom: 0;
  margin: -1px;
}
</style>