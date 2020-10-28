<template>
  <a-modal
    :title="modalTitle"
    :width="1300"
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
        <a-col :span="24" class="basic-tit" justify="center" align="middle">{{ month }}工资条</a-col>
      </a-row>
      <div class="table-page-search-wrapper" style="margin-bottom: 20px">
        <a-select
          style="width: 200px; margin-right: 10px"
          v-model="queryParam.departmentId"
          :allowClear="true"
          placeholder="请选择部门"
        >
          <a-select-option :value="undefined">请选择部门</a-select-option>
          <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
            item.departmentName
          }}</a-select-option>
        </a-select>
        <a-input
          placeholder="员工姓名"
          v-model="queryParam.userName"
          allowClear
          style="width: 200px; margin-right: 10px"
        />

        <a-button style="margin-left: 10px" type="primary" @click="searchAction()">查询</a-button>
      </div>
      <a-table
        :scroll="{ x: 4000 }"
        bordered
        :columns="baseColumns"
        :data-source="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
        v-if="$auth('Distribution:list')"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { getDevisionList, getStationList } from '@/api/systemSetting'
import { wages_Detail, wages_ListDic, wages_instance } from '@/api/bonus_management'
import Approval from './Approval'
import moment from 'moment'

// let uuid = () => Math.random().toString(32).slice(-10)

const columns = [
  {
    dataIndex: 'name',
    title: '序号',
    key: 'order',
    align: 'center',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
    align: 'center',
  },
  {
    title: '职位',
    dataIndex: 'stationName',
    key: 'stationName',
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
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
    title: '应发工资(元)',
    dataIndex: 'shouldSalaryBigDecimal',
    key: 'shouldSalaryBigDecimal',
    align: 'center',
  },

  {
    title: '社保扣款(元)',
    dataIndex: 'socinsAmountBigDecimal',
    key: 'socinsAmountBigDecimal',
    align: 'center',
  },
  {
    title: '实发工资(元)',
    dataIndex: 'realSalaryBigDecimal',
    key: 'realSalaryBigDecimal',
    align: 'center',
  },
]
export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      departmentList: [], // 部门列表
      month: '',
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource: [],
      columns,
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      pagination1: {},
      queryParam: {
        current: 1,
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
    }
  },

  computed: {
    modalTitle() {
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : '新增'
      return `${txt}工资条`
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
      let _columns = []

      this.columns.map((item) => {
        if (item.title === '工资') {
          item.children = this.salaryItemBase
        }
        if (item.title === '奖金') {
          item.children = this.bounsItemBase
        }
        if (item.title === '奖励') {
          item.children = this.allowanceItemBase
        }
        if (item.title === '扣款') {
          item.children = this.fineItemBase
        }
      })
      let __columns = [...this.columns]
      return __columns
    },
  },
  created() {
    getDevisionList().then((res) => {
      this.departmentList = res.data
    })
    wages_ListDic().then((res) => {
      this.salaryItemBase = res.data.salaryItemBase.map((item) => {
        return {
          title: item.text,
          dataIndex: item.code,
          key: item.code,
          align: 'center',
        }
      })
      this.bounsItemBase = res.data.bounsItemBase.map((item) => {
        return {
          title: item.text,
          dataIndex: item.code,
          key: item.code,
          align: 'center',
        }
      })
      this.allowanceItemBase = res.data.allowanceItemBase.map((item) => {
        return {
          title: item.text,
          dataIndex: item.code,
          key: item.code,
          align: 'center',
        }
      })
      this.fineItemBase = res.data.fineItemBase.map((item) => {
        return {
          title: item.text,
          dataIndex: item.code,
          key: item.code,
          align: 'center',
        }
      })
    })
  },
  methods: {
    moment,

    //接受数据
    query(type, record) {
      console.log(this.record)
      this.visible = true
      this.type = type
      this.record = record
      this.month = record.month
      this.queryParam.applyId = record.id
      this.searchAction({ applyId: record.id })
    },
    searchAction(opt) {
      let that = this
      that.loading = true
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 }, opt || {})
      wages_Detail(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            let _item = { ...item }
            let salaryList = [..._item.salaryList]
            let bounsList = [..._item.bounsList]
            let allowanceList = [..._item.allowanceList]
            let fineList = [..._item.fineList]
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

            _item.salaryList = salaryList
            _item.bounsList = bounsList
            _item.allowanceList = allowanceList
            _item.fineList = fineList
            return _item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },

    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
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
      wages_instance(values)
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