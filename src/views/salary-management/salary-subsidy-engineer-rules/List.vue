<template>
  <!-- 岗位等级补贴规则（1 油补规则 2  通讯补贴 3 高级工程师补贴）  -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-select placeholder="岗位等级" v-model="stationLevel" :allowClear="true" style="width: 150px">
        <a-select-option v-for="level in levelList" :key="level" :value="level">{{ level }}</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
      <a-button
        style="float: right"
        type="primary"
        icon="plus"
        @click="doAction('add', null)"
        v-if="$auth('salary-subsidy-engineer-rules:add')"
        >新增</a-button
      >
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="$auth('salary-subsidy-engineer-rules:view')">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
          <template v-if="$auth('salary-subsidy-engineer-rules:edit')">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit', record)">修改</a>
          </template>
          <template v-if="$auth('salary-subsidy-engineer-rules:edit-record')">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit-record', record)">修改记录</a>
          </template>
          <template v-if="$auth('salary-subsidy-engineer-rules:del')">
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="doAction('del', record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getSelectLevelList,
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import { levelRulePageList, levelRuleDel, levelRuleAddOrUpdate } from '@/api/salaryManagement'
import AddForm from './AddForm'
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
    title: '岗位等级',
    dataIndex: 'levelType',
  },
  {
    align: 'center',
    title: '油补(元)',
    dataIndex: 'oilAmount',
  },
  {
    align: 'center',
    title: '通讯补贴(元)',
    dataIndex: 'comAmount',
  },
  // {
  //   align: 'center',
  //   title: '高级工程师补贴(元)',
  //   dataIndex: 'highEngAmount'
  // },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'salary-subsidy-engineer-rules',
  components: {
    AddForm,
  },
  data() {
    return {
      stationLevel: undefined,
      levelList: [],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
        size: '10',
        showSizeChanger: true,
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      loading: false,
      bindEnterFn: null,
    }
  },
  computed: {
    searchParam() {
      return {
        levelType: this.stationLevel,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'salary-subsidy-engineer-rules') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    that.bindEnterFn = (event) => {
      if (event.type === 'keyup' && event.keyCode === 13) {
        //Enter
        that.searchAction()
      }
    }
    if (ele) {
      ele.addEventListener('keyup', that.bindEnterFn)
    }
  },
  beforeDestroy() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
  },
  methods: {
    init() {
      let that = this
      //getDictionaryList({parentId:498}).then(res => that.meetingTypesList = res.data)
      getSelectLevelList().then((res) => (that.levelList = res.data))
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.size || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      levelRulePageList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.searchAction()
          }
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    onShowSizeChangeHandler(current, pageSize) {
      let pagination = { ...this.pagination }
      pagination.current = current
      pagination.size = String(pageSize)
      this.pagination = pagination
      this.searchAction()
    },
    doAction(actionType, record) {
      let that = this
      if (actionType === 'del') {
        console.log(record)
        levelRuleDel({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
      this.$refs.addForm.query(actionType, record)
    },
  },
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.wdf-custom-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
