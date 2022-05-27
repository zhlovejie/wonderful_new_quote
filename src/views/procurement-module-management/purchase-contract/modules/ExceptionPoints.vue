<template>
  <a-modal
    :title="modalTitle"
    :width="980"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
    size="small"
  >
    <a-table :columns="columns" :dataSource="dataSource" :pagination="false" :loading="loading">
      <div slot="order" slot-scope="text, record, index">
        {{ index + 1 }}
      </div>
      <div slot="abnormalInfo" slot-scope="text, record, index">
        <div v-html="text"></div>
      </div>
    </a-table>
  </a-modal>
</template>
<script>
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 80
  },
  {
    title: '异常类型',
    dataIndex: 'abnormalType'
  },
  {
    title: '异常详情',
    dataIndex: 'abnormalInfo',
    scopedSlots: { customRender: 'abnormalInfo' }
  },
  {
    title: '变更原因',
    dataIndex: 'changeReason'
  }
]
export default {
  name: 'AddForm',
  data() {
    return {
      modalTitle: '异常原因',
      visible: false,
      loading: false,
      columns,
      dataSource: []
    }
  },
  methods: {
    async query(dataSource) {
      let that = this
      that.visible = true
      that.dataSource = []
      that.loading = true
      setTimeout(function() {
        that.loading = false
        that.dataSource = dataSource
      }, 300)
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    }
  }
}
</script>
<style scoped></style>
