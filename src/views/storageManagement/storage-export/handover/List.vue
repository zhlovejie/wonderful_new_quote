<template>
  <!-- 交接单 -->
  <div class="wdf-custom-wrapper" id="agency-contract-wrapper">
    <!-- 筛选-开始 -->
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            read-only="read-only"
            @click="openFacOrderModel(1)"
            placeholder="请选择加工商"
            :value="searchParam.facName"
          />
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
          <a-input
            read-only="read-only"
            @click="openFacOrderModel(2)"
            placeholder="请选择加工单号"
            :value="searchParam.orderNo"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="委外加工单号/物料名称/出库单号模糊搜索"
            v-model="searchParam.parameter"
            :allowClear="true"
            style="width:300px;"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="text" @click="onClean" style="margin-right:10px;">清除</a-button>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- 筛选-结束 -->
    <div class="main-wrapper">
      <a-table
        rowKey="id"
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
        查看详情：各种状态均可查看详情
        删除：待出库 且 当前登录人为创建人 -->
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit', record)">测试编辑</a>
          <template v-if="[0].includes(+record.status) && +userInfo.id === +record.createdId">
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
        </a-table>
        <!-- 原料出库产品表  结束 -->
      </a-table>
    </div>
    <AddForm ref="addForm" @ok="() => searchAction()" />
    <FacAndOrderSelect ref="facAndOrderSelect" @change="onFacOrderChange" />
  </div>
</template>

<script>
import {
  materialHandoverPageList, //交接单-列表
  materialHandoverDelete //交接单-删除
} from '@/api/material'
import {
  exWarehouseApplyGetMaterial //条件检索-物料列表
} from '@/api/storage_wzz'
import AddForm from './AddForm'
import FacAndOrderSelect from '../materialApply/FacAndOrderSelect'

const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '交接单号',
    dataIndex: 'handNoteNo'
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
    title: '原料送取',
    dataIndex: 'sendTypeText' //原料送取(1:委托方送货,2:加工商提货)
  },
  {
    title: '接货人',
    dataIndex: 'handUserName'
  },
  {
    title: '接货人手机号',
    dataIndex: 'handUserTel'
  },
  {
    title: '交接人',
    dataIndex: 'createdName'
  },
  {
    title: '交接时间',
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
    title: '交接数量',
    dataIndex: 'exWarehouseNum'
  }
]

export default {
  name: 'Stock_management_export_handover',
  components: {
    AddForm,
    FacAndOrderSelect
  },
  data() {
    return {
      columns,
      innerColumns,
      dataSource: [], //交接单列表
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
        facId: undefined, //加工商id
        materialId: undefined, //物料id
        orderId: undefined, //委外加工单id
        parameter: '' //模糊检索关键词
      },
      userInfo: this.$store.getters.userInfo, //当前登录人
      storageMaterialList: [] //物料列表
    }
  },
  watch: {
    $route: {
      handler: function(to) {
        if (to.name === 'stock_management_export_handover') {
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
    // 查询-交接单列表
    searchAction(opt = {}) {
      let that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      this.loading = true
      materialHandoverPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.sendTypeText = item.sendType == 1 ? '委托方送货' : '加工商提货'
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
      let that = this
      if (actionType === 'del') {
        materialHandoverDelete({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      } else {
        that.$refs.addForm.query(actionType, record || {})
      }
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
