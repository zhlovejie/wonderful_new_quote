<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
  >
    <a-spin :spinning="spinning">
    <a-form :form="form" class="add-form-wrapper">
      <table class="custom-table custom-table-border">
        <tr>
          <td style="width:120px;">配置名称</td>
          <td >
            <a-form-item v-if="!isDisabled">
              <a-input   v-decorator="['itemName', { rules: [{ required: true, message: '请输入配置名称' }] }]" />
            </a-form-item>
            <span v-else>{{record.itemName}}</span>
          </td>
        </tr>
        <tr>
          <td>简介</td>
          <td>
            <a-form-item v-if="!isDisabled">
              <a-textarea 
                placeholder="简介" 
                :rows="5" 
                v-decorator="['introduction', { rules: [{ required: false, message: '简介' }] }]"
              />
            </a-form-item>
            <div v-else>
              <div style="text-align:left;" v-html="formatHTML(record.introduction)" />
            </div>
          </td>
        </tr>
        <tr>
          <td>备注</td>
          <td>
            <a-form-item v-if="!isDisabled">
              <a-textarea 
                placeholder="备注" 
                :rows="2" 
                v-decorator="['remarks', { rules: [{ required: false, message: '备注' }] }]"
              />
            </a-form-item>
            <div v-else>
              <div style="text-align:left;" v-html="formatHTML(record.remarks)" />
            </div>
          </td>
        </tr>
        <tr>
          <td>图片</td>
          <td>
            <a-form-item>
              <div :class="{'clearfix':true,'hide-del-icon':isDisabled}">
                <a-upload 
                  accept="multiple"
                  name="files"
                  :action="this.uploadPath"
                  listType="picture-card"
                  :fileList="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="!isDisabled && fileList.length < 3">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">选择图片</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel">
                  <img alt="图片" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
              <a-input type="hidden" v-decorator="['pictureUrl', {rules: [{required: false,message: '请选择图片！'}]}]"/>
            </a-form-item>
          </td>
        </tr>
      </table>
    </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getUploadPath } from '@/api/manage'
import {
  priceAdjustItemConfigAddAndUpdate
} from '@/api/productOfferManagement'

export default {
  name:'AddForm',
  components:{

  },
  data(){
    return {
      form: this.$form.createForm(this, { name: 'addForm' }),
      visible:false,
      actionType:'add', 
      spinning:false,

      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [],
      uploadPath: getUploadPath(),
    }
  },
  computed:{
    modalTitle(){
      let m = {
        'view':'查看',
        'add':'新增',
        'edit' : '修改',
        'approval':'审批'
      }
      return `${m[this.actionType]}产品配置`
    },
    isView(){
      return this.actionType === 'view'
    },
    isAdd(){
      return this.actionType === 'add'
    },
    isEdit(){
      return this.actionType === 'edit'
    },
    isApproval(){
      return this.actionType === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    }
  },
  methods:{
    init(){
      let that = this
    },
    previewCancel () {
      this.previewVisible = false
    },
    handlePreview (file) { // 点击文件链接或预览图标时的回调
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange (info) { // 上传中、完成、失败都会调用这个函数。
      console.log(arguments)
      let fileList = [...info.fileList]
      fileList = fileList.slice(-3)
      fileList = fileList.map(file => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data[0].url
        }
        return file
      })
      this.fileList = fileList

      this.$nextTick(() => this.form.setFieldsValue({'pictureUrl':this.fileList.map(f => f.url).join(',')}))
    },
    async handleOk(){
      let that = this
      if(that.isView || that.isApproval){
        that.handleCancel()
        return 
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          if(that.isEdit){
            values.id = that.record.id
          }
          console.log('Received values of form: ', values)
          that.spinning = true
          priceAdjustItemConfigAddAndUpdate(values).then(res =>{
            that.spinning = false
            if(res.code === 200){
              that.visible = false 
              that.$message.success('操作成功')
              that.$emit('finish')
            }else{
              that.$message.warning(res.msg)
            }
          })
          .catch(err => {
            console.log(err)
            that.$message.error('操作失败')
            that.spinning = false
          })
        }
      });
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    async query(type,record){
      let that = this
      that.actionType = type 
      that.record = record || {}
      that.fileList = []
      that.form.resetFields()

      await that.init() 
      that.visible = true

      that.fillData()
    },
    fillData(){
      let that = this
      let record = {...that.record || {}}
      if(record.pictureUrl){
        that.fileList = record.pictureUrl.split(',').map(url =>{
          let sp = url.split('/')
          let fname = sp[sp.length - 1]
          return {
            uid: Math.random()
              .toString(16)
              .slice(-10),
            name: fname,
            status: 'done',
            url: url
          }
        })
      }

      that.$nextTick(() =>that.form.setFieldsValue({...record}))
    },
    formatHTML(htmlStr){
      if(typeof htmlStr !== 'string') {
        return ''
      }
      htmlStr = htmlStr.replace(/[\n\r]/g,'<br/>')
      htmlStr = htmlStr.replace(/\s+/g,'&nbsp;')
      return htmlStr
    }
  }
}
</script>
<style>
.ant-upload-list-picture-card .ant-upload-list-item-info::before{
  left: 0;
}
</style>
<style scoped>
.add-form-wrapper >>> .ant-form-item{
  display: flex;
}
.add-form-wrapper >>> .ant-form-item-control-wrapper{
  flex: 1;
}

.custom-table-border th,.custom-table-border td{
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item{
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table{
  margin-bottom: 0;
}

.hide-del-icon >>> .anticon-delete{
  display: none;
}
</style>