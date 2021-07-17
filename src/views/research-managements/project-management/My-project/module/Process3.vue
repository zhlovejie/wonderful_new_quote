<template>
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="addform-wrapper"
      >

        <div class="file-type-item" :class="{'file-type-item':true,'hidden-content':!item.__show}" v-for="(item,idx) in typeListVoList" :key="idx">
          <a-spin :spinning="item.__spinning">
          <div class="__hd">
            <span class="__hd_title">{{getFileTypeName(item.fileType)}}</span>
            <div style="float:right;" class="__hd_title-actions">
              <template v-if="item.fileType === 3">
                <UploadBom ref="uploadFile-items" @change="data => fileBomChange(item,data)" />
              </template>
              <template v-else>
                <UploadFile ref="uploadFile-items" :config="uploadFileConfig" @change="files => fileChange(item,files)" />
              </template>
              <a-divider type="vertical" />
              <a-button type="link" @click="() => fileTypeToggle(item)">{{item.__show ? '隐藏' : '显示'}}</a-button>
            </div>
          </div>
          <div class="__bd" v-for="(dep,depIdx) in item.departmentVoList" key="depIdx">
            <div>{{dep.departmentName}}</div>
            <a-table
              :columns="columns"
              :dataSource="dep.personApplyDetailVoList.filter(f => !f.__del)"
              :pagination="false"
              size="small"
            >
              <div slot="order" slot-scope="text, record, index">
                <span>{{ index + 1 }}</span>
              </div>
              <div slot="fileUrl" slot-scope="text, record, index">
                <span>{{ getFileName(text) }}</span>
              </div>

              <div slot="status" slot-scope="text, record, index">
                <span>{{ getFileStatus(text || 0) }}</span>
              </div>

              <div slot="action" slot-scope="text, record">
                <a href="javascript:void(0);" @click="doAction('view',idx,record)">查看</a>
                <template v-if="item.fileType === 3">
                  <a-divider type="vertical" />
                  <a href="javascript:void(0);" @click="doAction('edit',idx,record)">修改</a>
                </template>
                <a-divider type="vertical" />
                <a href="javascript:void(0);" @click="doAction('del',idx,record)">删除</a>
                <a-divider type="vertical" />
                <a href="javascript:void(0);" v-download="record.fileUrl" >下载</a>
              </div>
            </a-table>
          </div>
          </a-spin>
        </div>

        <p class="btn-action-wrapper">
          <a-button type="primary" @click="handleSubmit(1)">保存</a-button>
          <a-button v-if="+queryOneData.approvePersonButtonFlag === 1" type="primary" @click="handleSubmit(2)">个人资料提交审核</a-button>
          <a-button v-if="+queryOneData.approveDepartmentButtonFlag === 1" type="primary" @click="handleSubmit(3)">部门资料提交审核</a-button>
          <a-button v-if="+queryOneData.finishStageButtonFlag === 1" type="danger" @click="handleSubmit(4)">完结当前节点</a-button>
          <a-button @click="handleSubmit(5)">取消</a-button>
        </p>
        <XdocView ref="xdocView" />
        <BomForm ref="bomForm" @change="bomEditChange"/>
      </a-form-model>
    </a-spin>
</template>
<script>
import moment from 'moment'
import UploadFile from './UploadFile'
import UploadBom from './UploadBom'
import BomForm from './BomForm'
import XdocView from './XdocView'
import {
  uploadFileTrailConfPerson,
  uploadFileTrailConfDepartment,
  finishTrailFileStage
} from '@/api/researchManagementByWzz'

function uuid() {
  return Math.random()
    .toString(32)
    .slice(-10)
}

//2、 资料归档 3、 bom清单 4、 2d图纸 5、 3d图纸 6、可行性功能测试点 7、 产品标志与配色方案 8、配置方案
const fileTypes = ['','产品预估价','资料归档','bom清单','2d图纸','3d图纸','可行性功能测试点','产品标志与配色方案','配置方案']

