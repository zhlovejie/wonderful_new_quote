<template>
  <div class="wdf-custom-wrapper" id="attendance-abnormal-events">
    <div class="search-wrapper">
      <template v-if="$auth('supplier:add')">
        <!-- <a-dropdown style="float: right">
          <a-button type="primary" @click="doAction('add', null)"> <a-icon type="plus" />新增 </a-button>
        </a-dropdown> -->
      </template>
    </div>
    <div class="main-wrapper">
      <a-table
        v-if="$auth('supplier:lists')"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="supplierScale" slot-scope="text, record, index">
          <span v-if="text === 0">小规模</span>
          <span v-if="text === 1">一般规模 </span>
        </div>
        <!-- <div slot="status" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div> -->
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="$auth('supplier:view')">
            <!-- <a type="primary" @click="doAction('view', record)">查看</a>
              <a-divider type="vertical" /> -->
            <a type="primary" @click="process(record)">详情</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>

<script>
import { materialSuplierEnable } from '@/api/supplier'
import AddForm from '../../../supplier/modules/Formadd'
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
    title: '供应商名称',
    dataIndex: 'scompanyName',
    key: 'scompanyName',
  },
  {
    align: 'center',
    title: '供应商编码',
    dataIndex: 'gysCode',
    key: 'gysCode',
  },
  {
    align: 'center',
    title: '规模',
    dataIndex: 'supplierScale',
    key: 'supplierScale',
    scopedSlots: { customRender: 'supplierScale' },
  },
  {
    align: 'center',
    title: '成立年限',
    dataIndex: 'establishYear',
    key: 'establishYear',
  },
  {
    align: 'center',
    title: '诚信级别',
    key: 'sincerityLevel',
    dataIndex: 'sincerityLevel',
  },
  {
    align: 'center',
    title: '业务员',
    key: 'salesmanName',
    dataIndex: 'salesmanName',
  },
  {
    align: 'center',
    title: '业务员电话',
    dataIndex: 'salesmanPhone',
    key: 'salesmanPhone',
  },
  {
    align: 'center',
    title: '创建人',
    dataIndex: 'createdName',
    key: 'createdName',
  },
  {
    align: 'center',
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
  },
  // {
  //   align: 'center',
  //   title: '状态',
  //   key: 'status',
  //   dataIndex: 'status',
  //   scopedSlots: { customRender: 'status' },
  // },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'material-rule-management-library-normal-AddForm',
  components: {
    AddForm: AddForm,
  },
  data() {
    return {
      supplierList: [],
      columns: columns,
      record: {},
      dataSource: [],
      pagination1: { current: 1 },
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
  methods: {
    process(record) {
      this.$router.push({
        name: 'Supplierdetails',
        params: { record: record, id: record.id },
      })
    },
    init(record) {
      let that = this
      let queue = []
      this.record = record
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
      materialSuplierEnable(_searchParam)
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
    doAction(type, record) {
      let that = this
      that.$refs.addForm.query(type, record)
      //this.$message.info('功能尚未实现...')
    },
    // doAction(actionType, record) {
    //   let that = this
    //   if (['view', 'add', 'edit'].includes(actionType)) {
    //     this.$refs.addForm.query(actionType, record)
    //   } else {
    //     that.$message.info(`未知指令：${actionType}`)
    //   }
    // },
  },
}
</script>

<style scoped>
</style>
