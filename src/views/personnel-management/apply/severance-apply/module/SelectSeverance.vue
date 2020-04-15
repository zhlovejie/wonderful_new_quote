<template>
  <!-- 离职协议 -->
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :footer="null" 
    :maskClosable="false"
  >
    <div class="severance-agreement-list-wrapper">
      <div class="search-wrapper">
        <a-input placeholder="责任人模糊查询" v-model="user_name" style="width: 180px"></a-input>
        <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
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

          <div slot="userName" slot-scope="text, record, index">
            <a href="javascript:void(0);" @click="selectedAction(record)">{{text}}</a>
          </div>

        </a-table>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { personnelLeaveOfficeAgreementPageList } from '@/api/personnelManagement'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '编号',
    dataIndex: 'leaveOfficeCode',
    key: 'leaveOfficeCode'
  },
  {
    align: 'center',
    title: '责任人',
    dataIndex: 'userName',
    key: 'userName',
    scopedSlots: { customRender: 'userName' }
  },
  {
    align: 'center',
    title: '提交时间',
    key: 'createdTime',
    dataIndex: 'createdTime'
  }
]

export default {
  name: 'SeveranceAgreement',
  components: {},
  data() {
    return {
      user_name: undefined,
      activeKey: 3,
      columns: columns,
      dataSource: [],
      pagination: {
        current:1
      },
      loading: false,
      modalTitle:'',
      visible:false,
      decoratorKey:''
    }
  },
  computed: {
    searchParam() {
      return {
        userName: this.user_name
      }
    }
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign(
        {},
        { ...this.searchParam },
        { ...this.pagination },
        opt || {},
        { approveStatus: that.activeKey }
      )
      console.log('执行搜索...', _searchParam)
      that.loading = true
      personnelLeaveOfficeAgreementPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    getStatusText(state) {
      let stateMap = {
        0: '待审批',
        1: '通过',
        2: '不通过'
      }
      return stateMap[state] || `未知状态:${state}`
    },
    handleCancel() {
      this.visible = false
    },
    handleOk(){
      this.handleCancel()
    },
    selectedAction(record){
      this.visible = false 
      this.$emit('selectedAction',{decoratorKey:this.decoratorKey,record:record})
    },
    query(decoratorKey){
      this.decoratorKey = decoratorKey
      this.visible = true
      this.$nextTick(() =>this.init())
    },
  }
}
</script>
<style scoped>
.severance-agreement-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.severance-agreement-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>