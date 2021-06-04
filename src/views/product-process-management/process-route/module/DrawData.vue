<template>
<a-modal
    title="上传图纸"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
  <div >
    <h3>
      <span>{{title}}</span>
      <span
        style="float:right"
      >
        <a-button
          type="link"
          icon="upload"
          @click="showUploadModel"
        >上传</a-button>
      </span>
    </h3>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      size="middle"
    >
      <div
        slot="order"
        slot-scope="text, record, index"
      >
        <span>{{ index + 1 }}</span>
      </div>
      <div
        slot="type"
        slot-scope="text, record, index"
      >
        <span>{{getFileType(text)}}</span>
      </div>

      <div
        slot="action"
        slot-scope="text, record"
      >
        <a type="primary" @click="doAction('view',record)" >查看</a>
          <a-divider type="vertical" />
          <a
            type="primary"
            @click="doAction('del',record)"
          >删除</a>
          <a-divider type="vertical" />
          <a
            type="primary"
            @click="doAction('download',record)"
          >下载</a>
      </div>
    </a-table>
    <UploadFileModel
      ref="uploadFileModel"
      @change="fileChange"
    />
    <XdocView ref="xdocView" />
  </div>
</a-modal>
</template>

<script>
import moment from 'moment'
import UploadFileModel from './UploadFileModel'
import XdocView from './XdocView'
import { getDictionary } from '@/api/common'
const columns = [
  {
    align: 'center',
    title: '类别',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    align: 'center',
    title: '文件名称',
    dataIndex: 'fileName'
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
    .slice(-10);
export default {
  name: 'DrawData',
  components: {
    UploadFileModel,
    XdocView
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'DrawData' }),
      columns,
      dataSource: [],
      detail: {},
      uploadConfig: {
        maxFileCount: 100,
        btnTxt: '上传图片',
        fileType: 'img', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: true,
        fileValidate: () => true
      },
      userInfo: this.$store.getters.userInfo, // 当前登录人
      typeList:[],
      visible:false
    }
  },
  computed:{
    title(){
      let m = {0:'图纸信息',1:'排版图',2:'程序'}
      return m[this.detail.type]
    }
  },
  created() {
    const that = this
    getDictionary({ text: '工艺路线-图纸信息-图纸类型' }).then((res) => (that.typeList = res.data))
  },
  methods: {
    moment,
    query(params = {}){
      const that = this
      that.detail = {...params}
      that.visible = true
    },
    doAction(type, record) {
      const that = this
      if (type === 'view') {
        // that.$message.info('暂不支持图纸预览')
        // debugger
        that.$refs.xdocView.query(record.fileUrl)
        return
      } else if (type === 'del') {
        that.dataSource = that.dataSource.filter(item => item.key !== record.key)
        return
      }
    },
    fileChange(file) {
      const that = this
      if (file && file.status === 'done') {
        let _time = that.moment().format('YYYY-MM-DD HH:mm:ss')
        that.dataSource = [
          ...this.dataSource,
          {
            key: uuid(),
            type: file.__fileType,
            fileName: file.__fileName,
            url: file.url
          }
        ]
      }
    },
    showUploadModel() {
      this.$refs.uploadFileModel.query(this.detail)
    },
    getFileType(type){
      let target = this.typeList.find(item => item.id === type)
      return target ? target.text : '未知类型'
    },
    handleSubmit(){
      const that = this
      that.$emit('change',that.formatData())
      that.handleCancel()
    },
    handleCancel(){
      this.dataSource = []
      this.visible = false
    },
    formatData(){
      const that = this
      let data = [...that.dataSource]
      let type = +that.detail.type
      if(type === 0){
        let __data = data.map(item => {
          return {
            picDicId:item.type,
            picName:item.fileName,
            picUrl:item.url,
            id:item.id
          }
        })
        return {picFiles:__data}
      }else if(type === 1 || type === 2){
        let obj = {}
        let __data = data.map(item => {
          return {
            fileType:type,
            fileName:item.fileName,
            fileUrl:item.url,
            id:item.id
          }
        })
        return {rangeProcesses:__data}
      }else{
        console.log(`不支持的类型type:${type}`)
        return null
      }
    }
  }
}
</script>

<style scoped>
</style>
