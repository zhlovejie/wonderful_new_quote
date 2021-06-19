<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    :footer="null"
  >
    <div style="overflow:hidden;">
        <a-button style="float:right;" type="primary" @click="doAction('export')">导出</a-button>
      </div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="spinning"
    >
      <div
        slot="modelType"
        slot-scope="text, record, index"
      >
        <a-tooltip>
          <template slot="title">
            {{text}}
          </template>
          <span class="icon-required">查看</span>
          <a-icon
            type="question-circle"
            style="margin-left:5px;color:#1890ff;"
          />
        </a-tooltip>
      </div>
      <div
        slot="materialUnit"
        slot-scope="text, record, index"
      >
        {{ {1:'支',2:'把',3:'件'}[text] }}
      </div>
    </a-table>
  </a-modal>
</template>
<script>
import { leafNodeCompareById ,bomExport} from '@/api/bomManagement'
let uuid = () => Math.random().toString(16).slice(-8);
const columns = [
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'modelType',
    scopedSlots: { customRender: 'modelType' }
  },
  {
    align: 'center',
    title: '计量单位',
    dataIndex: 'materialUnit',
    scopedSlots: { customRender: 'materialUnit' }
  },
  {
    align: 'center',
    title: '单价',
    dataIndex: 'unitPrice'
  },
  {
    align: 'center',
    title: '用量',
    dataIndex: 'beforeNum',
    width:200
  },
  {
    align: 'center',
    title: '用量',
    dataIndex: 'afterNum',
    width:200
  }
]
export default {
  name: 'diffForm',
  components: {},
  data() {
    return {
      modalTitle: '差异分析',
      visible: false,
      spinning: false,
      columns,
      dataSource: [],
      params:{}
    }
  },
  methods: {
    query(list) {
      const that = this
      that.visible = true
      const [beforeNode, afterNode] = list

      let columns = [...that.columns]
      let column_before = columns.find(item => item.dataIndex === 'beforeNum')
      let column_after = columns.find(item => item.dataIndex === 'afterNum')
      column_before.title = `${beforeNode.title}用量`
      column_after.title = `${afterNode.title}用量`
      that.columns = columns

      that.$nextTick(() => {
        that.params = { beforeId: beforeNode.key, afterId: afterNode.key }
        that.spinning = true
        leafNodeCompareById(that.params)
          .then(res => {
            that.spinning = false
            that.dataSource = res.data.map(item => {
              item.key = uuid()
              return item
            })
          })
          .catch(err => {
            that.spinning = false
            console.error(err)
          })
      })
    },
    handleCancel() {
      this.visible = false
    },
    doAction(type){
      const that = this
      let {beforeId,afterId} = that.params
      if(type === 'export'){
        bomExport(1,`beforeId=${beforeId}&afterId=${afterId}`)
      }
    }
  }
}
</script>
<style scoped>
</style>

