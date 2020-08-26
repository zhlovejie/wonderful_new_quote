<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-add-form-wrapper">

        <a-form-item label="体检结果">
          <a-radio-group v-decorator="['checkupResult', {initialValue: 1, rules: [{required: true,message: '请选择体检结果'}]}]" style="width: 100%">
            <a-radio :value="1">合格</a-radio>
            <a-radio :value="2">不合格</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="体检报告">
          <div class="clearfix">
            <a-upload
              name="file"
              :action="uploadPath"
              :multiple="true"
              :fileList="fileList"
              @change="handleChange"
            >
              <a-button type="dashed" icon="upload" >上传文件</a-button>
            </a-upload>
          </div>
          <a-input type="hidden" v-decorator="['checkupReport', {initialValue:'', rules: [{ required: true, message: '请上传体检报告' }] }]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  checkupManagementUploadReport
} from '@/api/welfareManagement'
import { getUploadPath2 } from '@/api/common'
export default {
  name: 'welfare-management-healthy-management-AddForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'welfare-management-healthy-management-AddForm' }),
      visible: false,
      spinning: false,
      type: 'view',
      depSelectDataSource: [],
      postSelectDataSource: [],
      record: {},
      uploadPath: getUploadPath2(),
      fileList: []
    }
  },
  computed: {
    modalTitle() {
      return this.type === 'add' ? '新增' : '编辑'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    }
  },
  methods: {
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.fileList = []
      await that.form.resetFields()
      
      await that.initData()
      if (that.isEdit) {
        that.$nextTick(() => {
          that.form.setFieldsValue(Object.assign({}, that.record))
        })
      }
    },
    initData() {
      let that = this
      let queue = []
      
      return Promise.all(queue)
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          
            values.id = that.record.id
          
          that.spinning = true
          checkupManagementUploadReport(values)
            .then(res => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    handleChange(info) {
      let that = this
      let fileList = [...info.fileList].slice(-1)
      fileList = fileList.map(file => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList
      if(this.fileList.some(f => f.url)){
        that.form.setFieldsValue({
          checkupReport:this.fileList.find(f => f.url).url
        })
      }else{
        that.form.setFieldsValue({checkupReport:undefined})
      }
    }
  }
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item{
  display:flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label{
  width:100px;
}
.ant-form-item >>> .ant-form-item-control-wrapper{
  flex:1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: left;
}
</style>
