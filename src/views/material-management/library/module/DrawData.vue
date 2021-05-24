<template>
  <div style="margin-bottom:20px;">
    <h3>
      <span>图纸数据</span>
      <span
        style="float:right"
        v-if="normalAddForm.isAdd || normalAddForm.isEdit"
      >
        <a-button
          type="link"
          icon="upload"
          @click="showUploadModel"
        >上传</a-button>
        <!-- <UploadFile :config="uploadConfig" @change="fileChange" /> -->
      </span>
    </h3>
    <!-- <a-form
      :form="form"
      class="routine-addform-wrapper-DrawData"
      layout="inline"
    >
      <a-form-item label="是否有PDF图纸">
        <a-select
          placeholder="名称"
          style="width:200px;"
          :allowClear="true"
          v-decorator="[
              'ruleName',
              {
                initialValue: detail.hasPdf,
                rules: [{ required: false, message: '请选择是否有PDF图纸' }],
              },
            ]"
        >
          <a-select-option :value="1">有</a-select-option>
          <a-select-option :value="2">无</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="3D图纸">
        <a-select
          placeholder="是否有3D图纸"
          style="width:200px;"
          :allowClear="true"
          v-decorator="[
              'ruleName',
              {
                initialValue: detail.has3d,
                rules: [{ required: false, message: '请选择是否有3D图纸' }],
              },
            ]"
        >
          <a-select-option :value="1">有</a-select-option>
          <a-select-option :value="2">无</a-select-option>
        </a-select>
      </a-form-item>
    </a-form> -->

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
        slot="blueprintType"
        slot-scope="text, record, index"
      >
        <span>{{ {1:'PDF图纸',2:'3D图纸'}[text] }}</span>
      </div>

      <div
        slot="action"
        slot-scope="text, record"
      >
        <!-- <a type="primary" @click="doAction('view',record)" >查看</a> -->
        <template v-if="normalAddForm.isEdit">
          <!-- <a-divider type="vertical" /> -->
          <a
            type="primary"
            @click="doAction('del',record)"
          >删除</a>
        </template>
      </div>
    </a-table>
    <UploadFileModel
      ref="uploadFileModel"
      @change="fileChange"
    />
  </div>
</template>

<script>
import moment from 'moment'
import UploadFileModel from './UploadFileModel'
const columns = [
  {
    align: 'center',
    title: '类别',
    dataIndex: 'blueprintType',
    scopedSlots: { customRender: 'blueprintType' }
  },
  {
    align: 'center',
    title: '文件名称',
    dataIndex: 'fileName'
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'modifyTime'
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
  name: 'DrawData',
  inject: ['normalAddForm'],
  components: {
    UploadFileModel
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
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  created() {
    const that = this
    let { has3d, hasPdf, blueprints } = that.normalAddForm.submitParams
    //初始化 不存在3D 和 PDF
    if (!has3d) {
      that.normalAddForm.submitParams.has3d = 2
    }
    if (!hasPdf) {
      that.normalAddForm.submitParams.hasPdf = 2
    }
    if (blueprints) {
      that.dataSource = blueprints.map(item => {
        item.key = uuid()
        return item
      })
    }
  },
  methods: {
    moment,
    doAction(type, record) {
      const that = this
      if (type === 'view') {
        that.$message.info('暂不支持图纸预览')
        return
      } else if (type === 'del') {
        that.dataSource = that.dataSource.filter(item => item.key !== record.key)
        that.updateData()
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
            blueprintType: file.__fileType,
            fileName: file.name,
            fileUrl: file.url,
            createdName: that.userInfo.trueName,
            createdTime: _time,
            modifyTime: _time
          }
        ]

        that.updateData()
      }
    },
    updateData() {
      const that = this
      let id = that.normalAddForm.getId()
      that.normalAddForm.submitParams.blueprints = [...that.dataSource].map(item => {
        return { ...item, id }
      })
      that.normalAddForm.submitParams.has3d = that.dataSource.some(item => item.blueprintType === 2) ? 1 : 2
      that.normalAddForm.submitParams.hasPdf = that.dataSource.some(item => item.blueprintType === 1) ? 1 : 2
    },
    showUploadModel() {
      this.$refs.uploadFileModel.query()
    }
  }
}
</script>

<style scoped>
</style>
