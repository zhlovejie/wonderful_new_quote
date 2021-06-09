<template>
  <div>
    <div class="description-document-search-wrapper" style="margin-top: 20px">
      <a-form layout="inline">
        <a-form-item>
          <h3>保养操作规程</h3>
        </a-form-item>
        <div class="action-wrapper" style="float: right;margin-bottom：10px ;">
          <a-form-item>
            <template v-if="types !== 'view'">
              <!-- : 1、设备操作规程 2、保养操作规程 3、耗材 -->
              <a-button type="primary" icon="plus" @click="handleAction('add', null)">上传文件</a-button>
            </template>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <a-table :columns="columns" :data-source="dataSource" :alert="false">
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="action" slot-scope="text, record">
        <template>
          <a @click="delSee(record.fileUrl)">查看</a>
        </template>
        <template v-if="types !== 'view'">
          <a-divider type="vertical" />
          <a @click="handleAction('edit', record)">修改</a>
        </template>
        <template v-if="types !== 'view'">
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除该条数据吗?" @confirm="handleAction('del', record)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </div>
    </a-table>
    <XdocView ref="xdocView" />
    <ToolBoxCommonUploadForm ref="toolBoxCommonUploadForm" @ok="handleSaveOk" />
  </div>
</template>

<script>
import XdocView from './XdocView'
import ToolBoxCommonUploadForm from './ToolBoxCommonUploadForm'

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
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'EnterpriseSynopsis',
  components: {
    XdocView,
    ToolBoxCommonUploadForm,
  },
  data() {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      DeleteData: [],
      types: '',
      // 表头
      columns: columns,
      // 初始化加载 必须为 Promise 对象
      dataSource: [],
    }
  },
  methods: {
    query(type, record) {
      this.types = type
      if (type !== 'add') {
        this.dataSource = record.maintenanceOperations
      }
    },
    //查看
    delSee(idurl) {
      this.$refs.xdocView.query(idurl)
    },
    handleAction(type, record) {
      const that = this
      if (['add', 'edit'].includes(type)) {
        let _record = record
          ? {
              id: record.id,
              fileName: record.fileName,
              fileUrl: record.fileUrl,
            }
          : {}
        that.$refs.toolBoxCommonUploadForm.query(type, _record, 2)
      } else if (type === 'del') {
        let react = that.dataSource.find((item) => item.fileName === record.fileName)
        this.DeleteData.push(react)
        that.dataSource = that.dataSource.filter((item) => item.fileName !== record.fileName)
      }
    },
    handleSaveOk(data) {
      const { dataSource } = this
      this.dataSource = [...dataSource, data]
    },
    handleOk() {
      let that = this
      return that.dataSource
    },
    handleData() {
      let that = this
      return that.DeleteData
    },
  },
}
</script>

<style scoped>
</style>
