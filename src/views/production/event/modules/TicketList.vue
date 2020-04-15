<template>
  <a-modal
    title="罚款单列表"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleCancel"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-table :columns="columns" rowKey="id" :dataSource="ticketList" :pagination="false">
      <span slot="ticketUrl" slot-scope="text">
        <a :href="text" target="blank">详情</a>
      </span>
    </a-table>
  </a-modal>
</template>

<script>
import { ticketListByEvent } from '@/api/production/event'
export default {
  name: 'TicketList', // 质量主管处罚或者董事长结案展示页
  data () {
    return {
      // 表头
      columns: [
        {
          title: '罚单编号',
          width: '200px',
          align: 'center',
          dataIndex: 'serialNum'
        },
        {
          title: '被罚人',
          width: '100px',
          align: 'center',
          dataIndex: 'userName'
        },
        {
          title: '创建时间',
          width: '100px',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          width: '150px',
          align: 'center',
          dataIndex: 'ticketUrl',
          scopedSlots: { customRender: 'ticketUrl' }
        }
      ],
      visible: false, // 是否显示
      ticketList: [], // 负责人信息
      title: '',
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
      },
      singleLabel: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
      },
      singleWrapper: {
        xs: { span: 20 },
        sm: { span: 20 }
      },
      threeLabel: {
        xs: { span: 5 },
        sm: { span: 5 }
      },
      threeWrapper: {
        xs: { span: 15 },
        sm: { span: 15 }
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show (eventId) {
      ticketListByEvent({ eventId: eventId }).then(res => {
        if (res.code === 200) {
          this.ticketList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      this.visible = true
    },
    handleCancel () {
      this.event = {}
      this.form.resetFields() // 清空表
      this.visible = false
    }
  }
}
</script>
