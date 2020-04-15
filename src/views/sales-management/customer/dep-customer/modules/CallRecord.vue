<template>
  <a-modal
    title="客户详情"
    :width="940"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleCancel"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
      <template slot="content" slot-scope="text">
        <div style="width:200px;white-space: normal;word-break: break-all;">{{text}}</div>
      </template>
    </s-table>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { callRecordList } from '@/api/customer'
export default {
  name: 'CallRecord',
  components: { // 组件
    STable
  },
  data () {
    return {
      visible: false, // 是否显示
      columns: [
        {
          title: '接电话人',
          dataIndex: 'connectionName'
        },
        {
          title: '开始时间',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
          dataIndex: 'endTime'
        },
        {
          title: '通话时长（秒）',
          dataIndex: 'talkTime'
        },
        {
          title: '通话内容',
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' },
          width:200
        },
        {
          title: '拨号人',
          dataIndex: 'createName'
        }
      ],
      param: {},
      loadData: parameter => {
        return callRecordList(Object.assign(parameter, this.param))
          .then(res => {
            if (res.code === 200) {
              return res
            } else {
              console.log(res.msg)
            }
          })
      }
    }
  },
  methods: {
    show (customerId) {
      this.visible = true
      this.param.customerId = customerId
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
