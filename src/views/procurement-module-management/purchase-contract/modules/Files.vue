<template>
  <a-modal
    :title="modalTitle"
    :width="980"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <h3>
        <span>合同信息</span>
        <span style="float:right">
          <a-button type="link" icon="upload" @click="showUploadModel({ from: 'dataSourceContracts' })">上传</a-button>
        </span>
      </h3>
      <a-table :columns="columns" :dataSource="dataSourceContracts" :pagination="false" size="small">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary">下载</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('del', record)">删除</a>
        </div>
      </a-table>

      <h3>
        <span>其他信息</span>
        <span style="float:right">
          <a-button type="link" icon="upload" @click="showUploadModel({ from: 'dataSourceOthers' })">上传</a-button>
        </span>
      </h3>
      <a-table :columns="columns" :dataSource="dataSourceOthers" :pagination="false" size="small">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary">下载</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('del', record)">删除</a>
        </div>
      </a-table>

      <UploadFileModel ref="uploadFileModel" @change="fileChange" />
      <XdocView ref="xdocView" />
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import {
  purchaseContractAttachmentList,
  purchaseContractAttachmentDetail,
  purchaseContractAttachmentDel,
  purchaseContractAttachmentAddOrUpdate
} from '@/api/procurementModuleManagement'
import UploadFileModel from './UploadFileModel'
import XdocView from './XdocView'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 80
  },
  {
    title: '文件名称',
    dataIndex: 'fileName'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'Files',
  components: {
    UploadFileModel,
    XdocView
  },
  data() {
    return {
      modalTitle: '合同附件',
      visible: false,
      spinning: false,
      columns,
      dataSourceContracts: [],
      dataSourceOthers: [],
      record: {},
      uploadConfig: {
        maxFileCount: 100,
        btnTxt: '上传图片',
        fileType: 'img', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: true,
        fileValidate: () => true
      },
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  methods: {
    moment,
    query(record) {
      let that = this
      that.record = record
      that.visible = true
      that.dataSourceContracts = []
      that.dataSourceOthers = []

      that.fetchData()
    },
    fetchData() {
      const that = this
      that.spinning = true
      purchaseContractAttachmentList({ contractId: that.record.id })
        .then(res => {
          that.spinning = false
          let { data } = res
          if (!Array.isArray(data)) {
            return
          }
          data = data.map(r => {
            r.key = that._uuid()
            return r
          })
          that.dataSourceContracts = data.filter(r => +r.type === 1)
          that.dataSourceOthers = data.filter(r => +r.type === 2)
        })
        .catch(err => {
          that.spinning = false
          that.$message.info(err.message)
        })
    },
    doAction(type, record) {
      const that = this
      if (type === 'view') {
        that.$refs.xdocView.query(record.fileUrl)
        return
      } else if (type === 'del') {
        purchaseContractAttachmentDel({ id: record.id })
          .then(res => {
            if (+res.code === 200) {
              that.fetchData()
            }
            that.$message.info(res.msg)
          })
          .catch(err => {
            that.$message.info(err.message)
          })
        return
      }
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    fileChange({ record, form }) {
      const that = this
      purchaseContractAttachmentAddOrUpdate({
        contractId: that.record.id,
        fileName: form.fileName,
        fileUrl: form.fileUrl,
        type: record.from === 'dataSourceContracts' ? 1 : 2,
        remark: form.remark
      }).then(res => {
        that.$message.info(res.msg)
        if (+res.code === 200) {
          that.fetchData()
        }
      })
    },
    showUploadModel(record) {
      this.$refs.uploadFileModel.query(record)
    }
  }
}
</script>

<style scoped></style>
