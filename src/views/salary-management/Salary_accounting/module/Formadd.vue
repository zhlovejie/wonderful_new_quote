<template>
  <a-modal
    :title="modalTitle"
    :width="1600"
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
      <a-row style="margin-top: 30px; margin-bottom: 30px" v-if="isDisabled">
        <a-col :span="6" class="basic-tit" justify="left" align="middle">实发工资：{{ realSalaryBigDecimal }}</a-col>
        <a-col :span="6" class="basic-tit" justify="left" align="middle"
          >核算工资：{{ calculateSalaryBigDecimal }}</a-col
        >
        <a-col :span="6" class="basic-tit" justify="left" align="middle"
          >年薪资(万元)：{{ annualPeriodicSalaryBigDecimal }}</a-col
        >
        <a-col :span="6" class="basic-tit" justify="left" align="middle"
          >保底差额：{{ guaranteedBalanceBigDecimal }}</a-col
        >
      </a-row>
      <a-table :scroll="{ x: 2300 }" bordered :columns="baseColumns" :data-source="dataSource">
        <div slot="month" slot-scope="text, record, index">
          <span>{{ record.month ? record.month : '合计' }}</span>
        </div>
      </a-table>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { floorsAnnual_Detail, floorsAnnual_instance } from '@/api/bonus_management'
import Approval from './Approval'
import moment from 'moment'

// let uuid = () => Math.random().toString(32).slice(-10)

