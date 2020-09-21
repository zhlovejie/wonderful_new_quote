<template>
  <a-modal
    :title="modalTitle"
    :width="700"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>上级</td>
            <td colspan="3">
              <a-form-item>
                <a-input style="width:300px;" disabled v-model="parentId" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>文件名称</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  style="width:300px;"
                  placeholder="输入文件名称"
                  v-decorator="['fileName', {rules: [{required: true,message: '输入文件名称!',},
             ]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>上传</td>
            <td colspan="3">
              <a-form-item>
                <a-upload
                  v-decorator="['fileUrl',{ rules: [{ required: true, message: '请上传文件' }] },{valuePropName: 'fileList',getValueFromEvent: normFile,},]"
                  name="file"
                  :fileList="fileList"
                  @change="handleChange"
                  :action="uploadUrl"
                >
                  <a-button style="width:300px;">
                    <a-icon type="upload" />
                  </a-button>
                </a-upload>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="4">
              <a-form-item>
                <a-textarea
                  style="width:300px;"
                  placeholder="备注信息"
                  :rows="3"
                  v-decorator="['remark', { rules: [{ required: false, message: '请输入备注信息' }] }]"
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
import { materialsSaveOrUpdate, getFolderDetail } from '@/api/training-management'
import { getUploadPath2 } from '@/api/common'
export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      visible: false,
      spinning: false,
      type: 'View',
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      uploadUrl: getUploadPath2(),
      //   上传文件
      fileList: [],
      addId: '',
      parentId: '',
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改文件'
      }
      if (this.isView) {
        return '新增文件'
      }
    },
    isView() {
      //新增
      return this.type === 'add'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },

    isDisabled() {
      return this.isView || this.isEditSalary
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_Insurance') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    query(type, record) {
      console.log(type, record)
      this.visible = true
      this.type = type
      this.record = record
      if (type === 'add') {
        this.addId = record.Id
        this.parentId = record.name
      }
      if (type === 'folder') {
        this.addId = record.id
        this.parentId = record.folderName
      }
      if (type === 'edit-salary') {
        this.fillData()
      }
    },

    fillData() {
      const that = this
      that.$nextTick(() => {
        getFolderDetail({ fileId: that.record.id }).then((res) => {
          console.log(res.data)
          that.form.setFieldsValue({
            fileName: res.data.fileName,
            fileUrl: res.data.fileUrl,
            remark: res.data.remark,
          })
          that.addId = res.data.folderId
          that.parentId = res.data.folderName
          let arr = res.data.fileUrl.split('/')
          console.log(arr)
          that.fileList.push({
            uid: '-1',
            name: arr[arr.length - 1],
            status: 'done',
            url: that.record.fileUrl,
          })
        })
      })
    },

    handleOk() {
      console.log('你是要提交')
      let that = this
      if (that.type === 'add' || that.type === 'edit-salary' || that.type === 'folder') {
        that.form.validateFields((err, values) => {
          if (!err) {
            console.log(values)
            if (that.type === 'edit-salary') {
              values.id = this.record.id
            }
            if (that.type !== 'edit-salary') {
              values.fileUrl = values.fileUrl.fileList[0].response.data
            }
            if (typeof values.fileUrl === 'string' && that.type === 'edit-salary') {
              values.fileUrl = values.fileUrl
            } else if (that.type === 'edit-salary') {
              values.fileUrl = values.fileUrl.fileList[0].response.data
            }
            values.folderId = this.addId
            materialsSaveOrUpdate(values)
              .then((res) => {
                that.spinning = false
                this.fileList = []
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                let arr = { id: that.addId }
                that.$emit('finish', arr)
              })
              .catch((err) => (that.spinning = false))
          }
        })
      } else if (that.isEditSalary) {
        // that.updateUserBackCardSalary()
      } else {
        that.form.resetFields() // 清空表
        that.visible = false
      }
    },
    //上传
    normFile(e) {
      debugger
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    handleChange(info) {
      this.fileList = []
      let fileList = [...info.fileList]
      fileList = fileList.map((file) => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList
    },
    handleCancel() {
      this.fileList = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>