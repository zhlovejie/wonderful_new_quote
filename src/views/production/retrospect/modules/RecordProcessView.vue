<template>
  <a-modal
    title="工序列表"
    :width="940"
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
      rowKey="ppId"
    >
    </a-table>
  </a-modal>
</template>

<script>
export default {
  name: 'RecordProcessView',
  data () {
    return {
      columns: [
        {
          title: '序号',
          width: '50px',
          dataIndex: 'serialNum'
        },
        {
          title: '工序名',
          dataIndex: 'processName'
        },
        {
          title: '操作人和时间',
          dataIndex: 'userNames'
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
