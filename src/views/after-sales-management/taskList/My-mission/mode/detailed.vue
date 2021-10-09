<template>
  <a-modal
    title="验收单"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <h3>验收产品</h3>

        <a-table :columns="columns" :data-source="record.data" :pagination="false">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="quantity" slot-scope="text, record, index">
            <a-form-item>
              <!--       v-decorator="[
                  `record.data[${index}].fileName`,
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入验收数量!',
                      },
                    ],
                  },
                ]" -->
              <a-input-number :max="record.quantity" placeholder="验收数量" v-model="record.quantity" />
            </a-form-item>
          </div>
        </a-table>
        <h3>验收单</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td>文件名称</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="请输入文件名称"
                  v-decorator="[
                    'fileName',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入文件名称!',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>协议文件</td>
            <td>
              <a-form-item>
                <a-upload :action="uploadUrl" :disabled="isDisabled" :fileList="fileList1" @change="handleChange1">
                  <a-button> <a-icon type="upload" /> 上传文件 </a-button>
                </a-upload>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  placeholder="请输入备注"
                  v-decorator="[
                    'remark',
                    {
                      rules: [
                        {
                          required: false,
                          message: '请输入备注!',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addAndUpdateNetworkManagement } from '@/api/after-sales-management'
import { getUploadPath2 } from '@/api/common'
let uuid = () => Math.random().toString(32).slice(-10)
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
  },
  {
    title: '数量（台）',
    dataIndex: 'quantity',
    scopedSlots: { customRender: 'quantity' },
  },
]

export default {
  name: 'EnterpriseSynopsis',
  components: {},
  data() {
    return {
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      selectedRows: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      uploadUrl: getUploadPath2(),
      Warehouse: [],
      visible: false,
      confirmLoading: false,
      addOredit: 'add',
      type: 0,
      record: {},
      toolType: 0,
      queryBoolean: false,
      fileList1: [],
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
    modalTitle() {
      let txt = this.isView ? '查看' : this.isEdit ? '修改' : '新增'
      return `${txt}`
    },
    isView() {
      return this.addOredit === 'view'
    },
    isAdd() {
      return this.addOredit === 'add'
    },
    isEdit() {
      //审核
      return this.addOredit === 'edit'
    },
    isDisabled() {
      return this.isView
    },
  },
  methods: {
    async query(type, record) {
      this.visible = true
      this.addOredit = type
      this.record = this.$_.cloneDeep(record || {})
      console.log(record)
    },

    close() {
      this.fileList1 = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
    handleOk() {
      const _this = this
      if (this.isView) {
        return (this.visible = false)
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (this.fileList1.length === 0) {
          this.$message.error('请上传文件')
        }
        let react = {}
        react.acceptanceProductList = this.record.data
        react.fileName = values.fileName
        react.remark = values.remark
        react.acceptanceType = this.record.acceptanceType
        react.taskDocumentId = this.record.taskDocumentId
        react.acceptanceUrl = this.fileList1[0].response.data
        this.$emit('opinionChange', react)
        this.close()
      })
      //   // 验证表单没错误
      //   if (!err) {
      //     if (this.isEdit) {
      //       values.id = this.record.id
      //     }
      //     if (this.fileList1.length !== 0) {
      //       values.acceptanceUrl = this.fileList1.map((i) => (i.response && i.response.data) || i.url).toString() || ''
      //     }
      //     values.networkType = 0
      //     values.territory = values.territory.toString()
      //     values.territoryName = this.labelName || this.record.territoryName

      //     values.serviceUserVoList = [
      //       {
      //         contactInformation: values.contactInformation,
      //         serviceUserName: values.serviceUserName,
      //       },
      //     ]
      //     delete values.contactInformation
      //     delete values.serviceUserName
      //     _this.confirmLoading = true
      //     addAndUpdateNetworkManagement(values)
      //       .then((res) => {
      //         if (res.code == 200) {
      //           _this.$message.success('保存成功')
      //         } else {
      //           _this.$message.error(res.msg)
      //         }
      //       })
      //       .catch(() => {
      //         // Do something
      //       })
      //       .finally(() => {
      //         _this.confirmLoading = false
      //         // 清空表单
      //         _this.form.resetFields()
      //         // 清空图片
      //         this.fileList = []
      //         _this.close()
      //       })
      //   }
      // })
    },
    handleChange1(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url
        }
        return file
      })
      this.fileList1 = fileList
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<style scoped >
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.input_video {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
.ant-form-item {
  margin-bottom: 0;
}
</style>
