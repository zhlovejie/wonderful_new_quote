<template>
  <a-modal
    :title="modalTitle"
    :width="750"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">假期名称</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="请输入假期名称"
                  v-decorator="['holidayName',{initialValue:detail.holidayName,rules: [{required: true,message: '输入假期名称'}]}]"
                  :allowClear="true"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">最小请假单位</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择请假单位"
                  v-decorator="['holidayUnitType',{initialValue:detail.holidayUnitType,rules: [{required: true,message: '请选择请假单位'}]}]"
                  :allowClear="true"
                  style="width:100%;"
                >
                  <a-select-option :value="1">按天请假</a-select-option>
                  <a-select-option :value="3">按小时请假</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">计算请假时长方式</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择假时长方式"
                  v-decorator="['holidayCaculatorType',{initialValue:detail.holidayCaculatorType,rules: [{required: true,message: '请选择假时长方式'}]}]"
                  :allowClear="true"
                  style="width:100%;" 
                  @change="holidayCaculatorTypeChange"
                >
                  <a-select-option :value="1">按工作日计算时长</a-select-option>
                  <a-select-option :value="2">按自然日计算时长</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr v-if="+holidayCaculatorType === 2">
            <td style="width:150px;">法定时长(天)</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  v-decorator="['legalDuration', {initialValue:detail.legalDuration,rules: [{ required: true, message: '请输入法定时长' }]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">启用假期余额</td>
            <td>
              <a-form-item>
                <a-switch
                  checked-children="启用"
                  un-checked-children="不启用"
                  :checked="+userRemain === 1"
                  @change="userRemainChange"
                />
              </a-form-item>
            </td>
          </tr>
          <tr v-if="userRemain">
            <td style="width:150px;">余额发放方式</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择假时长方式"
                  v-decorator="['balanceIssuingMethod',{initialValue:detail.balanceIssuingMethod,rules: [{required: true,message: '请选择假时长方式'}]}]"
                  :allowClear="true"
                  style="width:100%;"
                  @change="balanceIssuingMethodChange"
                >
                  <a-select-option :value="1">按入职时间自动发放</a-select-option>
                  <a-select-option :value="2">加班时长自动计算余额</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>

          <tr v-if="userRemain && +balanceIssuingMethod === 1">
            <td style="width:150px;">发放规则</td>
            <td>
              <a-row>
                <a-col :span="24" style="display:flex;">
                  <a-form-item>
                    <span>入职年限：大于等于</span>
                    <a-input-number
                      style="width:80px;margin:0 10px;"
                      :min="0"
                      :max="100"
                      :step="1"
                      v-decorator="['holidayProvideRuleList.0.workYearsBegin', {rules: [{ required: true, message: '请输入入职年限' }]}]"
                      @keyup="checkWorkYears"
                    />
                  </a-form-item>
                  <a-form-item>
                    <span>小于</span>
                    <a-input-number
                      style="width:80px;margin:0 10px;"
                      :min="0"
                      :max="100"
                      :step="1"
                      v-decorator="['holidayProvideRuleList.0.workYearsEnd', {rules: [{ required: true, message: '请输入入职年限' }]}]"
                      @keyup="checkWorkYears"
                    />
                  </a-form-item>
                  <a-form-item>
                    <span>年假(天)：</span>
                    <a-input-number
                      style="width:80px;margin:0 10px;"
                      :min="0"
                      :max="100"
                      :step="1"
                      v-decorator="['holidayProvideRuleList.0.holidayDays', {rules: [{ required: true, message: '请输入年假天数' }]}]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24" style="display:flex;">
                  <a-form-item>
                    <span>入职年限：大于等于</span>
                    <a-input-number
                      style="width:80px;margin:0 10px;"
                      :min="0"
                      :max="100"
                      :step="1"
                      v-decorator="['holidayProvideRuleList.1.workYearsBegin', {rules: [{ required: true, message: '请输入入职年限' }]}]"
                      @keyup="checkWorkYears"
                    />
                  </a-form-item>
                  <a-form-item>
                    <span>小于</span>
                    <a-input-number
                      style="width:80px;margin:0 10px;"
                      :min="0"
                      :max="100"
                      :step="1"
                      v-decorator="['holidayProvideRuleList.1.workYearsEnd', {rules: [{ required: true, message: '请输入入职年限' }]}]"
                      @keyup="checkWorkYears"
                    />
                  </a-form-item>
                  <a-form-item>
                    <span>年假(天)：</span>
                    <a-input-number
                      style="width:80px;margin:0 10px;"
                      :min="0"
                      :max="100"
                      :step="1"
                      v-decorator="['holidayProvideRuleList.1.holidayDays', {rules: [{ required: true, message: '请输入年假天数' }]}]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24" style="display:flex;">
                  <a-form-item>
                    <span>入职年限：大于等于</span>
                    <a-input-number
                      style="width:80px;margin:0 10px;"
                      :min="0"
                      :max="100"
                      :step="1"
                      v-decorator="['holidayProvideRuleList.2.workYearsBegin', {rules: [{ required: true, message: '请输入入职年限' }]}]"
                      @keyup="checkWorkYears"
                    />
                  </a-form-item>
                  <a-form-item>
                    <span>小于</span>
                    <a-input-number
                      style="width:80px;margin:0 10px;"
                      :min="0"
                      :max="100"
                      :step="1"
                      v-decorator="['holidayProvideRuleList.2.workYearsEnd', {rules: [{ required: true, message: '请输入入职年限' }]}]"
                      @keyup="checkWorkYears"
                    />
                  </a-form-item>
                  <a-form-item>
                    <span>年假(天)：</span>
                    <a-input-number
                      style="width:80px;margin:0 10px;"
                      :min="0"
                      :max="100"
                      :step="1"
                      v-decorator="['holidayProvideRuleList.2.holidayDays', {rules: [{ required: true, message: '请输入年假天数' }]}]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </td>
          </tr>

          <tr v-if="userRemain">
            <td style="width:150px;">有效期规则</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择有效期规则"
                  v-decorator="['effectRuleType',{initialValue:detail.effectRuleType,rules: [{required: true,message: '请选择有效期规则'}]}]"
                  :allowClear="true"
                  style="width:100%;"
                >
                  <a-select-option :value="1">按自然年(1月1日 ~ 12月31日)</a-select-option>
                  <a-select-option :value="2">累加</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { holidayRuleDetail, holidayRuleAddAndUpdate } from '@/api/attendanceManagement'
