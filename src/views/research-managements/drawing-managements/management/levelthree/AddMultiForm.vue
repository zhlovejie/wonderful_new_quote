<template>
  <div class="__research-managements_multi_form">
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
                  v-decorator="['permissionName',{initialValue:detail.permissionName}]"
                />
              </a-form-item>
              <!-- <a-form-item hidden>
                <a-input v-decorator="['superiorId',{initialValue:detail.superiorId}]" />
              </a-form-item> -->
              <a-form-item hidden>
                <a-input v-decorator="['menuId',{initialValue:detail.menuId}]" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['permissionId',{initialValue:detail.permissionId}]" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">类型</td>
            <td>
              <a-form-item>
                <a-radio-group v-decorator="['fileType',{initialValue: detail.fileType}]">
                  <a-radio :value="1">研发图纸</a-radio>
                  <a-radio :value="2">工艺图纸</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:120px;">文件</td>
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
                    <a-button type="dashed" icon="upload">上传文件</a-button>
                  </a-upload>
                </div>
              </a-form-item>
            </td>
          </tr>
        </table>


        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          size="small"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="uploadFileName" slot-scope="text, record, index">
            <span style="display:inline-block;width:100px;word-break: break-all;">{{text}}</span>
          </div>
          
          <div slot="pictureNum" slot-scope="text, record">
            <a-input placeholder="图号" :value="record.pictureNum" @change="inputChange(record.key,'pictureNum',$event)"/>
          </div>
          <div slot="fileName" slot-scope="text, record">
            <a-input placeholder="文件名称" :value="record.fileName" @change="inputChange(record.key,'fileName',$event)"/>
          </div>
          <div slot="productCode" slot-scope="text, record">
            <a-input placeholder="代码" :value="record.productCode" @change="inputChange(record.key,'productCode',$event)"/>
          </div>
          <div slot="remark" slot-scope="text, record">
            <a-input placeholder="备注" :value="record.remark" @change="inputChange(record.key,'remark',$event)"/>
          </div>
          <div slot="action" slot-scope="text, record">
            <a type="primary" @click="doRemoveAction(record.key)">删除</a>
          </div>
        </a-table>
        <div style="margin-top:20px;text-align:center;" v-if="!isView">
          <a-button @click="handleCancel">取消</a-button>
          <a-button style="margin-left:10px;" type="primary" @click="handleSubmit">确定</a-button>
        </div>
      </a-form>
    </a-spin>
  </div>
</template>
<script>
import { blueprintFileAdd, getUploadPath } from '@/api/researchManagement'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

let columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '文件',
    dataIndex: 'uploadFileName',
    scopedSlots: { customRender: 'uploadFileName' }
  },
  {
    align: 'center',
    title: '图号',
    dataIndex: 'pictureNum',
    scopedSlots: { customRender: 'pictureNum' }
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'fileName',
    scopedSlots: { customRender: 'fileName' }
  },
  {
    align: 'center',
    title: '代码',
    dataIndex: 'productCode',
    scopedSlots: { customRender: 'productCode' }
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    align: 'center',
    title: '清空',
    scopedSlots: { customRender: 'action' }
  },
]


export default {
  name: 'AddForm',
  components: {},
  props:{
    param:{
      type:Object,
      default:() => {}
    },
    action:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      columns,
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      type: 'view',
      detail: {},
      record: {},
      uploadPath: getUploadPath,
      fileList: [],
      dataSource:[]
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
  created(){
    this.query(this.action,this.param)
  },
  watch:{
    fileList(val){
      let that = this
      let dataSource = []
      let getFile = (f) => that.dataSource.find(item => item.__url === f.url)
      val.map(f =>{
        if(f.url){
          let item = getFile(f)
          if(item){
            dataSource.push(Object.assign({},item))
          }else{
            let pictureNum = ''
            try{
              pictureNum = f.name.match(/(\d+)/g)[0]
            }catch(err){
              pictureNum = ''
            }
            dataSource.push({
              uploadFileName:f.name,
              pictureNum:pictureNum,
              fileName:'',
              productCode:'',
              remark:'',
              __url:f.url
            })
          }
        }
      })
      that.dataSource = dataSource
    }
  },
  methods: {
    inputChange(key,field,event){
      let that = this
      let dataSource = [...that.dataSource]
      let target = dataSource.find(item => item.key === key)
      if(target){
        target[field] = event.target.value
        that.dataSource = dataSource
      }
    },
    async query(type, record) {
      //debugger
      let that = this
      that.form.resetFields()
      that.type = type
      //that.detail = Object.assign({}, record)
      that.record = { ...record }
      await that.initData()
      that.visible = true
    },
    initData() {
      let that = this
      let queue = []

      if (that.isAdd) {
        let { id, superiorId, menuName } = that.record.params
        that.detail = { permissionId:id, menuId:superiorId, permissionName: menuName }
      } else {
        
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
          } else {
            //values.id = that.record.params.id || 0
          }
          if (that.fileList.length > 0) {
            values.url = that.fileList[0].url
          }
          values.superiorId = that.detail.id
          //values.type = that.detail.type || that.record.params.type
          values.type = 2
          console.log('Received values of form: ', values)
          that.spinning = true

          return
          blueprintFileAdd(values)
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
      let fileList = [...info.fileList]
      fileList = fileList.map((file) => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList
    },
    doRemoveAction(key){
      let target = this.dataSource.find(item => item.key === key)
      if(target){
        this.fileList = this.fileList.filter(f => f.url !== target.__url)
      }
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
.custom-table-border tr td:nth-child(1) {
  text-align: center;
}
.custom-table-border >>> .ant-form-item {
  margin-bottom: 0;
}
</style>
