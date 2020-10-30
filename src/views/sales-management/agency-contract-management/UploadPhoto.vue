<template>
  <a-modal
    title="上传附件"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <div id="__custom_upload_attachment_warpper">
      <a-spin :spinning="confirmLoading">
      <a-form>
        <a-row class="form-row" :gutter="24">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <div class="clearfix">
                <a-upload
                  accept="multiple"
                  name="file"
                  :action="this.uploadPath"
                  :fileList="accessoryList"
                  @change="accessoryChange" 
                >
                  <a-button> <a-icon type="upload" /> 选择文件 </a-button>
                </a-upload>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-table :columns="columns" :dataSource="dataSource" :pagination="false" size="small">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="fileUrl" slot-scope="text, record, index">
            <a :href="text" target="_blank">{{text ? text.split('/').slice(-1).join('') : ''}}</a>
          </div>
          
          <div slot="attachmentName" slot-scope="text, record">
            <a-input
              placeholder="文件名称"
              :value="record.attachmentName"
              @change="inputChange(record.key, 'attachmentName', $event)"
            />
          </div>
          <div slot="action" slot-scope="text, record">
            <a type="primary" @click="doRemoveAction(record.key)">删除</a>
          </div>
        </a-table>
      </a-form>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import { getUploadPath2 } from '@/api/common'
import { 
  agencyContractAttachmentList,
  agencyContractAttachmentDel,
  agencyContractAttachmentAddOrUpdate
} from '@/api/agencyContract'
let uuid = () => Math.random().toString(32).slice(-10)

let columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '附件名称',
    dataIndex: 'attachmentName',
    scopedSlots: { customRender: 'attachmentName' },
  },
  {
    align: 'center',
    title: '源文件名称',
    dataIndex: 'fileUrl',
    scopedSlots: { customRender: 'fileUrl' },
    width:300
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'UploadPhoto',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 }
      },
      visible: false, // 表单对话框是否可见
      uploadPath: getUploadPath2(), // 上传图片的url
      accessoryList: [], // 附件文件集合
      cId: 0, // 合同id
      columns,
      dataSource:[],
      confirmLoading:false
    }
  },
  watch:{
    accessoryList(val){
      //console.log('..........123')
      if(Array.isArray(val)){
        this.dataSource = val.filter(item => item.status === 'done').map(item =>{
          //debugger
          let target = this.dataSource.find(v => v.key === item.uid)
          let attachmentName = item.attachmentName || (target ? target.attachmentName : undefined)
          return {
            key:item.uid,
            attachmentName,
            fileUrl:item.url ? item.url : (item.response ? item.response.data : null),
            contractId:item.contractId || this.cId,
            id:item.__id || null
          }
        })
      }else{
        this.dataSource = []
      }
      
    }
  },
  methods: {
    inputChange(key, field, event) {
      let that = this
      let dataSource = [...that.dataSource]
      let target = dataSource.find((item) => item.key === key)
      if (target) {
        target[field] = event.target.value
        that.dataSource = dataSource
      }
    },
    doRemoveAction(key) {
      let target = this.dataSource.find((item) => item.key === key)
      if (target) {
        this.accessoryList = this.accessoryList.filter((f) => f.url !== target.fileUrl)
        target.id && agencyContractAttachmentDel(`id=${target.id}`)
      }
    },
    showForm (record) {
      let that = this
      that.accessoryList = []
      that.dataSource = []
      that.cId = record.id
      try{
        agencyContractAttachmentList(`contractId=${record.id}`).then(res =>{
          that.accessoryList = res.data.map(item =>{
            return {
              uid:uuid(),
              attachmentName:item.attachmentName,
              name:item.fileUrl,
              status:'done',
              url:item.fileUrl,
              __id:item.id,
              contractId:item.contractId
            }
          })
        })
      }catch(err){
        console.log(err)
      }
      this.visible = true
      
    },
    accessoryChange ({ file, fileList }) {
      if(file.status === 'error'){
        this.$message.error(`文件[${file.name}]上传失败`)
      }
      this.accessoryList = [...fileList]
    },
    handleCancel () {
      this.visible = false
    },
    handleSubmit () {
      let that = this

      if(that.dataSource.some(item => !item.attachmentName)){
        that.$message.info('请完善附件名称')
        return
      }

      let queue = []
      that.dataSource.map(item =>{
        queue.push(agencyContractAttachmentAddOrUpdate({
          contractId:item.contractId,
          attachmentName:item.attachmentName,
          fileUrl:item.fileUrl,
          id:item.id
        }))
      })

      that.confirmLoading = true
      Promise.all(queue).then(res =>{
        that.confirmLoading = false
        that.visible = false
        that.$message.info('操作成功')
      }).catch(err =>{
        console.log(err)
        that.confirmLoading = false
      })
    }
  }
}
</script>

<style scoped>
#__custom_upload_attachment_warpper >>> .ant-upload-list-text{
  display: none;
}
</style>
