<template>
  <a-modal title="选择人员" :width="850" :visible="visible" @cancel="handleCancel" :footer="null" :maskClosable="false">
    <a-card :bordered="false">
      <a-form layout="inline" :form="form">
        <a-form-item label="工号">
          <a-input v-model="jobNum" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model="trueName" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model="mobile" />
        </a-form-item>
        <a-form-item label="部门">
          <a-select style="width: 150px" v-model="selectedDepartment">
            <a-select-option :value="0">请选择</a-select-option>
            <a-select-option v-for="val in department" :key="val.id" :value="val.id">{{
              val.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
      <a-layout>
        <a-layout-content>
          <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false">
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
            <div slot="trueName" slot-scope="text, record">
              <a href="javascript:void(0);" @click="selectedUser(record)">{{ text }}</a>
            </div>
            <div slot="states" slot-scope="text">
              <span v-if="text === 0">启用</span>
              <span v-if="text === 1">禁用</span>
            </div>

            <div slot="sexs" slot-scope="text">
              <div v-if="text === 1">男</div>
              <div v-else>女</div>
            </div>
            <div slot="positionStatuss" slot-scope="text">
              <div v-if="text === 1">试用期</div>
              <div v-else>正式员工</div>
            </div>
          </s-table>
        </a-layout-content>
      </a-layout>
    </a-card>
  </a-modal>
</template>

<script>
import { getDevisionList, getUserListByUserId } from '@/api/systemSetting'
import moment from 'moment'
import { STable } from '@/components'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '工号',
    dataIndex: 'jobNum',
    key: 'jobNum',
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'trueName',
    key: 'trueName',
    scopedSlots: { customRender: 'trueName' },
  },
  {
    align: 'center',
    title: '性别',
    dataIndex: 'sex',
    // key: 'sex',
    key: 'sexs',
    scopedSlots: { customRender: 'sexs' },
  },
  {
    align: 'center',
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName',
    key: 'stationName',
  },
  {
    align: 'center',
    title: '员工状态',
    dataIndex: 'positionStatus',
    key: 'positionStatuss',
    scopedSlots: { customRender: 'positionStatuss' },
  },
]

const data = []
export default {
  name: 'SystemUser',
  components: {
    STable,
  },
  data() {
    return {
      data: data,
      columns: columns,
      pagination: {},
      loading: false,
      visible: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      department: [],
      currentRecord: {},
      dialogTitle: '修改部门',
      status: 0,
      jobNum: '', // 搜索栏
      trueName: '', // 搜索栏
      mobile: '', // 搜索栏
      selectedDepartment: 0, // 搜索栏
      entryDate: moment(), // 入职日期, 默认今天
      // 部门列表
      departmentList: [],
      // 选择的部门
      selectedDepartmentId: 0,
      // 岗位列表
      stationList: [],
      // 选择的岗位
      selectedStationId: 0,
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getUserListByUserId(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
    }
  },
  mounted() {
    this.getList({})
    getDevisionList()
      .then((data) => {
        this.department = data.data
      })
      .catch((error) => {
        this.loading = false
        console.error(error)
      })
  },
  methods: {
    search() {
      if (this.trueName != '') {
        this.$set(this.queryParam, 'trueName', this.trueName)
      } else {
        this.$set(this.queryParam, 'trueName', undefined)
      }
      if (this.mobile != '') {
        this.$set(this.queryParam, 'mobile', this.mobile)
      } else {
        this.$set(this.queryParam, 'mobile', undefined)
      }
      if (this.jobNum != '') {
        this.$set(this.queryParam, 'jobNum', this.jobNum)
      } else {
        this.$set(this.queryParam, 'jobNum', undefined)
      }
      if (this.selectedDepartment != 0) {
        this.$set(this.queryParam, 'departmentId', this.selectedDepartment)
      } else {
        this.$set(this.queryParam, 'departmentId', undefined)
      }
      this.$refs.table.refresh(false)
    },
    // 获取用户管理页面列表
    getList(params = {}) {
      params = {
        current: params.current || 1,
        // results: 10,
        size: 8,
        // ...params
      }
      if (this.selectedDepartment) {
        params.departmentId = this.selectedDepartment
      }
      if (this.jobNum !== '') {
        params.jobNum = this.jobNum
      }
      if (this.trueName !== '') {
        params.trueName = this.trueName
      }
      if (this.mobile !== '') {
        params.mobile = this.mobile
      }
      this.loading = true
      getUserListByUserId(params)
        .then((data) => {
          const pagination = { ...this.pagination }
          pagination.total = data.data.total || 200
          this.loading = false
          this.data = data.data.records
          this.pagination = pagination
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    query(decoratorKey) {
      this.decoratorKey = decoratorKey
      this.form.resetFields()
      this.$nextTick(() => (this.visible = true))
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    selectedUser(record) {
      this.visible = false
      this.$emit('selectSystemUsers', { decoratorKey: this.decoratorKey, record: record })
    },
  },
}
</script>

<style scoped>
/*
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}

.left-tree {
  display: flex;
}

.treewrap {
  margin-right: 24px;
}

.righttab {
  width: 100%;
}

.wdf-add {
  margin-top: 14px;
}
*/
</style>
