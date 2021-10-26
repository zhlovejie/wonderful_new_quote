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
        <h1 style="text-align: center">{{ year }}年终奖金规则</h1>

        <h3>发放规则</h3>
        <table class="custom-table custom-table-border">
          <tr v-for="(item, index) in planList" :key="item.index">
            <td style="width: 150px">{{ getStateText(index + 1) }}期比例（%）</td>
            <td style="width: 35%">
              <a-form-item>
                <a-input-Number
                  :disabled="isDisabled"
                  placeholder
                  :precision="2"
                  style="width: 200px"
                  @change="inputChanges($event, item._key, 'percentage')"
                  v-decorator="[
                    `planList${index}.percentage`,
                    { initialValue: item.percentage, rules: [{ required: true, message: '请输入比例' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td>发放时间</td>
            <td>
              <a-form-item>
                <a-date-picker
                  :disabled="isDisabled"
                  :disabled-date="(currentDate) => disabledDate(currentDate, index)"
                  @change="inputChanges($event, item._key, 'grantDate')"
                  v-decorator="[
                    `planList${index}.grantDate`,
                    { initialValue: item.grantDate, rules: [{ required: true, message: '请输入发放时间' }] },
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
        <a-button v-if="!isDisabled" style="width: 100%" type="dashed" icon="plus" @click="addItem()"
          >新增规则</a-button
        >
        <!-- <h3>奖金明细 <a style="margin-left：15px" @click="detailedAdd()">新增</a></h3> -->
        <h3 style="margin-top：15px">奖金明细</h3>
        <a-row :gutter="24" v-if="!isDisabled">
          <a-form :form="form" class="form wdf-form">
            <a-col :span="10">
              <a-form-item style="margin-bottom: 0">
                <a-select
                  style="width: 100%; margin-bottom: 10px; margin-left: 5px"
                  @change="handleProvinceChange"
                  :allowClear="true"
                  placeholder="请选择部门"
                  v-model="departmentId"
                >
                  <a-select-option :value="undefined">请选择部门</a-select-option>
                  <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
                    item.departmentName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item class="form wdf-form">
                <a-select
                  mode="multiple"
                  style="width: 100%; margin-left: 10px"
                  placeholder="请选择人员"
                  :allowClear="true"
                  :maxTagCount="1"
                  @deselect="desedel"
                  @change="handleProvince"
                  v-model="roleArr"
                >
                  <a-select-option v-for="item in roleList" :key="item.userId" :value="item.userId">{{
                    item.userName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-button style="float: right; margin-right: 10px; margin-top: 5px" type="primary" @click="whole">
              全部</a-button
            >
          </a-form>
        </a-row>
        <table class="custom-table custom-table-border">
          <tr>
            <th>序号</th>
            <th>部门</th>
            <th>岗位</th>
            <th>姓名</th>
            <th>年终奖金</th>
            <th v-if="!isView">操作</th>
          </tr>
          <tr v-for="(item, index) in programme" :key="item.key">
            <td>
              {{ index + 1 }}
            </td>
            <td>{{ item.departmentName }}</td>
            <td>{{ item.stationName }}</td>
            <td>{{ item.userName }}</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder
                  @change="inputChange($event, item.userId, 'amount')"
                  v-decorator="[
                    `programme${index}.amount`,
                    { initialValue: item.amount, rules: [{ required: true, message: '请输入实发奖金' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td v-if="!isDisabled">
              <a-popconfirm
                title="是否确定删除"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirmDelete(item.userId)"
              >
                <a type="primary">删除</a>
              </a-popconfirm>
            </td>
          </tr>
          <tr>
            <td colspan="4">合计：</td>
            <td :colspan="!isView ? '2' : '1'">{{ totalPrice }}</td>
          </tr>
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { salary_saveAndUpdate, year_send_getId, year_annual_approval } from '@/api/bonus_management'
import { getDevisionList, getUserByDep } from '@/api/systemSetting'
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
      departmentList: [],
      // 角色列表
      roleList: [],
      departmentId: undefined,
      roleArr: [],
      loading: false,
      cancelTag: null,
      planList: [],
      programme: [],
      remark: '',
      visible: false,
      spinning: false,
      year_send: {},
      year: undefined,
      ment: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
      isModified: false, //财务人员为 true
      previewVisible: false,
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改年终奖金'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}年终奖金`
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
      return this.isView || this.isEdit
    },
    totalPrice() {
      return this.programme.reduce((addr, item) => {
        addr = Number(addr) + Number(item.amount)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    totalPhase() {
      return this.planList.reduce((addr, item) => {
        addr = Number(addr) + Number(item.percentage || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
  },
  created() {
    getDevisionList().then((res) => {
      this.departmentList = res.data
    })
  },

  methods: {
    moment,
    del(key) {
      let that = this
      that.planList = that.planList.filter((i) => i._key !== key)
    },
    // 规则明细
    desedel(value) {
      // 删除事件
      // console.log(value)
      this.roleArr = this.roleArr.filter((val) => val !== +value)
      this.programme = this.programme.filter((val) => val.userId !== +value)
    },
    handleProvince(value) {
      let that = this
      if (!Array.isArray(value)) return
      value.map((_ppid) => {
        if (!_ppid) return
        let target = that.programme.find((p) => p.userId === _ppid)
        if (!target) {
          let _p = that.roleList.find((_p) => _p.userId === _ppid)
          that.programme.push({ ..._p })
        }
      })
    },
    // 获取部门角色联动
    handleProvinceChange(value) {
      if (value != undefined) {
        // 获取部门下的角色
        // this.depart = value
        getUserByDep({ departmentId: value })
          .then((rs) => {
            this.roleList = rs.data.map((item) => {
              return {
                stationName: item.stationName,
                amount: item.amount,
                userId: item.id,
                departmentId: item.departmentId,
                departmentName: item.departmentName,
                userName: item.trueName,
                amount: null,
              }
            })
          })
          .catch((error) => {
            console.error(error)
          })
      } else {
        this.roleList = []
      }
    },
    unique(arr) {
      //Set数据结构，它类似于数组，其成员的值都是唯一的
      return Array.from(new Set(arr)) // 利用Array.from将Set结构转换成数组
    },
    // 选择全部人员
    whole() {
      if (this.departmentId) {
        this.roleArr = this.roleArr.concat(this.roleList.map((role) => role.userId))
        // this.roleArr = this.unique(arr)
        this.programme = this.programme.concat(
          this.roleList.filter((role) => {
            return !this.programme.some((item) => item.userId === role.userId)
          })
        )
      } else {
        this.programme = []
        this.roleArr = this.roleArr.concat(this.roleList.map((role) => role.userId))
        // this.roleArr = this.unique(arr)
        this.programme = this.programme.concat(
          this.roleList.filter((role) => {
            return !this.programme.some((item) => item.userId === role.userId)
          })
        )
      }
    },
    confirmDelete(roleId) {
      // 确认删除事件
      this.roleArr = this.roleArr.filter((val) => val !== roleId)
      this.programme = this.programme.filter((val) => val.userId !== roleId)
    },

    // 规则
    disabledDate(current, index) {
      let prevDate = index === 0 ? undefined : moment(this.planList[index - 1].grantDate)
      console.log(prevDate)
      if (prevDate === undefined) {
        let arr = this.isEditSalary ? this.record.applyDate : this.record.applyDate.format('YYYY')
        return current.format('YYYY') !== arr
      } else {
        let react = this.isEditSalary
          ? this.record.applyDate + '-12-31'
          : this.record.applyDate.format('YYYY') + '12-31'
        return current.format('YYYY-MM-DD') < prevDate.format('YYYY-MM-DD') || current.format('YYYY-MM-DD') > react
      }
    },
    getStateText(state) {
      let stateMap = {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '七',
        8: '八',
        9: '九',
        10: '十',
        11: '十一',
        12: '十二',
      }
      return stateMap[state]
    },
    addItem() {
      if (this.planList.length < 12) {
        this.planList.push({
          _key: uuid(),
          percentage: undefined,
          grantDate: undefined,
        })
      } else {
        this.$message.error('规则不能大于12期')
      }
    },
    inputChanges(event, keys, field) {
      let planList = [...this.planList]
      let target = planList.find((item, index) => item._key === keys)
      if (target) {
        target[field] = event instanceof Event ? event.target.value : event
        this.planList = planList
      }
    },
    inputChange(event, keys, field) {
      let programme = [...this.programme]
      let target = programme.find((item, index) => item.userId === keys)
      if (target) {
        target[field] = event instanceof Event ? event.target.value : event
        this.programme = programme
      }
    },
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      this.departmentId = undefined
      this.roleArr = []
      if (type === 'add') {
        console.log(record)
        this.visiblel = true
        this.addItem()
        this.addItem()
        this.addItem()
        this.year = moment(record.applyDate).format('YYYY')
      } else {
        this.fillData()
        this.year = record.applyDate
      }
    },
    // 详情
    fillData() {
      let that = this
      this.$nextTick(() => {
        year_send_getId({ id: this.record.id }).then((res) => {
          console.log(res.data)
          this.planList = res.data.salaryBonusAnnualRuleDetailVos.map((i) => {
            return {
              _key: uuid(),
              grantDate: moment(i.grantDate),
              percentage: i.percentage,
            }
          })
          this.programme = res.data.salaryBonusAnnualUserDetailVos
          this.roleArr = res.data.salaryBonusAnnualUserDetailVos.map((i) => i.userId)
          // this.record.depId = res.data.departmentId
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
            let arr = {}
            if (that.type === 'edit-salary') {
              arr.id = that.record.id
              arr.applyDate = this.record.applyDate
              arr.status = this.record.status
              arr.instanceId = this.record.instanceId
            }
            if (this.totalPhase !== '100.00') {
              return this.$message.error('比例总和要等于100')
            }
            arr.applyDate = this.year
            arr.salaryBonusAnnualUsers = this.programme
            arr.salaryBonusAnnualRules = this.planList.map((i) => {
              return {
                grantDate: i.grantDate.format('YYYY-MM-DD'),
                percentage: i.percentage,
              }
            })

            if (that.type === 'add' || that.type === 'edit-salary') {
              that.spinning = true
              salary_saveAndUpdate(arr)
                .then((res) => {
                  if (res.code === 200) {
                    this.programme = []
                    that.planList = []
                    this.visible = false
                    that.spinning = false
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
      this.programme = []
      this.planList = []
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
      year_annual_approval(values)
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