import moment from 'moment'
export default {
  name: 'over-time-rule-add',
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      actionType: 'view',
      detail: {},
      spinning: false,
      holidayCaculatorType:undefined,
      balanceIssuingMethod: undefined,
      userRemain: false
    }
  },
  computed: {
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '修改'}假期规则`
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
    moment,
    query(type, record) {
      let that = this
      ;(this.actionType = type), (this.detail = {})
      this.balanceIssuingMethod = undefined
      this.userRemain = false
      this.form.resetFields()
      this.$nextTick(() => (this.visible = true))
      if (this.isAdd) {
        return
      }
      if (record) {
        holidayRuleDetail({ id: record.id }).then(res => {
          //debugger
          that.detail = { ...res.data }
          that.userRemain = +res.data.userRemain === 1
          that.balanceIssuingMethod = res.data.balanceIssuingMethod
          that.holidayCaculatorType = res.data.holidayCaculatorType
          if (res.data.holidayProvideRuleList) {
            let obj = {}
            res.data.holidayProvideRuleList.map((item, idx) => {
              obj[`holidayProvideRuleList.${idx}.workYearsBegin`] = item.workYearsBegin
              obj[`holidayProvideRuleList.${idx}.workYearsEnd`] = item.workYearsEnd
              obj[`holidayProvideRuleList.${idx}.holidayDays`] = item.holidayDays
            })
            that.$nextTick(() => that.form.setFieldsValue(obj))
          }

          console.log(res)
        })
      }
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          

          values.userRemain = that.userRemain ? 1 : 0

          that.checkWorkYears().then(res =>{
            if(res){
              that.spinning = true
              holidayRuleAddAndUpdate(values)
              .then(res => {
                that.$message.info(res.msg)
                that.spinning = false
                that.handleCancel()
                that.$emit('finish')
              })
              .catch(err => {
                that.spinning = false
              })
            }
          })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    balanceIssuingMethodChange(val) {
      console.log(arguments)
      this.balanceIssuingMethod = +val
    },
    userRemainChange(isUserRemain) {
      console.log(arguments)
      this.userRemain = isUserRemain
      //this.holidayCaculatorType = undefined
    },
    holidayCaculatorTypeChange(val){
      this.holidayCaculatorType = val
    },
    checkWorkYears(){
      //检测输入年假入职年限
      //规则如下：右侧的必须大于左侧值，下面值必须大于上面的值
      let that = this
      return new Promise((resovle,reject) =>{
        that.$nextTick(() =>{
          let status = true
          let res = that.form.getFieldsValue(['holidayProvideRuleList'])
          if(res && res.holidayProvideRuleList){
            res.holidayProvideRuleList.length = Object.keys(res.holidayProvideRuleList).length
            let list = Array.from(res.holidayProvideRuleList)
            for(let i=0,len = list.length;i<len;i++){
              let current = list[i]
              if(
                current.workYearsBegin !== undefined && 
                current.workYearsEnd !== undefined &&  
                +current.workYearsBegin >= +current.workYearsEnd
              ){
                status = false
                break
              }
              if(i > 0){
                let prev = list[i - 1]
                if(
                    current.workYearsBegin !== undefined && 
                    prev.workYearsEnd !== undefined &&
                    current.workYearsBegin < prev.workYearsEnd
                ){
                  status = false
                  break
                }
              }
            }
          }
          if(!status){
            that.$message.info('入职年限不符合规则')
          }
          resovle(status)
        })
      })
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
  padding: 5px 10px;
  text-align: left;
}
</style>