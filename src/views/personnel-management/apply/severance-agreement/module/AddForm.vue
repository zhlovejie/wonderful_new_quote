<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    @ok="handleOk"
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
      <!-- <a-row :gutter="16" v-if="isApproval">
        <a-col :span="24" style="text-align: right;">
          <a-button
            class="a-button"
            style="margin-right: 8px;"
            type="primary"
            icon="check"
            @click="passAction"
          >通过</a-button>
          <a-button class="a-button" type="primary" icon="close" @click="noPassAction">不通过</a-button>
        </a-col>
      </a-row> -->
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>编号</td>
            <td>
              <a-form-item>
                <a-input disabled v-decorator="['leaveOfficeCode']" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>人员</td>
            <td>
              <a-row>
                <a-col :span="24" style="display:flex;">
                  <a-form-item>
                    <a-select
                      :disabled="isDisabled"
                      style="width:150px;margin-right:10px;"
                      placeholder="选择部门"
                      @change="depChangeHandler"
                      v-decorator="['depId', { rules: [{ required: true, message: '选择部门' }] }]"
                    >
                      <a-select-option
                        v-for="item in depSelectDataSource"
                        :key="item.id"
                        :value="item.id"
                      >{{item.departmentName}}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <a-select
                      :disabled="isDisabled"
                      style="width:150px;"
                      placeholder="选择人员" 
                      @change="userChangeHandler" 
                      v-decorator="['userId', { rules: [{ required: true, message: '选择人员' }] }]"
                    >
                      <a-select-option
                        v-for="item in personSelectDataSource"
                        :key="item.id"
                        :value="item.id"
                      >{{item.trueName}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </td>
          </tr>
          <tr>
            <td>身份证号</td>
            <td colspan="3">
              <a-form-item>{{identityCard}}</a-form-item>
            </td>
          </tr>
          <tr>
            <td>补偿金(元)</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder="补偿金"
                  v-decorator="['compensation', { rules: [{ required: true, message: '补偿金' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">此补偿金分三次支付</td>
          </tr>
          <tr>
            <td colspan="2">
              <a-row>
                <a-col :span="24" class="pay-item-wrapper">
                  <span>在</span>
                  <a-form-item>
                    <a-date-picker
                      :disabled="isDisabled"
                      style="width:150px;" 
                      v-decorator="['firstDate',{initialValue:moment(),rules: [{required: true,message: '输入日期'}]}]"
                      format="YYYY-MM-DD"
                    />
                  </a-form-item>
                  <span>日前支付</span>
                  <a-form-item>
                    <a-input
                      :disabled="isDisabled" 
                      style="width:150px;" 
                      placeholder="支付金额"
                      v-decorator="['firstAmount', { rules: [{ required: true, message: '支付金额' }] }]"
                    />
                  </a-form-item>
                  <span>元</span>
                </a-col>
              </a-row>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <a-row>
                <a-col :span="24" class="pay-item-wrapper">
                  <span>在</span>
                  <a-form-item>
                    <a-date-picker
                      :disabled="isDisabled"
                      style="width:150px;" 
                      v-decorator="['secondDate',{initialValue:moment(),rules: [{required: true,message: '输入日期'}]}]"
                      format="YYYY-MM-DD"
                    />
                  </a-form-item>
                  <span>日前支付</span>
                  <a-form-item>
                    <a-input
                      :disabled="isDisabled" 
                      style="width:150px;" 
                      placeholder="支付金额"
                      v-decorator="['secondAmount', { rules: [{ required: true, message: '支付金额' }] }]"
                    />
                  </a-form-item>
                  <span>元</span>
                </a-col>
              </a-row>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <a-row>
                <a-col :span="24" class="pay-item-wrapper">
                  <span>在</span>
                  <a-form-item>
                    <a-date-picker
                      :disabled="isDisabled"
                      style="width:150px;" 
                      v-decorator="['thirdDate',{initialValue:moment(),rules: [{required: true,message: '输入日期'}]}]"
                      format="YYYY-MM-DD"
                    />
                  </a-form-item>
                  <span>日前支付</span>
                  <a-form-item>
                    <a-input
                      :disabled="isDisabled" 
                      style="width:150px;" 
                      placeholder="支付金额"
                      v-decorator="['thirdAmount', { rules: [{ required: true, message: '支付金额' }] }]"
                    />
                  </a-form-item>
                  <span>元</span>
                </a-col>
              </a-row>
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
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import {
  getLeaveOfficeAgreement,
  addLeaveOfficeAgreementAndUpdate,
  approveLeaveOfficeAgreement
} from '@/api/personnelManagement'
import moment from 'moment'
import Approval from './Approval'
export default {
  name: 'AddForm',
  components: {
    Approval: Approval
  },
  data() {
    return {
      depSelectDataSource: [],
      personSelectDataSource: [],
      form: this.$form.createForm(this),
      visible: false,
      actionType: 'add',
      opinion: '', //审批意见
      spinning: false,
      identityCard:''
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}离职协议`
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
    init() {
      let that = this
      return Promise.all([
        departmentList().then(res => {that.depSelectDataSource = res.data}), //部门
      ])
    },
    depChangeHandler(depId) {
      getUserByDep({ departmentId: depId }).then(res => (this.personSelectDataSource = res.data))
    },
    userChangeHandler(userId){
      //identityCard
      let target = this.personSelectDataSource.find(item =>item.id === userId)
      if(target){
        this.identityCard = target.identityCard
      }
    },
    async handleOk() {
      //debugger
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          //提交
          values.firstDate = values.firstDate.format('YYYY-MM-DD HH:mm:ss')
          values.secondDate = values.secondDate.format('YYYY-MM-DD HH:mm:ss')
          values.thirdDate = values.thirdDate.format('YYYY-MM-DD HH:mm:ss')
          that.spinning = true
          addLeaveOfficeAgreementAndUpdate(values)
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
      //debugger
      console.log(arguments)
      let that = this
      that.actionType = type
      that.record = record || {}

      that.form.resetFields()
      that.identityCard = ''
      await that.init()
      that.visible = true

      if (that.isAdd) return

      //填充数据
      getLeaveOfficeAgreement({ id: that.record.id }).then(res => {
        console.log(res)
        let data = res.data
        data.firstDate = that.moment(data.firstDate)
        data.secondDate = that.moment(data.secondDate)
        data.thirdDate = that.moment(data.thirdDate)

        getUserByDep({ departmentId: data.depId }).then(res => {
          that.personSelectDataSource = res.data
          that.$nextTick(() => that.form.setFieldsValue(data))
        })

        //填充调岗
        // if(that.isPost || that.isPostAndSalary){
        //   that.oldDepartmentName = data.oldDepartmentName
        //   that.oldStationName = data.oldStationName
        //   that.oldStationId = data.oldStationId
        //   that.newDepartmentManagerName = data.newDepartmentManagerName
        //   data.enterDate = that.moment(data.enterDate)
        //   that.depChangeHandler(data.newDepartmentId).then(() =>{
        //     that.form.setFieldsValue(data)
        //   })
        // }

        // if(that.isSalary || that.isPostAndSalary){
        //   that.oldDepartmentName = data.oldDepartmentName || data.departmentName
        //   that.oldStationName = data.oldStationName || data.stationName
        //   data.expectDate = that.moment(data.expectDate)
        //   if(data.expectSalary === -1 && data.oldSalary === -1){
        //     that.isSelfApproval = true
        //   }
        //   data.attachInfo = data.jobResult
        //   that.form.setFieldsValue(data)
        // }
      })
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      approveLeaveOfficeAgreement(values)
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
      //that.opinion = ''
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    }
  }
}
</script>

<style scoped>
.adjust-apply-list-wrapper .search-wrapper * {
  margin: 0;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
}

.pay-item-wrapper{
  display: flex;
  line-height: 39px;
}
.pay-item-wrapper span{
  margin:0 5px;
}
</style>