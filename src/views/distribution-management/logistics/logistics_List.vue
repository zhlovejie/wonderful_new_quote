<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px;">
      <a-input
        placeholder="物流单号"
        v-model="queryParam.title"
        allowClear
        style="width: 200px;margin-right:10px;"
      />
      <a-range-picker
        @change="dateChange"
        style="width:400px ;margin-right:10px;"
        v-model="queryParam.rangeDate"
      />

      <a-button style="margin-left:10px;" type="primary" @click="searchAction()">查询</a-button>
      <template v-if="$auth('social:add')">
        <a-button style="float:right;" type="primary" icon="plus" @click="applyFor('add',null)">新增</a-button>
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-table :columns="columns" :data-source="dataSource" v-if="$auth('social:list')">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <span slot="action" slot-scope="text, record">
          <a @click="handleSee(record)">查看</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link" :href="urls+record.id">下载</a>
          <template v-if="$auth('social:add')&&+record.createdId  === +userInfo.id">
            <a-divider type="vertical" />
            <a @click="handleAdd('edit-salary',record)">修改</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link" @click="delete_list(record.id)">删除</a>
          </template>
          <template>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link" @click="delete_list(record.id)">回访记录</a>
          </template>
        </span>
      </a-table>
    </a-layout>
  </a-card>
</template>

<script>
import moment from 'moment'
import system from '@/config/defaultSettings'
import { securitySocial_List, securitySocial_del } from '@/api/humanResources'

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
    dataIndex: 'accountDate',
    key: 'accountDate',
    align: 'center',
  },
  {
    title: '物流单号',
    dataIndex: 'peopleNumber',
    key: 'peopleNumber',
    align: 'center',
  },
  {
    title: '车牌号',
    dataIndex: 'companyPay',
    key: 'companyPay',
    align: 'center',
  },
  {
    title: '驾驶人姓名',
    dataIndex: 'personalPay',
    key: 'personalPay',
    align: 'center',
  },
  {
    title: '驾驶人手机号',
    dataIndex: 'createdName',
    key: 'createdName',
    align: 'center',
  },
  {
    title: '目的地',
    dataIndex: 'createdTime',
    key: 'createdTime',
    align: 'center',
  },
  {
    title: '结算方式',
    dataIndex: 'createdTime1',
    key: 'createdTime1',
    align: 'center',
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime2',
    key: 'createdTime2',
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
  components: {},
  data() {
    return {
      urls: system.baseURL + '/socialSecurity/social-security-info/socialSecurityInfo/exportExcel?id=',
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dataSource: [],
      columns,
      pagination: {
        current: 1,
      },
      queryParam: {},
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
        if (to.name === 'human_Resources_social') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      this.searchAction()
    },
    dateChange(date, dateString) {
      this.$set(this.queryParam, 'rangeDate', date)
      this.$set(this.queryParam, 'beginTime', dateString[0])
      this.$set(this.queryParam, 'endTime', dateString[1])
    },
    searchAction(opt) {
      let that = this
      that.loading = true
      if (this.queryParam.Dates) {
        let date = that.queryParam.Dates.format('YYYYMM')
        this.queryParam.accountDate = date
      }
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination }, opt || {})
      securitySocial_List(_searchParam)
        .then((res) => {
          that.loading = false
          this.queryParam.accountDate = ''
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
    onChange(date, dateString) {
      console.log(date, dateString)
    },
    delete_list(id) {
      let that = this
      securitySocial_del({ id: id }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          that.$message.error(res.msg)
        }
      })
    },
    applyFor(type) {
      this.$router.push({
        name: 'basicInform',
        params: { id: null, action: type },
      })
    },
    // //新增 修改
    // handleAdd(type, record) {
    //   this.$refs.addForm.query(type, record)
    // },
    // 查看
    handleSee(record) {
      this.$router.push({ name: 'humanResourcesSee', params: { id: record.id } })
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
