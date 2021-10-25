<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
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
        <h3>基本信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="requiredMark">部门</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择部门"
                  :disabled="isDisabled"
                  v-decorator="['departmentId', { rules: [{ required: true, message: '请选择部门' }] }]"
                  @change="depChangeHandler"
                  style="width: 200px"
                >
                  <a-select-option v-for="item in depSelectDataSource" :key="item.id" :value="item.id">
                    {{ item.departmentName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td class="requiredMark">岗位</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择岗位"
                  :disabled="isDisabled"
                  @change="handleProvinceChange"
                  v-decorator="['stationId', { rules: [{ required: true, message: '请选择岗位' }] }]"
                  style="width: 200px"
                >
                  <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.id">
                    {{ item.stationName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">名字</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择名字"
                  :disabled="isDisabled"
                  v-decorator="['userId', { rules: [{ required: true, message: '请选择名字' }] }]"
                  style="width: 200px"
                >
                  <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">
                    {{ item.trueName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td class="requiredMark">年薪类型</td>
            <td>
              <a-form-item>
                <a-select
                  :disabled="isDisabled"
                  @change="yearSalaryIdChangeAnnual"
                  style="width: 200px"
                  v-decorator="['yearSalaryId', { rules: [{ required: true, message: '选择年薪类型' }] }]"
                  placeholder="选择年薪类型"
                >
                  <a-select-option v-for="(item, index) in annual" :key="index" :value="item.id">{{
                    item.ruleName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <!-- <a-form-item> -->
              <!-- <a-select
                  placeholder="选择年薪类型"
                  v-decorator="['salaryType', { rules: [{ required: true, message: '请选择年薪类型' }] }]"
                  style="width: 200px"
                >
                  <a-select-option :value="0"> 周薪制 </a-select-option>
                  <a-select-option :value="1"> 年薪制 </a-select-option>
                </a-select>
              </a-form-item> -->
            </td>
          </tr>
          <tr>
            <td class="requiredMark" style="width: 150px">周期（月）</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="选择周期"
                  :disabled="isDisabled"
                  v-decorator="['cycle', { rules: [{ required: true, message: '请选择周期' }] }]"
                  style="width: 200px"
                >
                  <a-select-option v-for="item in cycle" :key="item" :value="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td class="requiredMark">核算开始日期</td>
            <td>
              <a-form-item>
                <a-date-picker
                  :disabled="isDisabled"
                  style="width: 200px"
                  v-decorator="['cycleTime', { rules: [{ required: true, message: '请选择核算开始日期' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
        <h3>薪资条件</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="requiredMark">条件</td>
            <td colspan="4">
              <a-form-item>
                <a-select
                  placeholder="选择条件"
                  @change="yearSalaryIdChange"
                  :disabled="isDisabled"
                  v-decorator="['type', { rules: [{ required: true, message: '请选择条件' }] }]"
                  style="width: 200px"
                >
                  <a-select-option :value="0"> 无 </a-select-option>
                  <a-select-option :value="1"> 有 </a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr v-for="(item, index) in salaryMinApplyMonies" :key="item.index">
            <td class="requiredMark" v-if="SalaryChang === 1" style="width: 150px">销售额（万元）</td>
            <td v-if="SalaryChang === 1" style="width: 35%">
              <a-form-item>
                <a-input-Number
                  :disabled="isDisabled"
                  placeholder
                  :precision="2"
                  style="width: 200px"
                  @change="inputChanges($event, item._key, 'saleQuota')"
                  v-decorator="[
                    `salaryMinApplyMonies[${index}].saleQuota`,
                    { initialValue: item.saleQuota, rules: [{ required: true, message: '请输入比例' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td class="requiredMark" style="width: 150px">保底薪资万元</td>
            <td>
              <a-form-item>
                <a-input-Number
                  :disabled="isDisabled"
                  placeholder
                  :precision="2"
                  style="width: 200px"
                  @change="inputChanges($event, item._key, 'cycleSalary')"
                  v-decorator="[
                    `salaryMinApplyMonies[${index}].cycleSalary`,
                    { initialValue: item.cycleSalary, rules: [{ required: true, message: '请输入比例' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td v-if="!isDisabled">
              <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="del(item._key)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </td>
          </tr>
        </table>
        <a-button v-if="!isDisabled" style="width: 100%" type="dashed" icon="plus" @click="addItem()"></a-button>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByStation, //获取人员
} from '@/api/systemSetting'
import { saveAndUpdate, year_getDetail, year_salary_approval } from '@/api/bonus_management'
import { annual_ruleList, annual_rulegetId } from '@/api/humanResources'
import Approval from './Approval'
import moment from 'moment'
let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      // 部门列表
      depSelectDataSource: [],
      cycle: [], //年薪周期
      annual: [], //年薪制规则
      // 岗位列表
      postSelectDataSource: [],
      roleList: [],
      salaryMinApplyMonies: [],
      SalaryChang: 1,
      loading: false,
      visible: false,
      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改年薪制'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}年薪制`
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

  methods: {
    moment,
    yearSalaryIdChange(e) {
      this.SalaryChang = e
    },
    del(key) {
      let that = this
      that.salaryMinApplyMonies = that.salaryMinApplyMonies.filter((i) => i._key !== key)
    },
    inputChanges(event, keys, field) {
      let salaryMinApplyMonies = [...this.salaryMinApplyMonies]
      let target = salaryMinApplyMonies.find((item, index) => item._key === keys)
      if (target) {
        target[field] = event instanceof Event ? event.target.value : event
        this.salaryMinApplyMonies = salaryMinApplyMonies
      }
    },
    addItem() {
      this.salaryMinApplyMonies.push({
        _key: uuid(),
        cycleSalary: undefined,
        saleQuota: undefined,
      })
    },
    yearSalaryIdChangeAnnual(e) {
      let react = this.annual.find((item) => item.id === e)
      this.cycle = react.accountCycle.split(',')
    },
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      this.salaryMinApplyMonies = []
      annual_ruleList().then((res) => (this.annual = res.data))
      departmentList().then((res) => (this.depSelectDataSource = res.data))
      this.roleArr = []
      if (type === 'add') {
        console.log(record)
        this.visiblel = true
        this.addItem()
      } else {
        this.fillData()
      }
    },
    depChangeHandler(depId) {
      getStationList({ id: depId }).then((res) => (this.postSelectDataSource = res.data))
    },
    // 获取岗位名字联动
    handleProvinceChange(value) {
      getUserByStation({ stationId: value })
        .then((rs) => {
          this.roleList = rs.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // 详情
    fillData() {
      let that = this
      that.$nextTick(() => {
        year_getDetail({ id: that.record.id }).then((res) => {
          console.log(res.data)
          let react = res.data
          that.salaryMinApplyMonies = react.salaryMinApplyMonies
          that.SalaryChang = react.type
          that.form.setFieldsValue({
            cycle: react.cycle,
            cycleTime: moment(react.cycleTime),
            departmentId: react.departmentId,
            salaryMinApplyMonies: react.salaryMinApplyMonies,
            stationId: react.stationId,
            type: react.type,
            userId: react.userId,
            yearSalaryId: react.yearSalaryId,
          })
          annual_rulegetId({ id: react.yearSalaryId }).then((res) => (that.cycle = res.data.accountCycle.split(',')))
          that.depChangeHandler(react.departmentId)
          that.handleProvinceChange(react.stationId)
        })
      })
    },

    handleOk() {
      // console.log('你是要提交')
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.form.validateFields((err, values) => {
          if (!err) {
            if (that.type === 'edit-salary') {
              values.id = that.record.id
              values.instanceId = that.record.instanceId
            }
            values.salaryType = 1
            values.cycleTime = values.cycleTime.format('YYYY-MM-DD')
            console.log(values)
            if (that.type === 'add' || that.type === 'edit-salary') {
              that.spinning = true
              saveAndUpdate(values)
                .then((res) => {
                  if (res.code === 200) {
                    this.visible = false
                    that.spinning = false
                    this.form.resetFields()
                    that.$message.info(res.msg)
                    that.$emit('finish')
                  }
                })
                .catch((err) => (that.spinning = false))
            }
          }
        })
      }
    },
    handleCancel() {
      this.remark = '' // 清空表
      this.visible = false
    },
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      year_salary_approval(values)
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
.requiredMark::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
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