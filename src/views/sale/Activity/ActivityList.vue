<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-input
        style="width: 200px; margin-left: 10px; margin-right: 10px"
        :placeholder="this.activeKey === 1 ? '销售额' : this.activeKey === 2 ? '销售订单' : '平均销售额度'"
        v-model="queryParam.quota"
        :allowClear="true"
      />
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction"
        >查询</a-button
      >
      <template v-if="$auth('commissionBonus:add')">
        <a-dropdown style="float: right">
          <a-button type="primary" @click="showModal('add', null)"> <a-icon type="plus" />新增 </a-button>
        </a-dropdown>
        <a-dropdown style="float: right; margin-right: 20px">
          <a-button type="primary" @click="Distribution()"> 计算公式 </a-button>
        </a-dropdown>
      </template>

      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" @change="tabChange">
        <a-tab-pane tab="销售额指数" key="1">
          <a-table
            v-if="$auth('commissionBonus:lists')"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>

            <div slot="startQuota" slot-scope="text, record, index">
              <span>{{ text }}-{{ record.endQuota }}</span>
            </div>
            <span slot="action" slot-scope="text, record">
              <template>
                <a @click="showModal('see', record)">查看</a>
              </template>
              <template>
                <a-divider type="vertical" />
                <a @click="showModal('edit-salary', record)">修改</a>
              </template>
              <template>
                <a-divider type="vertical" />
                <a @click="confirmDelete(record)">删除</a>
              </template>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="销售订单指数" key="2">
          <a-table
            v-if="$auth('commissionBonus:lists')"
            :columns="columns1"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
            <div slot="startQuota" slot-scope="text, record, index">
              <span>{{ text }}-{{ record.endQuota }}</span>
            </div>
            <span slot="action" slot-scope="text, record">
              <template>
                <a @click="showModal('see', record)">查看</a>
              </template>
              <template>
                <a-divider type="vertical" />
                <a @click="showModal('edit-salary', record)">修改</a>
              </template>
              <template>
                <a-divider type="vertical" />
                <a @click="confirmDelete(record)">删除</a>
              </template>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="销售平均额指数" key="3">
          <a-table
            v-if="$auth('commissionBonus:lists')"
            :columns="columns2"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
            <div slot="startQuota" slot-scope="text, record, index">
              <span>{{ text }}-{{ record.endQuota }}</span>
            </div>
            <span slot="action" slot-scope="text, record">
              <template>
                <a @click="showModal('see', record)">查看</a>
              </template>
              <template>
                <a-divider type="vertical" />
                <a @click="showModal('edit-salary', record)">修改</a>
              </template>
              <template>
                <a-divider type="vertical" />
                <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(record)">
                  <a type="primary">删除</a>
                </a-popconfirm>
              </template>
            </span>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>

    <Appadd ref="appadd" />
    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>
<script>
import { getActivityFormula, reportActivityList, saveAndUpdateIndexDelete } from '@/api/saleReport'
import Appadd from './module/Appadd'
import AddForm from './module/AppFrom'
// import ApproveInfo from '@/components/CustomerList/ApproveInfo'
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
    title: '销售额度(万元)',
    dataIndex: 'startQuota',
    key: 'month',
    scopedSlots: { customRender: 'startQuota' },
  },

  {
    align: 'center',
    title: '活跃度指数',
    dataIndex: 'exponent',
    key: 'exponent',
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
    title: '修改人',
    dataIndex: 'modifierName',
    key: 'modifierName',
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'modifyTime',
    key: 'modifyTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
const columns1 = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },

  {
    align: 'center',
    title: '销售订单',
    dataIndex: 'startQuota',
    key: 'month',
    scopedSlots: { customRender: 'startQuota' },
  },

  {
    align: 'center',
    title: '活跃度指数',
    dataIndex: 'exponent',
    key: 'exponent',
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
    title: '修改人',
    dataIndex: 'modifierName',
    key: 'modifierName',
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'modifyTime',
    key: 'modifyTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
const columns2 = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },

  {
    align: 'center',
    title: '平均销售额度(万元)',
    dataIndex: 'startQuota',
    key: 'month',
    scopedSlots: { customRender: 'startQuota' },
  },

  {
    align: 'center',
    title: '活跃度指数',
    dataIndex: 'exponent',
    key: 'exponent',
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
    title: '修改人',
    dataIndex: 'modifierName',
    key: 'modifierName',
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'modifyTime',
    key: 'modifyTime',
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
    Appadd: Appadd,
    AddForm: AddForm,
    // ApproveInfo: ApproveInfo,
  },
  data() {
    return {
      visible: false,
      queryParam: {},
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      status: '',
      depId: '',
      activeKey: 1,
      approval_status: undefined,
      columns,
      columns1,
      columns2,
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
        if (to.name === 'ActivityL') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,

    //新增
    showModal(type, record) {
      this.$refs.addForm.query(type, record, { type: this.activeKey })
    },
    //计算公式
    Distribution() {
      getActivityFormula().then((res) => {
        if (res.data) {
          this.$refs.appadd.query('edit-salary', res.data)
        } else {
          this.$refs.appadd.query('add', null)
        }
      })
    },
    init() {
      let that = this
      that.searchAction()
    },

    // 删除
    confirmDelete(record) {
      let that = this
      saveAndUpdateIndexDelete(`id=${record.id}`).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },
    searchAction(opt) {
      let that = this
      if (that.queryParam.month) {
        let date = moment(that.queryParam.month).format('YYYY-MM')
        that.queryParam.month = date
      }
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, opt || {}, {
        type: that.activeKey,
      })
      that.loading = true
      reportActivityList(_searchParam)
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
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      const pager = pagination
      pager.current = pagination.current
      if (+pager.pageSize !== +pager._prePageSize) {
        //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = { ...this.pagination, ...pager }
      this.searchAction()
    },

    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1, type: this.activeKey })
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
