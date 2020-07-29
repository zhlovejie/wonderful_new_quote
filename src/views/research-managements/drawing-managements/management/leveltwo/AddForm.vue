<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <table class="custom-table custom-table-border">
          <tr>
            <td>上级</td>
            <td>
              <a-form-item>
                <a-input
                  disabled
                  style="width:100%;"
                  v-decorator="['superiorName',{initialValue:detail.superiorName}]"
                />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['superiorId',{initialValue:detail.superiorId}]" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">名称</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="名称"
                  allowClear
                  style="width:100%;"
                  v-decorator="['name', {initialValue:detail.name, rules: [{ required: true, message: '输入名称' }] }]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:120px;">代码</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="产品代码"
                  allowClear
                  style="width:100%;"
                  v-decorator="['code', {initialValue:detail.code, rules: [{ required: true, message: '输入产品代码' }] }]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:120px;">图片</td>
            <td>
              <a-form-item style="width:400px;overflow:hidden;">
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
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  placeholder
                  :rows="2"
                  v-decorator="['remark', {initialValue:detail.remark, rules: [{ required: false, message: '输入备注' }] }]"
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
import { blueprintMenuDetail, blueprintMenuAddOrUpdate ,getUploadPath} from '@/api/researchManagement'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      type: 'view',
      detail: {},
      record:{},
      uploadPath: getUploadPath,
      fileList: []
    }
  },
  computed: {
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '编辑'}`
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isAdd() {
      return this.type === 'add'
    },
  },
  methods: {
    async query(type, record) {
      //debugger
      let that = this
      that.form.resetFields()
      that.type = type
      //that.detail = Object.assign({}, record)
      that.record = {...record}
      await that.initData()
      that.visible = true
    },
    initData() {
      let that = this
      let queue = []

      if(that.isAdd){
        let {id,superiorId,menuName} = that.record.params
        that.detail = {id,superiorId,superiorName:menuName}
      }else{
        let task1 = blueprintMenuDetail({id:that.record.record.id}).then(res =>{
          that.detail = res.data
          if(that.detail.url){
            that.fileList = [{
              uid: uuid(),
              name: that.detail.url,
              status: 'done',
              url: that.detail.url
            }]
          }
        })
        queue.push(task1)
      }
      return Promise.all(queue)
    },
    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.detail.id
          }else{
            //values.id = that.record.params.id || 0
          }
          if(that.fileList.length > 0){
            values.url = that.fileList[0].url
          }
          values.superiorId = that.detail.id
          //values.type = that.detail.type || that.record.params.type
          values.type = 2
          console.log('Received values of form: ', values)
          that.spinning = true

          blueprintMenuAddOrUpdate(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.handleCancel()
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    handleChange(info) {
      console.log(arguments)
      let fileList = [...info.fileList].slice(-1)
      fileList = fileList.map(file => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList
    }
  },
}
</script>
<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
  text-align: left;
}
.custom-table-border tr td:nth-child(1)
{
  text-align: center;
}
.custom-table-border >>> .ant-form-item {
  margin-bottom: 0;
}
</style>
