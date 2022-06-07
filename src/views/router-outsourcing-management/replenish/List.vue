<template>
  <!-- 补料单 -->
  <div class="wdf-custom-wrapper" id="agency-contract-wrapper">
    <!-- 筛选-开始 -->
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select
            placeholder="请选择物料"
            v-model="searchParam.materialId"
            style="width: 250px"
            :allowClear="true"
            show-search
            option-filter-prop="children"
            :filter-option="filterOption"
          >
            <a-select-option v-for="val in storageMaterialList" :key="val.materialId" :value="val.materialId">{{
              `${val.materialName}(${val.materialCode})`
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 审批状态：1待提交 2待审批，3通过，4不通过，5已撤回 -->
        <a-form-item v-if="+activeKey === 0">
          <a-select
            placeholder="请选择审批状态"
            v-model="searchParam.approveStatus"
            style="width:150px;"
            :allowClear="true"
          >
            <a-select-option :value="1">待提交</a-select-option>
            <a-select-option :value="2">待审批</a-select-option>
            <a-select-option :value="3">通过</a-select-option>
            <a-select-option :value="4">不通过</a-select-option>
            <a-select-option :value="5">已撤回</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="加工单号/物料名称/补料单号"
            v-model="searchParam.parameter"
            style="width:300px;"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="text" @click="onClean" style="margin-right:10px;">清除</a-button>
          <a-button type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
          <a-button type="text" @click="doAction('add', { orderId: 1, needId: 10 })" style="margin-left:10px;"
            >测试新增</a-button
          >
        </a-form-item>
      </a-form>
    </div>
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
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @ok="() => searchAction({ current: 1 })" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>

<script>
import {
  replenishPageList, //补料单-列表
  replenishDelete, //补料单-删除
  replenishWithdraw //补料单-撤回
} from '@/api/orderChange'
import {
  exWarehouseApplyGetMaterial //条件检索-物料列表
} from '@/api/storage_wzz'
import AddForm from './modules/AddForm.vue' //新增/详情
import ApproveInfo from '@/components/CustomerList/ApproveInfo' //审批预览

const columns = [
  {
    title: '序号',
    key: 'key',
    width: '70px',
    dataIndex: 'key'
  },
  {
    title: '补料单号',
    dataIndex: 'applyCode'
  },
  {
    title: '委外加工单号',
    dataIndex: 'orderCode'
  },
  {
    title: '属性',
    dataIndex: 'typeText' //类型(1:原料,2:模具)
  },
  {
    title: '原料名称',
    dataIndex: 'materialName'
  },
  {
    title: '原料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '规格型号',
    dataIndex: 'specification'
  },
  {
    title: '单位（辅单位）',
    dataIndex: 'subUnit'
  },
  {
    title: '原料个数',
    dataIndex: 'oldNum'
  },
  {
    title: '待补料数量',
    dataIndex: 'feedNum'
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
  name: 'outsourcing-replenish',
  components: {
    AddForm,
    ApproveInfo
  },
  data() {
    return {
      activeKey: 0,
      columns,
      dataSource: [], //补料单列表
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
        applyCode: undefined, //补料单单号
        facInfoId: undefined, //加工商id
        approveStatus: undefined //审批状态：1待提交 2待审批，3通过，4不通过，5已撤回
      },
      userInfo: this.$store.getters.userInfo, //当前登录人
      storageMaterialList: [] //物料列表
    }
  },
  watch: {
    $route: {
      handler: function(to) {
        if (to.name === 'outsourcing-replenish') {
          this.init()
        }
      },
      immediate: true
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    //获取初始数据源-物料列表
    init() {
      let that = this
      let queue = []
      let task1 = exWarehouseApplyGetMaterial().then(res => (that.storageMaterialList = res.data))
      queue.push(task1)
      that.searchAction()
      return Promise.all(queue)
    },
    // 查询-补料单列表
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
      replenishPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            //审批状态：1待提交 2待审批，3通过，4不通过，5已撤回
            item.approveStatusText =
              { 1: '待提交', 2: '待审批', 3: '通过', 4: '不通过', 5: '已撤回' }[item.approveStatus] || '未知'
            item.typeText = {1:'原料',2:'模具'}[item.type]||'未知'
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          let { current, pages } = res.data
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
    //列表操作-查看/删除
    doAction(actionType, record) {
      const that = this
      if (actionType === 'del') {
        replenishDelete(`id=${record.id}`)
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
        replenishWithdraw({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.searchAction()
            }
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      } else {
        that.$refs.addForm.query(actionType, record || {})
      }
    },
    // 切换
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchAction({ current: 1 })
    },
    //筛选-选择物料-是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    //选择物料代码 type 1 加工商 2订单
    openFacOrderModel(type) {
      this.$refs.facAndOrderSelect.query(type)
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
    //清空筛选条件
    onClean() {
      this.searchParam = {}
    },
    //查看审批流程
    onApproveList(record) {
      this.$refs.approveInfoCard.init(record.instanceId, 'material')
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
