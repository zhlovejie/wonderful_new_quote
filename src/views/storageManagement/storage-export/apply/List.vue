<template>
  <!-- 出库申请单 -->
  <div class="wdf-custom-wrapper" id="agency-contract-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">

        <a-form-item>
          <a-select placeholder="出库类型" v-model="searchParam.exWarehouseType" style="width: 150px" :allowClear="true">
            <a-select-option :value="1">基建出库</a-select-option>
            <a-select-option :value="2">研发出库</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-input placeholder="单号模糊搜索" v-model="searchParam.exWarehouseApplyCode" style="width:180px;" />
        </a-form-item>

        <a-form-item>
          <a-select
            placeholder="选择物料"
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
        
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>

        <a-form-item style="float:right;">
          <a-button v-if="$auth('exWarehouseApplyList:add')" icon="plus" type="primary" @click="doAction('add',{})"> 新增 </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <a-tab-pane tab="待我审批" key="1" />
        <a-tab-pane tab="我已审批" key="2" />
      </a-tabs>
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

        <div slot="materialName" slot-scope="text, record">
          <a-popover title="物料信息">
            <template slot="content">
              <h3>规格型号</h3>
              <p style="width:450px;">{{ record.specification }}</p>
              <h3>物料代码</h3>
              <p style="width:450px;">{{ record.materialCode }}</p>
            </template>
            <span>{{ text }}</span>
          </a-popover>
        </div>

        <div slot="status" slot-scope="text, record">
          <a href="javascript:void(0);" @click="approvalPreview(record)">{{ record.statusText }}</a>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- { 1: '待审批', 2: '通过', 3: '不通过', 4: '撤回' } -->
          <a type="primary" v-if="$auth('exWarehouseApplyList:view')" @click="doAction('view', record)">查看</a>

          <template v-if="+activeKey === 0">
            <template v-if="[3, 4].includes(+record.status) && (+userInfo.id === +record.createdId) && $auth('exWarehouseApplyList:edit')">
              <a-divider type="vertical" />
              <a type="primary" href="javascript:;" @click="doAction('edit', record)">修改</a>
            </template>

            <template v-if="[1].includes(+record.status) && (+userInfo.id === +record.createdId) && $auth('exWarehouseApplyList:withdraw')">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('withdraw', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>

            <template v-if="[3, 4].includes(+record.status) && (+userInfo.id === +record.createdId) && $auth('exWarehouseApplyList:delete')">
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="+activeKey === 1 && $auth('exWarehouseApplyList:approval')">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>
        </div>

        <a-table
          slot="expandedRowRender"
          slot-scope="record, index, indent, expanded"
          :columns="innerColumns"
          :dataSource="record.exWarehouseApplyMaterials"
          :pagination="false"
          size="small"
        >
          <div slot="order" slot-scope="text, record, index">
            {{ index + 1 }}
          </div>
          <div slot="materialName" slot-scope="text, record">
            <a-popover title="物料信息">
              <template slot="content">
                <h3>物料名称</h3>
                <p style="width:450px;">{{ record.materialName }}</p>
                <h3>规格型号</h3>
                <p style="width:450px;">{{ record.specification }}</p>
                <h3>物料代码</h3>
                <p style="width:450px;">{{ record.materialCode }}</p>
              </template>
              <span>{{ text }}</span>
            </a-popover>
          </div>
        </a-table>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <!-- <CustomerInfo ref="customerInfoCard" /> -->
    <AddForm ref="addForm" @ok="() => searchAction()" />
  </div>
</template>

<script>
import { 
  exWarehouseApplyApproval,
  exWarehouseApplyAddOrUpdate,
  exWarehouseApplyDelete,
  exWarehouseApplyDetail,
  exWarehouseApplyGetMaterial,
  exWarehouseApplyPageList,
  exWarehouseApplyRevocation
  
  } from '@/api/storage_wzz'
import AddForm from './AddForm'

import moment from 'moment'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
// import CustomerSelect from '@/components/CustomerList/CustomerSelect'
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '日期',
    dataIndex: 'exWarehouseDate'
  },
  {
    title: '出库单号',
    dataIndex: 'exWarehouseApplyCode'
  },
  {
    title: '出库类型',
    dataIndex: 'exWarehouseTypeText'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const innerColumns= [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    title: '仓位代码',
    dataIndex: 'positionCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '使用计量单位',
    dataIndex: 'subUnit'
  },
  {
    title: '规格型号',
    dataIndex: 'specification'
  },
  {
    title: '出库数量',
    dataIndex: 'exWarehouseNum',
    scopedSlots: { customRender: 'exWarehouseNum' }
  }
]

export default {
  name: 'stock_management_export_apply',
  components: {
    AddForm,
    ApproveInfo
  },
  data() {
    return {
      activeKey:0,
      columns,
      innerColumns,
      dataSource: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` //分页中显示总的数据
      },
      loading: false,
      searchParam: {
        flag:0
      },
      userInfo: this.$store.getters.userInfo, // 当前登录人
      storageMaterialList: []
    }
  },
  watch: {
    $route: {
      handler: function(to) {
        if (to.name === 'stock_management_export_apply') {
          this.init()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    moment,
    init() {
      let that = this
      that.searchParam = { ...that.searchParam, searchStatus: that.activeKey }
      let queue = []
      let task1 = exWarehouseApplyGetMaterial().then(res => (that.storageMaterialList = res.data))
      queue.push(task1)
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      exWarehouseApplyPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.exWarehouseTypeText = { 1: '基建出库', 2: '研发出库',  }[item.exWarehouseType] || '未知';
            item.statusText = { 1: '待审批', 2: '通过', 3: '不通过', 4: '撤回',5:'完结' }[item.status] || '未知'
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
        .catch(err => (that.loading = false))
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
    doAction(actionType, record) {
      let that = this
      if (['add', 'view', 'edit', 'approval'].includes(actionType)) {
        that.$refs.addForm.query(actionType, record || {})
      } else if (actionType === 'del') {
        exWarehouseApplyDelete({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'withdraw') {
        exWarehouseApplyRevocation({ id: record.id, type: record.storageType })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchParam = { ...this.searchParam, searchStatus: this.activeKey }
      this.searchAction({ current: 1 })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
