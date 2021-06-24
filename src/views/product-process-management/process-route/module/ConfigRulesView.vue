<template>
  <div>
    <a-table :columns="columns" :data-source="dataSource" :alert="false" size="small">
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="action" slot-scope="text, record">
        <template>
          <a @click="delSee(record.fileUrl)">查看</a>
        </template>
      </div>
    </a-table>
    <XdocView ref="xdocView" />
  </div>
</template>
<script>
import { pageDevesaveCraftDev } from '@/api/ProcessManagement'
import XdocView from './XdocView'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '文件名称',
    dataIndex: 'fileName',
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '修改人',
    dataIndex: 'modifierName',
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'modifyTime',
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  },
]

export default {
  components:{XdocView},
  data() {
    return {
      columns: columns,
      dataSource: []
    }
  },
  methods:{
    query(id){
      const that = this
      pageDevesaveCraftDev({ id }).then((res) => {
        that.dataSource = res.data.equipmentOperations
      })
    },
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    }
  }
}
</script>
