<template>
  <!-- 换料单 -->
  <div class="wdf-custom-wrapper" id="agency-contract-wrapper">
    <!-- 筛选-开始 -->
    <SearchKey :activeKey="activeKey" @clean="onClean" @search="onSearchKey" @add="onAdd"></SearchKey>
    <!-- 筛选-结束 -->
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <a-tab-pane tab="待审批" key="1" />
        <a-tab-pane tab="已审核" key="2" />
      </a-tabs>
      <a-table
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="approveStatusText" slot-scope="text, record">
          <a
            v-if="record.approveStatus > 1 && record.approveStatus < 5"
            type="primary"
            @click="onApproveList(record)"
            >{{ text }}</a
          >
          <span v-else>{{ text }}</span>
        </div>

        <!-- 原物料变化-查看 -->
        <div slot="materialView" slot-scope="text, record">
          <a type="primary" @click="onMaterialView(record)">查看</a>
        </div>
        <!-- 状态及操作说明
        1.待提交/已撤回  详情 编辑（编辑页面同新增回显只有操作数据）
        2.待审核 详情 撤回
          2.1（仅可撤回第一结点尚未审核的数据，即在王朋审核前可以撤回，到采购审核时候不可撤回了）
          2.2 撤回后为已撤回状态,已撤回的才可删除
        3.通过/不通过 详情
        详情仅可查看审核结果操作,不可查看具体报价信息 -->
        <!-- approveStatus 审批状态：1待提交 2待审批 3通过，4不通过 5已撤回  -->
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">详情</a>
          <template v-if="(record.approveStatus === 1 || record.approveStatus === 5) && +activeKey === 0">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit', record)">编辑</a>
          </template>
          <template v-if="record.approveStatus === 2 && +activeKey === 0">
            <a-divider type="vertical" />
            <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('withdraw', record)">
              <a type="primary" href="javascript:;">撤回</a>
            </a-popconfirm>
          </template>
          <template v-if="record.approveStatus === 5 && +activeKey === 0">
            <a-divider type="vertical" />
            <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
              <a type="primary" href="javascript:;">删除</a>
            </a-popconfirm>
          </template>

          <template v-if="activeKey === 1 && record.approveStatus === 2">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approve', record)">审核</a>
          </template>
          <!-- //是否展示变更报价按钮：0 不展示 1 展示 -->
          <template v-if="record.showChangeQuotationButton === 1">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('change', record)">变更报价</a>
          </template>
        </div>
      </a-table>
    </div>
    <MaterialChange ref="materialChangeModal" />
    <AddForm ref="addForm" @ok="() => searchAction({ current: 1 })" />
    <ApproveInfo ref="approveInfoCard" />
    <ChangeQuotation ref="changeQuotation" @ok="() => searchAction({ current: 1 })"></ChangeQuotation>
  </div>
</template>

<script>
import {
  refuellingPageList, //换料单-列表
  refuellingDelete, //换料单-删除
  refuellingWithdraw //换料单-撤回
} from '@/api/orderChange'
import DepartmentSelect from '@/components/CustomerList/DepartmentSelect' //生产车间
import MaterialChange from './modules/MaterialChange.vue' //原物料变化-查看
import AddForm from './modules/AddForm.vue' //新增/详情
import ApproveInfo from '@/components/CustomerList/ApproveInfo' //审批预览
import ChangeQuotation from './modules/ChangeQuotation.vue' //变更报价
import SearchKey from './modules/SearchKey.vue'

