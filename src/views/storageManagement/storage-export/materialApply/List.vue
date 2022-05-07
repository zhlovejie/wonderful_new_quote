<template>
  <!-- 原料出库申请单 -->
  <div class="wdf-custom-wrapper" id="agency-contract-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select
            placeholder="选择加工商"
            v-model="searchParam.exWarehouseType"
            style="width: 150px"
            :allowClear="true"
          >
            <a-select-option :value="1">加工商A</a-select-option>
            <a-select-option :value="2">加工商B</a-select-option>
          </a-select>
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
          <a-select placeholder="选择加工单号" style="width: 150px" :allowClear="true">
            <a-select-option :value="1">JGD00001</a-select-option>
            <a-select-option :value="2">JGD00002</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input placeholder="委外加工单号/物料名称/出库单号模糊搜索" style="width:300px;" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="出库状态" style="width: 120px" :allowClear="true">
            <a-select-option :value="1">已出库</a-select-option>
            <a-select-option :value="2">未出库</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>

        <!-- <a-form-item style="float:right;">
          <a-button v-if="$auth('exWarehouseApplyList:add')" icon="plus" type="primary" @click="doAction('add',{})"> 新增 </a-button>
        </a-form-item> -->
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="待出库" key="0" />
        <a-tab-pane tab="已出库" key="1" />
      </a-tabs>

      <a-table
        rowKey='id'
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <!-- 操作按钮：查看详情/删除
        查看详情： 各种状态均可查看详情
        删除： 待出库 且 当前登录人为创建人 -->
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" v-if="$auth('exWarehouseApplyList:view')" @click="doAction('view', record)">查看</a>
          <!-- &&+userInfo.id === +record.createdId -->
          <template v-if="[0].includes(+record.status) && $auth('exWarehouseApplyList:delete')">
            <a-divider type="vertical" />
            <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
              <a type="primary" href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </div>
        <!-- 原料出库产品表  开始 -->
        <a-table
          slot="expandedRowRender"
          slot-scope="record"
          :columns="innerColumns"
          :dataSource="record.exWarehouseMaterialList"
          :pagination="false"
          size="small"
        >
          <div slot="order" slot-scope="text, record, index">
            {{ index + 1 }}
          </div>
          <!-- 属性（1原材料 2模具） -->
          <div slot="attribute" slot-scope="text">
            {{ text == 1 ? '原材料' : '模具' }}
          </div>
          <!-- 原料送取(1:委托方送货,2:加工商提货)） -->
          <div slot="provider" slot-scope="text">
            {{ text == 1 ? '委托方送货' : '加工商提货' }}
          </div>
        </a-table>
        <!-- 内部表格  结束 -->
      </a-table>
    </div>
    <!-- <ApproveInfo ref="approveInfoCard" /> -->
    <!-- <CustomerInfo ref="customerInfoCard" /> -->
    <AddForm ref="addForm" @ok="() => searchAction()" />
  </div>
</template>

<script>
import { materialOutPageList, materialOutDelete} from '@/api/material'

import {
  exWarehouseApplyGetMaterial //获取物料信息
} from '@/api/storage_wzz'

import AddForm from './AddForm'
// import {
//   exWarehouseApplyApproval,
//   exWarehouseApplyAddOrUpdate,
//   exWarehouseApplyDelete,
//   exWarehouseApplyDetail,
//   exWarehouseApplyGetMaterial,
//   exWarehouseApplyPageList,
//   exWarehouseApplyRevocation
//   } from '@/api/storage_wzz'


import moment from 'moment'
// import ApproveInfo from '@/components/CustomerList/ApproveInfo'
// import CustomerSelect from '@/components/CustomerList/CustomerSelect'
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '出库单号',
    dataIndex: 'exWarehouseNo'
  },
  {
    title: '委外加工单号',
    dataIndex: 'orderNo'
  },
  {
    title: '加工商名称',
    dataIndex: 'facName'
  },
  {
    title: '出库状态',
    dataIndex: 'statusText'
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

const innerColumns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '属性',
    dataIndex: 'attribute', //属性（1原材料 2模具）
    scopedSlots: { customRender: 'attribute' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '规格型号',
    dataIndex: 'specification'
  },
  {
    title: '使用计量单位',
    dataIndex: 'subUnit'
  },
  {
    title: '待出库数量',
    dataIndex: 'exWarehouseNum'
  },
  {
    title: '原料送取',
    dataIndex: 'provider', //原料送取(1:委托方送货,2:加工商提货)
    scopedSlots: { customRender: 'provider' }
  },
  {
    title: '实际出库数量',
    dataIndex: 'realityExWarehouseNum'
  }
]

export default {
  name: 'stock_management_export_apply',
  components: {
    AddForm,
    // ApproveInfo
  },
  data() {
    return {
      activeKey: 0,
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
        flag: 0
      },
      userInfo: this.$store.getters.userInfo, // 当前登录人
      storageMaterialList: []
    }
  },
  watch: {
    $route: {
      handler: function(to) {
        if (to.name === 'stock_management_material_apply') {
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
      materialOutPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            // 单据状态（0 待出库 1已出库）
            item.statusText = { 0: '待出库', 1: '已出库' }[item.status] || '未知'
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
        if (actionType == 'view') {
          that.$refs.addForm.query(actionType, record || {})
        } else if (actionType === 'del') {
          materialOutDelete({ id: record.id })
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
