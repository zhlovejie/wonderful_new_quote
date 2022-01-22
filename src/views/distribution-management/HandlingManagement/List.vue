<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <a-input
        placeholder="物流单号"
        v-model="queryParam.logisticsOrderNo"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-input placeholder="人员" v-model="queryParam.userName" allowClear style="width: 200px; margin-right: 10px" />
      <a-range-picker @change="dateChange" style="width: 400px; margin-right: 10px" v-model="queryParam.rangeDate" />

      <a-button style="margin-left: 10px; margin-right: 10px" type="primary" @click="searchAction({ current: 1 })"
        >查询</a-button
      >
      <a-button class="a-button" type="primary" @click="outPort">下载</a-button>
      <template v-if="$auth('logistics:add')">
        <a-button style="float: right" type="primary" @click="applyFor()">工价设置</a-button>
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
        v-if="$auth('logistics:list')"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <span slot="payer" slot-scope="text, record">
          <span> {{ { 1: '我方付款', 2: '客户付款' }[text] || '未知' }}</span>
        </span>
        <span slot="payerType" slot-scope="text, record">
          <span> {{ { 1: '回付', 2: '现付', 3: '到付', 4: '包邮' }[text] || '未知' }}</span>
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="applyFor1(record)">查看</a>
        </span>
      </a-table>
    </a-layout>

    <AddForm ref="addForm" />
    <AddForm1 ref="addForm1" />
  </a-card>
</template>

<script>
import moment from 'moment'
import system from '@/config/defaultSettings'
import AddForm from './AddForm'
import AddForm1 from './AddForm1'
import { listCarryAdminInfo, logisticsDelete, exportExcel } from '@/api/distribution-management'
const columns = [
  {
    dataIndex: 'name',
    title: '序号',
    key: 'name',
    align: 'center',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    align: 'center',
  },
  {
    title: '物流单号',
    dataIndex: 'logisticsOrderNo',
    key: 'logisticsOrderNo',
    align: 'center',
  },
  {
    title: '方数',
    dataIndex: 'logisticsTypeName',
    key: 'logisticsTypeName',
    align: 'center',
  },
  {
    title: '工价（元）',
    dataIndex: 'wages',
    key: 'wages',
    align: 'center',
  },
  {
    title: '人员',
    dataIndex: 'userName',
    key: 'userName',
    align: 'center',
  },
  {
    title: '提交人',
    dataIndex: 'createdName',
    key: 'createdName',
    align: 'center',
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    align: 'center',
  },

  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  },
]
export default {
  name: 'RoleManagement',
  components: {
    AddForm,
    AddForm1,
  },
  data() {
    return {
      urls: system.baseURL + '/logistics/logistics-information/download/LogisticsDownload?id=',
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
      queryParam: { current: 1 },
      hiddenBoolean: false,

      selectedRowKeys: [],
      selectedRows: [],

      // 部门列表
      departmentList: [],
      // 角色列表
      roleList: {},
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'Handling_management') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment: moment,
    init() {
      this.searchAction()
    },
    // 下载
    outPort() {
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 })
      exportExcel(_searchParam)
        .then((res) => {
          this.loading = false
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.ms-excel'
            //const isFile = res.type === 'application/msword'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = '搬运管理.xls'
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => (this.loading = false))
    },
    dateChange(date, dateString) {
      // this.$set(this.queryParam, 'rangeDate', date)
      this.$set(this.queryParam, 'startDate', dateString[0])
      this.$set(this.queryParam, 'endDate', dateString[1])
    },
    searchAction(opt) {
      let that = this
      that.loading = true
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 }, opt || {})
      listCarryAdminInfo(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
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
      // console.log(pagination, filters, sorter)
      // const pager = { ...this.pagination }
      // pager.current = pagination.current
      // this.pagination = pager
      this.searchAction()
    },
    delete_list(id) {
      let that = this
      logisticsDelete({ id: id }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          that.$message.error(res.msg)
        }
      })
    },
    applyFor() {
      this.$refs.addForm.query()
    },
    applyFor1(type) {
      this.$refs.addForm1.query(type)
    },
  },
}
</script>

<style lang="less" scoped>
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
</style>
