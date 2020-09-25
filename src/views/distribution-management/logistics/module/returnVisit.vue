<template>
  <a-modal title="回访记录" v-model="visible" :width="1050" :footer="null" :maskClosable="false">
    <a-table
      :columns="priewColumns"
      rowKey="id"
      :dataSource="priewData"
      :pagination="false"
      :loading="loading"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="status" slot-scope="text">
        <span v-if="text===1">正常</span>
        <span v-else>异常</span>
      </div>
    </a-table>
  </a-modal>
</template>
<script>
// import { getApprovedNodeList } from '@/api/contractListManagement'

// import {findApprovedNodeList} from '@/api/common'
import { returnVisit } from '@/api/distribution-management'
const priewColumns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '回访人',
    dataIndex: 'revisiterId',
    key: 'revisiterId',
  },
  {
    align: 'center',
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '开始时间',
    key: 'startTime',
    dataIndex: 'startTime',
  },
  {
    align: 'center',
    title: '结束时间',
    key: 'endTime',
    dataIndex: 'endTime',
  },
  {
    align: 'center',
    title: '通话时长',
    key: 'talkTime',
    dataIndex: 'talkTime',
  },
  {
    align: 'center',
    title: '备注',
    key: 'remarks',
    dataIndex: 'remarks',
  },
]

export default {
  name: 'ApproveInfo',
  data() {
    return {
      visible: false,
      loading: false,
      priewColumns: priewColumns,
      priewData: [],
    }
  },
  methods: {
    init(instanceId) {
      this.priewData = []
      if (instanceId === undefined) return
      this.visible = true
      this.loading = true
      // 获取审批预览信息
      returnVisit({ logisticsInformationId: instanceId })
        .then((res) => {
          console.log(res)
          this.priewData = res.data
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    setModel(type = 'show') {
      this.visible = String(type) === 'show' ? true : false
    },
  },
}
</script>
<style scoped>
</style>