const columns = [
  {
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '资料名称',
    dataIndex: 'fileUrl',
    scopedSlots: { customRender: 'fileUrl' }
  },
  {
    title: '提交人',
    dataIndex: 'userName'
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    title: '审批状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  },
]

export default {
  inject: ['normalAddForm'],
  components: {
    UploadFile,XdocView,UploadBom,BomForm
  },
  data() {
    return {
      visible: false,
      spinning: false,
      columns,
      form: {},
      rules: {

      },
      queryOneData: {},// currUserType
      userList:[],
      optionsCheckbox:[
        { label: '查看/下载', value: 'findAuthority' },
        { label: '删除', value: 'removeAuthority' },
        { label: '修改', value: 'updateAuthority' },
        { label: '上传', value: 'uploadAuthority' },
      ],
      uploadFileConfig: {
        multiple:true,
        maxFileCount: 100,
        btnTxt: '上传',
        fileType: 'file', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: false,
        fileValidate: () => true
      },
      uploadImageConfig: {
        maxFileCount: 100,
        btnTxt: '上传',
        fileType: 'img', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: false,
        fileValidate: () => true
      },
      typeListVoList:[],
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  watch: {
    'normalAddForm.Process3Data': function (newVal, oldVal) {
      console.log(newVal, oldVal)
      if (newVal) {
        this.queryOneData = newVal
        this.typeListVoList = newVal.typeListVoList.map(item => {
          item.__show = true

          item.__spinning = false
          item.departmentVoList = item.departmentVoList.map(dep => {
            dep.personApplyDetailVoList = dep.personApplyDetailVoList.map(f => {
              f.key = f.uid = uuid()
              f.__add = false
              f.__del = false
              f.__edit = false
              return f
            })
            return dep
          })
          //fileUrl
          return item
        })
        this.init()
      }
    },
  },
  methods: {
    async init() {
      const that = this
      that.spinning = true
      if(!('typeListVoList' in that.queryOneData)){
        return
      }

      that.$nextTick(() => {
        that.typeListVoList.map((item,idx) => {
          let arr = []
          item.departmentVoList.map(dep => {
            dep.personApplyDetailVoList.map(f => {
              arr.push({
                uid:f.uid,
                name:that.getFileName(f.fileUrl),
                url:f.fileUrl
              })
            })
          })
          let instance = that.$refs['uploadFile-items']
          if(arr.length > 0 && instance ){
            instance[idx].setFiles && instance[idx].setFiles(arr)
          }
        })
      })

      setTimeout(function(){
        that.spinning = false
      },1500)
    },
    getFileTypeName(type){
      return fileTypes[type]
    },
    handleSubmit(operationStatus) {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {


          let api = {
            1:uploadFileTrailConfPerson, //个人保存
            2:uploadFileTrailConfPerson, //个人提交审批
            3:uploadFileTrailConfDepartment,//部门提交审批
            4:finishTrailFileStage //完结
          }
          let params = {}

          if(operationStatus === 5){ //取消
            that.$router.go(-1)
            return
          }

          if(operationStatus === 1 || operationStatus === 2){
            let files = []
            that.typeListVoList.map(item => {
                item.departmentVoList.map(d => {
                  d.personApplyDetailVoList.filter(f => f.__add || f.__edit || f.__del).map(f => {
                    let __item = {
                      fileType:item.fileType,
                      fileUrl:f.fileUrl,
                      createdTime:f.createdTime instanceof moment ? f.createdTime.format('YYYY-MM-DD HH:mm:ss') : f.createdTime,
                      predictPrice:item.predictPrice || 0,
                      id:f.id,
                      status:f.status,
                      operationStatus:f.__del ? 3 : f.__edit ? 2 : f.__add ? 1 : '',
                    }
                    if(item.fileType === 3){ //bom
                      __item.materialForm = f.__bomData
                      __item.bomId = 1
                      __item.bomMaterialCode = f.fileUrl
                    }
                    files.push(__item)
                  })
                })
              })
            params = {
              projectId: that.normalAddForm.record.id,
              operationStatus:operationStatus,
              confUploadDetailBoList:files
            }
          }else{
            params = {
              projectId: that.normalAddForm.record.id,
            }
          }

          that.spinning = true
          api[operationStatus](params)
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              that.$router.go(-1)
            })
            .catch(err => (that.spinning = false))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      const that = this
      that.$refs.ruleForm.resetFields()
      that.form = {}
      that.$nextTick(() => (that.visible = false))
    },
    fileTypeToggle(record){
      const that = this
      let typeListVoList = [...that.typeListVoList]
      let target = typeListVoList.find(item => item.fileType === record.fileType)
      if(target){
        target.__show = !target.__show
        that.typeListVoList = typeListVoList
      }
    },
    fileChange(record,fileList){
      const that = this
      let typeListVoList = [...that.typeListVoList]
      let target = typeListVoList.find(item => item.fileType === record.fileType)
      if(!target){
        return
      }
      if(target.__spinning === false){
        target.__spinning = true
        that.typeListVoList = typeListVoList
      }
      if(!fileList.every(f => f.url)){
        return
      }
      target.__spinning = false
      let departmentVoList = target.departmentVoList
      let departmentId = that.userInfo.departmentId

      let targetDepartment = target.departmentVoList.find(dep => dep.departmentId === departmentId)
      if(targetDepartment){
        let uids = targetDepartment.personApplyDetailVoList.map(f => f.uid)
        let files = fileList.filter(f => !uids.includes(f.uid))
        targetDepartment.personApplyDetailVoList = [
          ...targetDepartment.personApplyDetailVoList,
          ...files.map(f => {
            return {
              key:f.uid,
              uid:f.uid,
              fileUrl:f.url,
              userName:that.userInfo.trueName,
              createdTime:moment(f.lastModified),
              status:0,
              __add:true
            }
          })
        ]
      }
      that.typeListVoList = typeListVoList

    },
    fileBomChange(record,bomData){
      const that = this
      let __bomData = that.formatBom(bomData)
      let typeListVoList = [...that.typeListVoList]
      let target = typeListVoList.find(item => item.fileType === record.fileType)
      let departmentId = that.userInfo.departmentId
      let targetDepartment = target.departmentVoList.find(dep => dep.departmentId === departmentId)
      let _uuid = uuid()
      targetDepartment.personApplyDetailVoList = [
        ...targetDepartment.personApplyDetailVoList,
        {
          key:_uuid,
          uid:_uuid,
          fileUrl:bomData.materialCode,
          useName:bomData.useName,
          createdTime:bomData.useTime,
          status:0,
          fileType:3,
          __add:true,
          __bomData:{...__bomData}
        }
      ]
    },
    getFileStatus(type){
      let m = {
        //文件的审批状态：1、待审批 2、通过 3、不通过 4 已撤回，默认为0
        0:'待提交',
        1:'待审批',
        2:'通过',
        3:'不通过',
        4:'已撤回'
      }
      return m[type] || `未知状态:${type}`
    },
    getFileName(url){
      let arr = String(decodeURIComponent(url)).split('/')
      return arr[arr.length - 1]
    },
    doAction(type,idx,record){
      const that = this
      let typeListVoList = [...that.typeListVoList]
      let target = typeListVoList[idx]
      if(type === 'view'){
        if(target.fileType === 3){ //bom查看
          let bomData = {...record.__bomData}
          bomData.groupName = that.normalAddForm.allInfo.materialCode
          that.$refs.bomForm.query(type,bomData)
          return
        }else{
          that.$refs.xdocView.query(record.fileUrl)
          return
        }
      }else if(type === 'del'){
        let typeListVoList = [...that.typeListVoList]
        let target = typeListVoList[idx]
        target.departmentVoList.map(dep => {
          let f = dep.personApplyDetailVoList.find(f => f.uid === record.uid)
          f.__del = true
          dep.personApplyDetailVoList = [
            ...dep.personApplyDetailVoList.filter(f => f.uid !== record.uid),
            f
          ]
        })
        that.typeListVoList = typeListVoList
        that.$refs['uploadFile-items'][idx].delFiles && that.$refs['uploadFile-items'][idx].delFiles([record.uid])
      }else if(type === 'edit'){ //bom修改
        let typeListVoList = [...that.typeListVoList]
        let target = typeListVoList[idx]
        let bomData = {...record.__bomData}
        bomData.groupName = that.normalAddForm.allInfo.materialCode
        that.$refs.bomForm.query(type,bomData,{idx,record})
        return
      }
    },
    bomEditChange({bomData,extendsParams}){
      const that = this
      let {idx,record} = extendsParams
      let typeListVoList = [...that.typeListVoList]
      let target = typeListVoList[idx]
      let departmentId = that.userInfo.departmentId
      let targetDepartment = target.departmentVoList.find(dep => dep.departmentId === departmentId)

      let bom = targetDepartment.personApplyDetailVoList.find(b => b.uid === record.uid)
      bom.__bomData = bomData
      if(bom.id){
        bom.__edit = true
      }
      that.typeListVoList = typeListVoList
    },
    formatBom(bomData){
      let __bomData = {...bomData}
      __bomData.useStatus = 0
      __bomData.yield = 100
      delete __bomData.id
      delete __bomData.instanceId
      delete __bomData.craftId

      __bomData.formChildDetailList = __bomData.formChildDetailList.map(item => {
        item.modelType = item.modelType.replace(/[\s,\\n]/,'')
        return item
      })
      return __bomData
    }
  }
}
</script>

<style scoped>

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
.custom-table-border caption{
  text-align: left;
  font-size: 100%;
}

.file-type-item{
  transition: all .2s;
  padding: 20px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 3px 6px #eee;
  margin-bottom: 20px;
}
.__hd{
  overflow: hidden;
}
.__hd_title{
  font-size: 16px;
}
.__hd_title-actions{
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: normal;
}
.file-type-item.hidden-content{
  height: 58px;
  overflow: hidden;
}
.btn-action-wrapper{
  text-align: center;
}
.btn-action-wrapper .ant-btn{
  margin: 5px;
}
</style>


