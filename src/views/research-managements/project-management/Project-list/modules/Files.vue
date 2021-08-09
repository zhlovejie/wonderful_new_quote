<template>
  <div style="margin-bottom:20px;">
    <h3>
      <span>文件</span>
      <span
        style="float:right"
        v-if="!$attrs.disabled"
      >
        <UploadFile ref="uploadFile" :config="uploadConfig" @change="fileChange" />
      </span>
    </h3>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      size="small"
    >
      <div
        slot="order"
        slot-scope="text, record, index"
      >
        <span>{{ index + 1 }}</span>
      </div>

      <div
        slot="action"
        slot-scope="text, record"
      >
        <a type="primary" @click="doAction('view',record)" >查看</a>
          <template v-if="!$attrs.disabled">
          <a-divider type="vertical" />
          <a
            type="primary"
            @click="doAction('del',record)"
          >删除</a>
          </template>
      </div>
    </a-table>
    <XdocView ref="xdocView" />
  </div>
</template>

<script>
import moment from 'moment'
import UploadFile from './UploadFile'
import XdocView from './XdocView'
const columns = [
  {
    align: 'center',
    title: '文件名称',
    dataIndex: 'name'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
let uuid = () =>
  Math.random()
    .toString(32)
    .slice(-10)
export default {
  components: {
    XdocView,
    UploadFile
  },
  data() {
    return {
      columns,
      dataSource: [],
      detail: {},
      uploadConfig: {
        maxFileCount: 100,
        btnTxt: '上传',
        fileType: 'file', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: false,
        fileValidate: () => true
      },
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },

  methods: {
    moment,
    doAction(type, record) {
      const that = this
      if (type === 'view') {
        that.$refs.xdocView.query(record.url)
        return
      } else if (type === 'del') {
        that.$refs.uploadFile.delFiles([record.uid])
        that.fileChange(that.$refs.uploadFile.getFiles())
        return
      }
    },
    fileChange(fileList) {
      const that = this
      that.dataSource = fileList.filter(file => file.status === 'done').map(f => {
        f.key = f.uid
        return f
      })
      that.$emit('change',that.$refs.uploadFile.getFiles())
    },
    getFiles(){
      return [...this.dataSource]
    },
    setFiles(fileList){
      if(this.$refs.uploadFile){
        this.$refs.uploadFile.setFiles(fileList)
      }
      this.dataSource = fileList
    }
  }
}
</script>

<style scoped>
</style>
