<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-month-picker style="width: 200px; margin-right: 10px" v-model="queryParam.staticsDate" />
      <a-select
        placeholder="审核状态"
        v-if="activeKey === 0"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">通过</a-select-option>
        <a-select-option :value="3">不通过</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >

      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <template v-if="$auth('research-commission-bonus:list')">
          <a-tab-pane tab="待我审批" key="1" />
          <a-tab-pane tab="我已审批" key="2" />
        </template>
      </a-tabs>
      <a-table
        v-if="$auth('research-commission-bonus:lists')"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="status" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 公告审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <template v-if="$auth('research-commission-bonus:view')">
              <a type="primary" @click="doAction('view', record)">查看</a>

              <template v-if="$auth('research-commission-bonus:del') && record.status === 3">
                <a-divider type="vertical" />
                <a-popconfirm title="是否要删除此行？" @confirm="doAction('del', record)">
                  <a href="javascript:void(0);">删除</a>
                </a-popconfirm>
              </template>
            </template>
            <template v-if="$auth('research-commission-bonus:download')">
              <a-divider type="vertical" />
              <a type="primary" @click="downloadAction(record.id)">下载</a>
            </template>
          </template>
          <template v-if="activeKey === 1 && record.status === 1">
            <a type="primary" @click="doAction('Approval', record)">审核</a>
          </template>

          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import { bonus_pageList, bounsRules_exportExcel, bounsRules_del } from '@/api/bonus_management'
import AddForm from './module/Formadd'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import moment from 'moment'
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
    title: '日期',
    dataIndex: 'staticsDate',
    key: 'staticsDate',
  },

  {
    align: 'center',
    title: '总提成(元)',
    dataIndex: 'percentageRetio',
    key: 'percentageRetio',
  },
  {
    align: 'center',
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },

  {
    align: 'center',
    title: '提交人',
    key: 'createdName',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交人时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'NoticeList',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
  },
  data() {
    return {
      visible: false,
      Sector: undefined,
      depList: [],
      queryParam: {},
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      depId: '',
      activeKey: 0,
      departmentList: [],
      rule_List: [],
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
      whole: true,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'research-commission') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    disabledDate(current) {
      return current && current > moment().subtract(30, 'days')
    },
    init() {
      let that = this
      that.searchAction()
    },

    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '通过',
        3: '未通过',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    //审批流组件
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },

    // 撤回
    // confirmWithdraw(record) {
    //   let that = this
    //   bonus_withdrawDeveloper(`id=${record.id}`).then((res) => {
    //     this.searchAction()
    //     that.$message.info(res.msg)
    //   })
    // },
    searchAction(opt) {
      let that = this
      if (that.queryParam.staticsDate) {
        let date = moment(that.queryParam.staticsDate).format('YYYY-MM')
        that.queryParam.staticsDate = date
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      that.loading = true
      bonus_pageList(_searchParam)
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
      this.searchAction()
    },
    //下载
    downloadAction(downloadId) {
      let that = this
      that.spinning = true
      bounsRules_exportExcel({ id: downloadId })
        .then((res) => {
          that.spinning = false
          console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = `研发提成奖金信息.xls`
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
        .catch((err) => (that.spinning = true))
    },
    doAction(type, record) {
      if (type === 'del') {
        bounsRules_del({ id: record.id }).then((res) => {
          this.$message.info(res.msg)
          if (+res.code === 200) {
            this.searchAction()
          }
        })
      } else {
        this.$refs.addForm.query(type, record)
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1, searchStatus: this.activeKey })
    },
  },
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.topName {
  top: 230px !important;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
