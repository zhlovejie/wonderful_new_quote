<template>
  <a-modal
    title="工序列表"
    :width="540"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleCancel"
    :maskClosable="false"
  >
    <a-table
      ref="table"
      :columns="columns"
      :dataSource="process"
      :pagination="false"
      size="small"
      rowKey="cpId"
    >
    </a-table>
  </a-modal>
</template>

<script>
export default {
  name: 'CodeProcessView',
  data () {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'serialNum'
        },
        {
          title: '工序名',
          dataIndex: 'processName'
        }
      ],
      process: [],
      visible: false
    }
  },
  methods: {
    show (record) {
      this.visible = true
      this.process = record
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
