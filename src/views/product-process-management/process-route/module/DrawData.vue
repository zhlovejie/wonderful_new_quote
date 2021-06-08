<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <div>
      <h3>
        <span>{{title}}</span>
        <span style="float:right">
          <a-button
            v-if="!addForm.isDisabled"
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
          <a
            type="primary"
            @click="doAction('view',record)"
          >查看</a>
          <template v-if="!addForm.isDisabled">
            <a-divider type="vertical" />
            <a
              type="primary"
              @click="doAction('del',record)"
            >删除</a>

          </template>
          <a-divider type="vertical" />
          <a
            target="_blank"
            type="primary"
            v-download="record.url"
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

const uuid = () =>
  Math.random()
    .toString(32)
    .slice(-10)
export default {
  name: 'DrawData',
  components: {
    UploadFileModel,
    XdocView
  },
  inject: ['addForm'],
  data() {
    return {
      form: this.$form.createForm(this, { name: 'DrawData' }),
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
      typeList: [],
      visible: false
    }
  },
  computed: {
    title() {
      const m = { 0: '图纸信息', 1: '排版图', 2: '程序' }
      return m[this.detail.type]
    },
    columns() {
      const baseColumns = [
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
      if (this.detail.type === 0) {
        baseColumns.unshift({
          align: 'center',
          title: '类别',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        })
      }
      return baseColumns
    },
    modalTitle() {
      const m = { 0: '图纸', 1: '排版图', 2: '程序' }
      return `上传${m[this.detail.type]}`
    }
  },
  created() {
    const that = this
    getDictionary({ text: '工艺路线-图纸信息-图纸类型' }).then(res => (that.typeList = res.data))
  },
  methods: {
    moment,
    query(params = {}, formInfo = {}) {
      const that = this
      that.detail = { ...params }

      const type = params.type

      const { picFiles, rangeProcesses } = formInfo
      if (type === 0 && picFiles) {
        that.dataSource = picFiles.map(item => {
          return {
            type: item.picDicId,
            typeName: item.picDicName,
            fileName: item.picName,
            url: item.picUrl,
            id: item.id
          }
        })
      } else if (type === 1 && rangeProcesses) {
        that.dataSource = rangeProcesses
          .filter(f => f.fileType === 1)
          .map(item => {
            return {
              type: item.fileType,
              fileName: item.fileName,
              url: item.fileUrl,
              id: item.id
            }
          })
      } else if (type === 2 && rangeProcesses) {
        that.dataSource = rangeProcesses
          .filter(f => f.fileType === 2)
          .map(item => {
            return {
              type: item.fileType,
              fileName: item.fileName,
              url: item.fileUrl,
              id: item.id
            }
          })
      }
      // initDataSource()

      that.$nextTick(() => (that.visible = true))
    },
    doAction(type, record) {
      const that = this
      if (type === 'view') {
        that.$refs.xdocView.query(record.url)
      } else if (type === 'del') {
        that.dataSource = that.dataSource.filter(item => item.key !== record.key)
      }
    },
    fileChange(file) {
      const that = this
      if (file && file.status === 'done') {
        const _time = that.moment().format('YYYY-MM-DD HH:mm:ss')
        that.dataSource = [
          ...this.dataSource,
          {
            key: uuid(),
            type: file.__fileType,
            fileName: file.__fileName,
            typeName: file.__typeName,
            url: file.url
          }
        ]
      }
    },
    showUploadModel() {
      this.$refs.uploadFileModel.query(this.detail)
    },
    getFileType(type) {
      const target = this.typeList.find(item => item.id === type)
      return target ? target.text : '未知类型'
    },
    handleSubmit() {
      const that = this
      that.$emit('change', that.formatData())
      that.handleCancel()
    },
    handleCancel() {
      this.dataSource = []
      this.visible = false
    },
    formatData() {
      const that = this
      const data = [...that.dataSource]
      const type = +that.detail.type
      if (type === 0) {
        const __data = data.map(item => {
          return {
            picDicId: item.type,
            picDicName: item.typeName,
            picName: item.fileName,
            picUrl: item.url,
            id: item.id
          }
        })
        return { picFiles: __data }
      } else if (type === 1 || type === 2) {
        const obj = {}
        const __data = data.map(item => {
          return {
            fileType: type,
            fileName: item.fileName,
            fileUrl: item.url,
            id: item.id
          }
        })
        return { rangeProcesses: __data }
      } else {
        console.log(`不支持的类型type:${type}`)
        return null
      }
    }
  }
}
</script>

<style scoped>
</style>
