<template>
  <a-modal
    title="变更记录"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <div slot="serviceType" slot-scope="text">
        {{ {'1':'上班缺卡','2':'下班缺卡','3':'迟到','4':'早退','5':'加班','6':'请假'}[text] }}
      </div>
      <div slot="newHours" slot-scope="text,record">
        {{{'1':'修改时长','2':'标记正常'}[record.modifyType] +' (原时长)'+record.oldHours+'h -> (修改后时长)'+record.newHours+'h'}}
      </div>
    </a-table>
  </a-modal>
</template>
<script>
import {attenceMonthStatiticsChangeUpdateList} from '@/api/attendanceManagement'
const columns = [
  {
    title: '状态',
    dataIndex:'serviceType',
    scopedSlots: { customRender: 'serviceType' }
  },
  {
    title: '时长',
    dataIndex:'newHours',
    scopedSlots: { customRender: 'newHours' }
  },
  {
    title: '原因',
    dataIndex:'modifyReason'
  },
  {
    title: '变更人',
    dataIndex:'createdUserName'
  },
  {
    title: '变更时间',
    dataIndex:'createdTime'
  },
]
export default {
  name:'record-form',
  data(){
    return {
      visible:false,
      record:{},
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
    }
  },
  methods:{
    query(record){
      let that = this
      that.visible = true
      that.record = record || {}
      that.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      that.loading = true
      attenceMonthStatiticsChangeUpdateList({ statiticsId:that.record.id })
        .then(res => {
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
    handleOk(){
      this.handleCancel()
    },
    handleCancel(){
      this.visible = false
      this.$emit('finish')
    },
  }
}
</script>
<style scoped>

</style>