const columns = [
  {
    title: '序号',
    key: 'key',
    width: '70px',
    dataIndex: 'key'
  },
  {
    title: '换料单号',
    dataIndex: 'applyCode'
  },
  {
    title: '技改单号',
    dataIndex: 'craftChangeCode'
  },
  {
    title: '加工需求单号',
    dataIndex: 'needCode'
  },
  {
    title: '原物料变化',
    dataIndex: 'materialView',
    scopedSlots: { customRender: 'materialView' }
  },
  {
    title: '原成品是否可用',
    dataIndex: 'oldUseFlagText' //原成品物料是否可用：0 不可用 1 可用
  },
  {
    title: '状态',
    width: '80px',
    dataIndex: 'approveStatusText', //审批状态：1待提交 2待审批 3通过，4不通过 5已撤回
    scopedSlots: { customRender: 'approveStatusText' }
  },
  {
    align: 'center',
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'outsourcing-order-change-refuelling',
  components: {
    SearchKey,
    DepartmentSelect,
    AddForm,
    MaterialChange,
    ApproveInfo,
    ChangeQuotation
  },
  data() {
    return {
      activeKey: 0,
      columns,
      dataSource: [], //换料单列表
      pagination: {
        //分页加载
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      loading: false,
      searchParam: {
        needCode: undefined, //需求单单号
        applyCode: undefined, //换料单单号
        approveStatus: undefined //审批状态：1待提交 2待审批，3通过，4不通过，5已撤回
      },
      userInfo: this.$store.getters.userInfo, //当前登录人
      storageMaterialList: [] //物料列表
    }
  },
  watch: {
    $route: {
      handler: function(to) {
        if (to.name === 'outsourcing-order-change-refuelling') {
          this.searchAction()
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 查询-换料单列表
    searchAction(opt = {}) {
      let that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const _searchParam = Object.assign(
        {},
        { ...this.searchParam, searchStatus: that.activeKey },
        paginationParam,
        opt
      )
      this.loading = true
      refuellingPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            //原成品物料是否可用：0 不可用 1 可用
            item.oldUseFlagText = { 0: '不可用', 1: '可用' }[item.oldUseFlag] || '未知'
            //审批状态：1待提交 2待审批，3通过，4不通过，5已撤回
            item.approveStatusText =
              { 1: '待提交', 2: '待审批', 3: '通过', 4: '不通过', 5: '已撤回' }[item.approveStatus] || '未知'
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          const { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.searchAction()
          }
        })
        .catch(() => (that.loading = false))
    },
    // 列表-分页、排序、筛选变化时触发
    handleTableChange(pagination) {
      const pager = pagination
      if (+pager.pageSize !== +pager._prePageSize) {
        pager.current = 1
        pager._prePageSize = +pager.pageSize
      }
      this.pagination = { ...this.pagination, ...pager }
      this.searchAction()
    },
    //原物料变化-查看
    onMaterialView(record) {
      this.$refs.materialChangeModal.query('view', record || {})
    },
    //列表操作-查看/删除
    doAction(actionType, record) {
      const that = this
      if (actionType === 'del') {
        refuellingDelete(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.searchAction()
            }
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'withdraw') {
        refuellingWithdraw({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.searchAction()
            }
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'change') {
        that.$refs.changeQuotation.query(record || {}, 1)
      } else {
        that.$refs.addForm.query(actionType, record || {})
      }
    },
    // 切换 选项卡，并刷新数据
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchAction({ current: 1 })
    },
    //筛选条件-根据加工商/加工单号 检索
    onFacOrderChange({ selectItem, type }) {
      if (type === 1) {
        this.searchParam.facId = selectItem.facId
        this.searchParam.facName = selectItem.facName
      } else {
        this.searchParam.orderId = selectItem.orderId
        this.searchParam.orderNo = selectItem.orderNo
      }
    },
    //查看审批流程
    onApproveList(record) {
      this.$refs.approveInfoCard.init(record.instanceId, 'material')
    },
    //清空筛选条件
    onClean() {
      this.searchParam = {}
    },
    //搜索
    onSearchKey(params) {
      this.searchParam = { ...params, newMaterialId: params.materialId, newMaterialName: params.materialName }
      delete this.searchParam.materialId
      delete this.searchParam.materialName
      this.searchAction({ current: 1 })
    },
    //测试新增
    onAdd() {
      this.doAction('add', { orderId: 1, needId: 10 })
    }
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
