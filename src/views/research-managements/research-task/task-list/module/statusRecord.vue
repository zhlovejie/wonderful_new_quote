<template>
  <a-modal title="状态" v-model="visible" :width="800" :footer="null" :maskClosable="false">
    <a-table :columns="priewColumns" rowKey="id" :dataSource="priewData" :pagination="false" :loading="loading">
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="operationType" slot-scope="text, record, index">
        <span>{{ getStateText(text) }}</span>
      </div>
    </a-table>
  </a-modal>
</template>
<script>
// import { getApprovedNodeList } from '@/api/contractListManagement'

import { task_listDevelopmentTaskHisById } from '@/api/researchManagement'
const priewColumns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '操作',
    dataIndex: 'operationType',
    key: 'operationType',
    scopedSlots: { customRender: 'operationType' },
  },
  {
    align: 'center',
    title: '倒计时(h)',
    key: 'countdownTime',
    dataIndex: 'countdownTime',
  },
  {
    align: 'center',
    title: '原因',
    key: 'reason',
    dataIndex: 'reason',
  },
  {
    align: 'center',
    title: '操作人',
    key: 'createdName',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '操作时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
  },
]

export default {
  name: 'statusRecord',
  data() {
    return {
      visible: false,
      loading: false,
      priewColumns: priewColumns,
      priewData: [],
      countdown: null,
    }
  },
  methods: {
    init(instanceId) {
      this.priewData = []
      this.visible = true
      this.loading = true
      // 获取审批预览信息
      task_listDevelopmentTaskHisById({ id: instanceId })
        .then((res) => {
          this.priewData = res.data.map((item) => {
            if (item.countdownTime) {
              let react = item.countdownTime.toString()
              let arr = react.split('.')
              let str = '0.' + arr[1]
              this.countdown = arr[0] + '小时' + parseInt(str * 60) + '分钟'
            } else {
              this.countdown = null
            }
            return {
              countdownTime: this.countdown,
              operationType: item.operationType,
              reason: item.reason,
              createdName: item.createdName,
              createdTime: item.createdTime,
            }
          })
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    getStateText(state) {
      let stateMap = {
        0: '派工',
        1: '认领',
        2: '暂停',
        3: '启动',
        4: '完结',
        5: '放弃',
        6: '驳回',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    setModel(type = 'show') {
      this.visible = String(type) === 'show' ? true : false
    },
  },
}
</script>
<style scoped>
</style>