const columns = [
  {
    dataIndex: 'name',
    title: '月份',
    key: 'month',
    width: 80,
    scopedSlots: { customRender: 'month' },
    align: 'center',
  },

  {
    title: '工资',
    align: 'center',
    children: [],
  },
  {
    title: '奖金',
    align: 'center',
    children: [],
  },
  {
    title: '补贴',
    align: 'center',
    children: [],
  },
  {
    title: '扣款',
    align: 'center',
    children: [],
  },
  {
    title: '提成',
    align: 'center',
    children: [],
  },
  {
    title: '公司发放(元)',
    align: 'center',
    children: [
      {
        title: '公户',
        dataIndex: 'householdPrivateBigDecimal',
        key: 'householdPrivateBigDecimal',
        width: 90,
        align: 'center',
      },
      {
        title: '私户',
        width: 90,
        dataIndex: 'householdPubliceBigDecimal',
        key: 'householdPubliceBigDecimal',
        align: 'center',
      },
      {
        title: '代发工资',
        width: 90,
        dataIndex: 'issuedBehalfSalaryBigDecimal',
        key: 'issuedBehalfSalaryBigDecimal',
        align: 'center',
      },
    ],
  },
  {
    title: '应发基本工资(元)',
    width: 90,
    dataIndex: 'shouldSalaryBigDecimal',
    key: 'shouldSalaryBigDecimal',
    align: 'center',
    // fixed: 'right',
    width: 130,
  },

  {
    title: '社保扣款(元)',
    dataIndex: 'socinsAmountBigDecimal',
    key: 'socinsAmountBigDecimal',
    align: 'center',
    // fixed: 'right',
    width: 120,
  },
  {
    title: '实发工资(元)',
    dataIndex: 'realSalaryBigDecimal',
    key: 'realSalaryBigDecimal',
    align: 'center',
    // fixed: 'right',
    width: 120,
  },
]
export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      realSalaryBigDecimal: '', //实发工资
      calculateSalaryBigDecimal: '', //核算工资
      annualPeriodicSalaryBigDecimal: '', //年薪资（万元）
      guaranteedBalanceBigDecimal: '', //保底差额
      month: '',
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource: [],
      columns,
      pagination1: {},
      queryParam: {
        applyId: undefined,
      },
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      salaryItemBase: [],
      bounsItemBase: [],
      allowanceItemBase: [],
      fineItemBase: [],
      percentageItemBase: [],
      company: [],
    }
  },

  computed: {
    modalTitle() {
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : '新增'
      return `${txt}薪资核算`
    },
    isView() {
      //查看
      return this.type === 'view'
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
    baseColumns() {
      this.columns.map((item) => {
        if (item.title === '工资') {
          item.children = this.salaryItemBase
        }
        if (item.title === '奖金') {
          item.children = this.bounsItemBase
        }
        if (item.title === '补贴') {
          item.children = this.allowanceItemBase
        }
        if (item.title === '扣款') {
          item.children = this.fineItemBase
        }
        if (item.title === '提成') {
          item.children = this.percentageItemBase
        }
      })
      let __columns = [...this.columns]
      let _columns = []

      __columns.map((item, index) => {
        if (this.salaryItemBase.length == 0 && item.title === '工资') {
          _columns.push(item.title)
        }
        if (this.bounsItemBase.length == 0 && item.title === '奖金') {
          _columns.push(item.title)
        }
        if (this.allowanceItemBase.length == 0 && item.title === '补贴') {
          _columns.push(item.title)
        }
        if (this.fineItemBase.length == 0 && item.title === '扣款') {
          _columns.push(item.title)
        }
        if (this.percentageItemBase.length == 0 && item.title === '提成') {
          _columns.push(item.title)
        }
      })
      let strin = _columns.toString()
      let arr = __columns.filter((i) => strin.indexOf(i.title) === -1)

      return arr
    },
  },
  created() {},
  methods: {
    moment,

    //接受数据
    query(type, record) {
      console.log(this.record)
      this.visible = true
      this.type = type
      this.record = record
      // this.month = record.monthid
      this.queryParam.id = record.id
      this.searchAction({ id: record.id })
    },
    searchAction(opt) {
      const that = this
      that.loading = true
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {})
      floorsAnnual_Detail(_searchParam)
        .then((res) => {
          that.loading = false
          try {
            that.month = res.data.staticsDate
          } catch (e) {}
          that.realSalaryBigDecimal = res.data.realSalaryBigDecimal
          that.calculateSalaryBigDecimal = res.data.calculateSalaryBigDecimal
          that.annualPeriodicSalaryBigDecimal = res.data.annualPeriodicSalaryBigDecimal
          that.guaranteedBalanceBigDecimal = res.data.guaranteedBalanceBigDecimal
          that.salaryItemBase = res.data.salaryTab.salaryItemBase.map((item) => {
            return {
              title: item.text,
              dataIndex: item.code,
              width: 90,
              key: item.code,
              align: 'center',
            }
          })
          that.bounsItemBase = res.data.salaryTab.bounsItemBase.map((item) => {
            return {
              title: item.text,
              dataIndex: item.code,
              width: 90,
              key: item.code,
              align: 'center',
            }
          })
          that.allowanceItemBase = res.data.salaryTab.allowanceItemBase.map((item) => {
            return {
              title: item.text,
              dataIndex: item.code,
              width: 90,
              key: item.code,
              align: 'center',
            }
          })
          that.fineItemBase = res.data.salaryTab.fineItemBase.map((item) => {
            return {
              title: item.text,
              dataIndex: item.code,
              width: 90,
              key: item.code,
              align: 'center',
            }
          })
          that.percentageItemBase = res.data.salaryTab.percentageItemBase.map((item) => {
            return {
              title: item.text,
              dataIndex: item.code,
              width: 90,
              key: item.code,
              align: 'center',
            }
          })
          that.dataSource = res.data.oaSalaryMonthDetailVos.map((item, index) => {
            item.key = index + 1
            let _item = { ...item }
            let salaryList = [..._item.salaryList]
            let bounsList = [..._item.bounsList]
            let allowanceList = [..._item.allowanceList]
            let fineList = [..._item.fineList]
            let percentageList = [..._item.percentageList]
            salaryList.map((v) => {
              v.key = v.dicCode
              _item[`${v.key}`] = v.amountBigDecimal
              return v
            })

            bounsList.map((v) => {
              v.key = v.dicCode
              _item[`${v.key}`] = v.amountBigDecimal
              return v
            })
            allowanceList.map((v) => {
              v.key = v.dicCode
              _item[`${v.key}`] = v.amountBigDecimal
              return v
            })
            fineList.map((v) => {
              v.key = v.dicCode
              _item[`${v.key}`] = v.amountBigDecimal
              return v
            })
            percentageList.map((v) => {
              v.key = v.dicCode
              _item[`${v.key}`] = v.amountBigDecimal
              return v
            })
            _item.salaryList = salaryList
            _item.bounsList = bounsList
            _item.allowanceList = allowanceList
            _item.fineList = fineList
            _item.percentageList = percentageList
            return _item
          })
        })
        .catch((err) => (that.loading = false))
    },

    //提交
    handleOk() {
      let that = this
      that.visible = false
    },
    handleCancel() {
      // this.programme = []
      // this.remark = '' // 清空表
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
      floorsAnnual_instance(values)
        .then((res) => {
          that.spinning = false
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
