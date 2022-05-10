<template>
  <!-- 出库单 -->
  <div class="wdf-custom-wrapper" id="stock_management_export_record">
    <a-tabs :activeKey="activeKey" @change="handlerTabChange">
       <a-tab-pane v-for="tab in tabList" :key="tab.key" :tab="tab.label" />
     </a-tabs>
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="出库类型" v-model="searchParam.exWarehouseType" style="width: 150px" :allowClear="true">
            <a-select-option :value="1">基建出库</a-select-option>
            <a-select-option :value="2">研发出库</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-input placeholder="单号模糊搜索" v-model="searchParam.exWarehouseCode" style="width:180px;" />
        </a-form-item>

        <!-- <a-form-item>
          <a-select placeholder="紧急程度" v-model="searchParam.urgentType" style="width: 150px" :allowClear="true">
            <a-select-option :value="1">一般</a-select-option>
            <a-select-option :value="2">紧急</a-select-option>
            <a-select-option :value="3">特急</a-select-option>
          </a-select>
        </a-form-item> -->

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
          <a-range-picker style="width:220px;" v-model="searchParam.date" />
        </a-form-item>
        
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <h3 v-if="+activeKey === 0">
      未出库单据：{{countInfo.singleNum || 0}} &nbsp;&nbsp;未出库数：{{countInfo.notNum || 0}}
    </h3>
    <h3 v-if="+activeKey === 1">
      已出库单据：{{countInfo.singleNum || 0}}
    </h3>
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

        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- { 1: '待审批', 2: '通过', 3: '不通过', 4: '撤回' } -->
          <template v-if="+activeKey === 0">
            <a type="primary" @click="doAction('chuku', record)">出库</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('record', record)">出库记录</a>
          </template>
          <template v-if="+activeKey === 1">
            <a type="primary" @click="doAction('view', record)">详情</a>
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
    <Records ref="records" />
  </div>
</template>

<script>
import { 
  getWarehouseList,
  exWarehouseDetail,
  exWarehouseGetMaterial,
  exWarehousePageList,
  exWarehouseRecords,
  exWarehouseStatistics,
  exWarehouseUpdate
} from '@/api/storage_wzz'
import AddForm from './AddForm'
import Records from './Records'
import moment from 'moment'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'


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
    title: '实际出库数量',
    dataIndex: 'exWarehouseNum',
    scopedSlots: { customRender: 'exWarehouseNum' }
  }
]

export default {
  name: 'stock_management_export_record',
  components: {
    AddForm,
    ApproveInfo,
    Records
  },
  data() {
    return {
      activeKey:0,
      tabList:[
        {
          key:0,
          label:'待出库'
        },
        {
          key:1,
          label:'已出库'
        },
      ],
      innerColumns,
      dataSource: [],
      countInfo:{},
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
        type:0
      },
      userInfo: this.$store.getters.userInfo, // 当前登录人
      storageMaterialList: [],
      warehouseList:[],
    }
  },
  computed:{
    columns(){
      let  base_columns = [
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
          dataIndex: 'exWarehouseCode'
        },
        {
          title: '出库类型',
          dataIndex: 'exWarehouseTypeText'
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

      if(+this.activeKey === 0){
        base_columns.splice(1,1)
      }
      return base_columns
    }
  },
  watch: {
    $route: {
      handler: function(to) {
        if (to.name === 'stock_management_export_record') {
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
    handlerTabChange(key){
      this.activeKey = key
      this.searchParam = {
        ...this.searchParam,
        type:this.activeKey
      }
      this.searchAction()
    },
    init() {
      let that = this
      that.searchParam = { ...that.searchParam, searchStatus: that.activeKey }
      let queue = []
      let task1 = exWarehouseGetMaterial().then(res => (that.storageMaterialList = res.data))
      queue.push(task1)
      let task2 = getWarehouseList().then(res => (this.warehouseList = res.data))
      queue.push(task2)
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const date = that.searchParam.date
      if(Array.isArray(date) && date.length === 2){
        that.searchParam = {
          ...that.searchParam,
          startDate:date[0].format('YYYY-MM-DD'),
          endDate:date[1].format('YYYY-MM-DD')
        }
      }else{
        that.searchParam = {
          ...that.searchParam,
          startDate:undefined,
          endDate:undefined
        }
      }

      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      exWarehousePageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.exWarehouseTypeText = { 1: '基建出库', 2: '研发出库' }[item.exWarehouseType] || '未知'
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
      exWarehouseStatistics({type:that.activeKey}).then(res => {
        const {alreadyNum,notNum,singleNum} = res.data
        that.countInfo = {
          alreadyNum,notNum,singleNum
        }
      })
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
      if(actionType === 'chuku'){
        that.$refs.addForm.query('edit', record)
        return
      }else if(actionType === 'view'){
        that.$refs.addForm.query('view', record)
        return
      }else if(actionType === 'record'){
        that.$refs.records.query('record', record)
        return
      }
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
