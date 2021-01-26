<template>
  <a-modal title="选择标的" :width="450" :footer="null" v-model="visible" :maskClosable="false">
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      size="small"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <span slot="targetName" slot-scope="text, record">
        <a href="javascript:void(0);" @click="select(record)">{{ record.text }}</a>
      </span>
      <div slot="tax" slot-scope="text">
        <span>{{ text }}%</span>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import { getTarget } from '@/api/contractListManagement'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '标的名称',
    dataIndex: 'targetName',
    scopedSlots: { customRender: 'targetName' }
  },
  {
    title: '税率',
    dataIndex: 'tax',
    scopedSlots: { customRender: 'tax' }
  }
]
export default {
  name: 'TargetidModel',
  data() {
    return {
      visible: false,
      loading: false,
      columns: columns,
      dataSource: [],
      inputObject:null //传入的数据，不做处理，再返回出去
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {},
    query(record) {
      const that = this
      that.visible = true
      that.loading = true
      that.inputObject = null
      if(record){
        that.inputObject = record
      }
      getTarget().then(res => {
        that.loading = false
        that.dataSource = res.data
      }).catch(err =>that.loading = false)
    },
    close() {
      this.visible = false
    },
    select(record) {
      this.$emit('select', { selectItem: record ,inputObject:this.inputObject})
      this.close()
    }
  }
}
</script>

