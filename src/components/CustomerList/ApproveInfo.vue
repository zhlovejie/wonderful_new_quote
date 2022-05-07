<template>
  <a-modal title="审批预览" v-model="visible" :width="650" :footer="null" :maskClosable="false">
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
    </a-table>
  </a-modal>
</template>
<script>

// import { getApprovedNodeList } from '@/api/contractListManagement'

import {
  findApprovedNodeList,
  findApprovedNodeListByMaterial,
  findApprovedNodeListdep
} from '@/api/common'
const priewColumns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '审核人',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    align: 'center',
    title: '审核时间',
    key: 'createTime',
    dataIndex: 'createTime'
  },
  {
    align: 'center',
    title: '备注',
    key: 'code',
    dataIndex: 'code'
  }
]

export default {
  name:'ApproveInfo',
  data(){
    return {
      visible:false,
      loading:false,
      priewColumns:priewColumns,
      priewData:[]
    }
  },
  methods:{
    init (instanceId,type='normal') {
      const __api = {
        'normal':findApprovedNodeList,
        'material':findApprovedNodeListByMaterial,
        'dep':findApprovedNodeListdep
      }

      this.priewData = []
      if(instanceId === undefined) return
      this.visible = true
      this.loading = true
      // 获取审批预览信息
      __api[type]({instanceId: instanceId})
      .then(res => {
        this.priewData = res.data
        this.loading = false
      })
      .catch(error => {
        this.loading = false
        console.error(error)
      })
    },
    setModel(type='show'){
      this.visible = String(type) === 'show' ? true : false
    }
  }
}
</script>
<style scoped>

</style>