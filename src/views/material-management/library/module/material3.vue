<template>
  <div class="wdf-custom-wrapper" id="attendance-abnormal-events">
    <!-- <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-range-picker v-model="sDate" @change="rangePickerChange" style="width: 220px" :allowClear="true" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="选择供应商" v-model="searchParam.supplierId" :allowClear="true" style="width: 160px">
            <a-select-option v-for="item in supplierList" :key="item.id" :value="item.id">{{
              item.scompanyName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="需求单号/采购单号/采购员等模糊查询"
            v-model="searchParam.keyword"
            allowClear
            style="width: 160px"
          />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>
      </a-form>
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
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="urgencyDegree" slot-scope="text, record, index">
          <span>{{ text === 1 ? '一般' : text === 2 ? '加急' : '特级' }}</span>
        </div>
        <div slot="nakedPrice" slot-scope="text, record, index">
          <span>{{ text === 1 ? '含税运' : '含税不含运' }}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template>
            <a type="primary" @click="doAction('view', record)">详情</a>
          </template>
        </div>
      </a-table>
    </div> -->
    <!-- <DoForm ref="doForm" @finish="searchAction({ current: 1 })" /> -->
  </div>
</template>

<script>
import { listManageSupplier } from '@/api/routineMaterial'
import { pageOrderList } from '@/api/supplier'
// import DoForm from './DoForm'

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
    title: '采购单号',
    dataIndex: 'orderNum',
  },
  {
    align: 'center',
    title: '采购需求单号',
    dataIndex: 'requestApplyNum',
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName',
  },
  {
    align: 'center',
    title: '需求类型',
    dataIndex: 'requestTypeText',
  },
  {
    align: 'center',
    title: '紧急程度',
    dataIndex: 'urgencyDegree',
    scopedSlots: { customRender: 'urgencyDegree' },
  },

  {
    align: 'center',
    title: '需求数量',
    dataIndex: 'requestNum',
  },
  {
    align: 'center',
    title: '需求日期',
    dataIndex: 'requestTime',
  },
  {
    align: 'center',
    title: '供应商名称',
    dataIndex: 'supplierName',
  },
  {
    align: 'center',
    title: '抢单报价',
    dataIndex: 'quotationPrice',
  },
  {
    align: 'center',
    title: '采购单价',
    dataIndex: 'orderPrice',
  },
  {
    //meiyou
    align: 'center',
    title: '订单金额',
    dataIndex: 'shelfLife',
  },
  {
    align: 'center',
    title: '预计到货时间',
    dataIndex: 'deliveryDate',
  },
  {
    align: 'center',
    title: '入库状态',
    dataIndex: 'storageStatus',
  },
  {
    align: 'center',
    title: '入库数量',
    dataIndex: 'storageQuantity',
  },
  {
    align: 'center',
    title: '退货数量',
    dataIndex: 'backQuantity',
  },
  {
    align: 'center',
    title: '采购员',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '采购时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'material-rule-management-library-normal-AddForm',
  data() {
    return {
      supplierList: [],
      columns: columns,
      record: {},
      dataSource: [],
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
      searchParam: {},
      sDate: [undefined, undefined],
      activeKey: 0,
      depList: [],
      bindEnterFn: null,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {},
  methods: {
    init(record) {
      let that = this
      let queue = []
      this.record = record
      let task1 = listManageSupplier({ materialId: record.id }).then((res) => (that.supplierList = res.data))
      queue.push(task1)
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign(
        { materialId: this.record.id },
        { ...this.searchParam },
        { ...this.pagination1 },
        opt
      )
      console.log('执行搜索...', _searchParam)
      that.loading = true
      pageOrderList(_searchParam)
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
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    doAction(actionType, record) {
      let that = this
      if (['view', 'add', 'edit'].includes(actionType)) {
        this.$refs.addForm.query(actionType, record)
      } else {
        that.$message.info(`未知指令：${actionType}`)
      }
    },
    rangePickerChange(arrMoment, arrStrs) {
      if (Array.isArray(arrMoment)) {
        if (arrMoment.length === 2) {
          this.searchParam.beginTime = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.endTime = arrMoment[1].format('YYYY-MM-DD')
        } else {
          this.searchParam.beginTime = undefined
          this.searchParam.endTime = undefined
        }
      }
    },
  },
  // methods: {
  //   async query(record) {
  //     this.record = record
  //     getBuyRequirement({ materialId: record.id }).then((res) => (this.Details = res.data))
  //   },
  //   //打开新增设置采购要求
  //   Procurements() {
  //     this.$refs.materFrom.query('add', this.record)
  //   },
  //   //打开变更要求
  //   async Procurement(type) {
  //     await this.$refs.modal.query(type, this.record, null)
  //   },
  //   //打开变更历史
  //   async historys(type) {
  //     await this.$refs.modalList.init(type, this.Details)
  //   },
  // },
}
</script>

<style scoped>
</style>
