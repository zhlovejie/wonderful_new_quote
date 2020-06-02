<template>
  <a-modal
    title="客户变更记录"
    :width="1200"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleCancel"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-table
      ref="table"
      :columns="columns"
      :dataSource="records"
      :pagination="false"
      rowKey="id"
    >
      <span slot="source" slot-scope="text">
        {{getSourceTxt(text)}}
      </span>
      <span slot="pool" slot-scope="text">
        <span v-if="text == 1">公共客户池</span>
        <span v-if="text == 2">部门客户池</span>
        <span v-if="text == 3">待分配客户池</span>
        <span v-if="text == 4">分配中</span>
      </span>
      <span slot="reason" slot-scope="record">
        <div v-if="record.source === 8" style="width:200px;white-space: normal;word-break: break-all;">
          原因：{{ record.reason }}。详情：{{ record.content }}
        </div>
      </span>
    </a-table>
  </a-modal>
</template>

<script>

export default {
  name: 'CustomerChangeRecord',
  data () {
    return {
      visible: false, // 表单对话框是否可见
      records: [], // 所有变更记录
      columns: [
        {
          title: '变更来源',
          dataIndex: 'source',
          scopedSlots: { customRender: 'source' }
        },
        {
          title: '放弃原因',
          scopedSlots: { customRender: 'reason' },
          width:200
        },
        {
          title: '变更时间',
          dataIndex: 'changeTime'
        },
        {
          title: '上一客户池',
          dataIndex: 'beforePool',
          scopedSlots: { customRender: 'pool' }
        },
        {
          title: '当前客户池',
          dataIndex: 'nowPool',
          scopedSlots: { customRender: 'pool' }
        },
        {
          title: '上一归属人',
          dataIndex: 'beforeUser'
        },
        {
          title: '当前归属人',
          dataIndex: 'nowUser'
        },
        {
          title: '操作人',
          dataIndex: 'createUser'
        }
      ]
    }
  },
  methods: {
    show (records) { // 父页面点击
      this.visible = true
      this.records = records
    },
    handleCancel () { // 关闭
      this.visible = false
    },
    getSourceTxt(source){
      let m = {
        1:'人工分配',
        2:'初次未联系',
        3:'提取',
        4:'未维护',
        5:'申请',
        6:'部门独立来源',
        7:'自动分配',
        8:'放弃',
        9:'直接录入',
        10:'未完善信息',
        11:'客服再分配',
        12:'被释放'
      }
      return m[source] || '未知'
    }
  }
}
</script>
