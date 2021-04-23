<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction(recordDetails)">不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction()">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>编号</td>
            <td colspan="4">{{ logisCode }}</td>
          </tr>
          <tr>
            <td>部门</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  :disabled="isDisabled"
                  @change="depChangeHandler"
                  placeholder="请选择部门"
                  v-decorator="['departmentId', { rules: [{ required: true, message: '请选择部门!' }] }]"
                >
                  <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
                    item.departmentName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>罚款人</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  :disabled="isDisabled"
                  placeholder="请选择人员"
                  v-decorator="['userId', { rules: [{ required: true, message: '请选择人员!' }] }]"
                >
                  <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.id">{{
                    item.trueName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>罚款(元)</td>
            <td colspan="4">
              <a-form-item>
                <a-input-number
                  :precision="2"
                  style="width: 426px"
                  :disabled="isDisabled"
                  placeholder="输入罚款"
                  v-decorator="['amount', { rules: [{ required: true, message: '请输入罚款!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>交款截止日期</td>
            <td colspan="4">
              <a-form-item>
                <a-date-picker
                  style="width: 426px"
                  :disabled="isDisabled"
                  v-decorator="['cutDate', { rules: [{ required: true, message: '请选择日期!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>罚款事由</td>
            <td colspan="4">
              <a-form-item>
                <a-textarea
                  placeholder="罚款事由"
                  :disabled="isDisabled"
                  :rows="2"
                  v-decorator="['reason', { rules: [{ required: true, message: '请输入罚款事由' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="4">
              <a-form-item>
                <a-textarea
                  placeholder="备注"
                  :disabled="isDisabled"
                  :rows="2"
                  v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
        <div>注：超过交款时间加一倍罚款，当天缴纳现金八折</div>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getUserByDep,
  // getStationList, //获取部门下面的岗位
  // getUserByStation, //获取人员
} from '@/api/systemSetting'
import {
  capital_bill_logisticsNum,
  capital_bill_addAndUpdate,
  capital_bill_approval,
  capital_bill_detail,
} from '@/api/bonus_management'
import Approval from './Approval'
import moment from 'moment'

// let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      remark: '',
      visible: false,
      logisCode: undefined,
      personSelectDataSource: [], //人员
      departmentList: [], //部门
      postSelectDataSource: [], //职位
      spinning: false,
      form: this.$form.createForm(this, { name: 'BecomingForm' }),
      type: 'view',
      record: {},
    }
  },

  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改罚款单'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}罚款单`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isView5() {
      //查看
      return this.type === 'view5'
    },
    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isApproval() {
      //通过不通过
      return this.type === 'edit'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView || this.isEdit || this.isView5
    },
  },
  created() {
    departmentList().then((res) => {
      this.departmentList = res.data
    })
  },
  methods: {
    moment,
    //选择人员
    depChangeHandler(dep_id) {
      let that = this
      that.depart = dep_id
      that.postSelectDataSource = []
      return getUserByDep({ departmentId: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },

    //接受数据
    async query(type, record) {
      const that = this
      await that.form.resetFields() // 清空表
      that.visible = true
      that.type = type
      that.record = record
      if (type === 'add') {
        await capital_bill_logisticsNum().then((res) => {
          that.logisCode = res.data
        })
      } else {
        const detail = await capital_bill_detail({ id: record.id }).then((res) => res.data)
        getUserByDep({ departmentId: detail.departmentId }).then((res) => {
          that.postSelectDataSource = res.data
        })
        that.fillData(detail)
      }
    },
    // 详情
    fillData(detail) {
      const that = this

      that.$nextTick(() => {
        that.logisCode = detail.fkNum
        that.form.setFieldsValue({
          amount: detail.amount,
          departmentId: detail.departmentId,
          cutDate: moment(detail.cutDate),
          reason: detail.reason,
          userId: detail.userId,
          remark: detail.remark,
        })
      })
    },
    //提交
    handleOk() {
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.form.validateFields((err, values) => {
          if (!err) {
            that.spinning = true
            if (that.type === 'edit-salary') {
              values.id = that.record.id
            }
            if (that.type === 'add' || that.type === 'edit-salary') {
              values.fkNum = that.logisCode
              values.cutDate = moment(values.cutDate).format('YYYY-MM-DD')
              capital_bill_addAndUpdate(values)
                .then((res) => {
                  this.programme = []
                  this.visible = false
                  that.spinning = false
                  that.form.resetFields() // 清空表
                  that.$message.info(res.msg)
                  that.$emit('finish')
                })
                .catch((err) => (that.spinning = false))
            }
          }
        })
      }
    },
    handleCancel() {
      this.programme = []
      this.remark = '' // 清空表
      this.visible = false
    },
    // 审批
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      capital_bill_approval(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        // opinion: '通过',
      })
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
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
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
