<template>
  <a-modal
    title="上传"
    :width="450"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline"  class="add-file-form-wrapper">
        <a-form-item label="文件" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <UploadFile ref="uploadFile" />
        </a-form-item>
        <a-form-item label="查看权限" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select 
            placeholder="选择部门"  
            @change="depChangeHandler" 
            :allowClear="true" 
            style="width: 200px" 
            v-decorator="['departmentId', { rules: [{ required: true, message: '请选择部门' }] }]"
          >
            <a-select-option 
              v-for="item in depSelectDataSource" 
              :key="item.id" 
              :value="item.id" 
            >
            {{item.departmentName}}
            </a-select-option>
          </a-select>

          <a-select 
            placeholder="选择岗位"  
            :allowClear="true" 
            style="width: 200px" 
            v-decorator="['stationIds', { rules: [{ required: true, message: '请选择岗位' }] }]"
          >
            <a-select-option 
              v-for="item in postSelectDataSource" 
              :key="item.id" 
              :value="item.id" 
            >
            {{item.stationName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList,//所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import {docFileAddOrUpdate} from '@/api/files-management'
import UploadFile from './UploadFile'
export default {
  name:'AddFile',
  components:{
    UploadFile
  },
  data(){
    return {
      form: this.$form.createForm(this, { name: 'add_file_form' }),
      visible:false,
      spinning:false,
      formItemLayout:{
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      depSelectDataSource:[],
      postSelectDataSource:[],
      record:{}
    }
  },
  methods:{
    init(){
      let that = this
      let queue = []
      let task1 = departmentList().then(res =>that.depSelectDataSource = res.data)
      queue.push(task1)

      return Promise.all(queue)
    },
    async query(type,record){
      let that = this
      that.record = Object.assign({},record)
      that.visible = true
      await that.init()
      if(type === 'edit'){
        //await that.depChangeHandler(that.record.)
        return
      }

    },
    handleSubmit(){
      let that = this
      let files = that.$refs.uploadFile.getFiles()
      if(files.length === 0){
        that.$message.info('您还没有上传文件')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          debugger
          console.log('Received values of form: ', values)
          const formData = new FormData()
          formData.append('file',files[0].originFileObj)
          formData.append('departmentId',values.departmentId)
          formData.append('stationIds',values.stationIds)
          formData.append('dirId',that.record.id)
          that.spinning = true
          docFileAddOrUpdate(formData).then(res =>{
            that.spinning = false
            that.$message.info(res.msg)
            if(res.code !== 200){
              return
            }
            that.$emit('finish')
          }).catch(err =>{
            that.spinning = false
          })
        }
      })
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    depChangeHandler(dep_id){
      let that = this
      that.postSelectDataSource = []
      return getStationList({id:dep_id}).then(res =>{
        that.postSelectDataSource = res.data
      })
    },
  }
}
</script>