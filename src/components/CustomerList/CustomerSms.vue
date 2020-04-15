<template>
  <a-modal title="短信记录" v-model="visible" :width="800" :footer="null" :maskClosable="false">
    <a-table
      :columns="msgColumns"
      rowKey="id"
      :dataSource="msgDataSource"
      :pagination="false"
      :loading="loading"
      size="small"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="userTime" slot-scope="text, record">
        <span>{{ record.userTime }}分钟</span>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import { contractSms} from '@/api/contractListManagement'

const msgColumns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '合同编号',
    dataIndex: 'contractNum',
    key: 'contractNum'
  },
  {
    align: 'center',
    title: '催办人',
    key: 'receiveName',
    dataIndex: 'receiveName'
  },
    {
    align: 'center',
    title: '催办时间',
    key: 'receiveTime',
    dataIndex: 'receiveTime'
  },
    {
    align: 'center',
    title: '解决时间',
    key: 'finishTime',
    dataIndex: 'finishTime'
  },
  {
    align: 'center',
    title: '时长',
    key: 'userTime',
    dataIndex: 'userTime',
    scopedSlots: { customRender: 'userTime' }
  }
]
export default {
  name:'CustomerSms',
  data(){
    return {
      visible:false,
      msgColumns:msgColumns,
      msgDataSource:[],
      loading:false
    }
  },
  methods:{
    //短信弹出层
    init(record){
      this.visible = true
      this.loading = true
      //获取审批预览信息
      contractSms(record.id,record.contractNum)
      .then(res => {
        this.msgDataSource = res.data
      })
      .catch(error => {
        this.$message.info('获取短信记录数据失败')
        this.msgDataSource = []
      })
      .finally(()=>this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>