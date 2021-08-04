<template>
  <a-spin :spinning="spinning">
    <a-form-model ref="ruleForm" :model="form" :rules="rules" class="addform-wrapper">
      <div
        class="file-type-item"
        :class="{ 'file-type-item': true, 'hidden-content': !item.__show }"
        v-for="(item, idx) in typeListVoList"
        :key="idx"
      >
        <a-spin :spinning="item.__spinning">
          <div class="__hd">
            <span class="__hd_title">{{ getFileTypeName(item.fileType) }}</span>
            <div style="float: right" class="__hd_title-actions">
              <template v-if="!isDisabled">
                <template v-if="item.authorityVo && +item.authorityVo.uploadAuthority === 1">
                  <template v-if="item.fileType === 1"> </template>
                  <template v-else-if="item.fileType === 3">
                    <UploadBom ref="uploadFile-items" :fileType="item.fileType"  :status="11" @change="(data) => fileBomChange(item, data)" />
                    <a-divider type="vertical" />
                  </template>
                  <template v-else>
                    <UploadFile
                      ref="uploadFile-items"
                      :fileType="item.fileType"
                      :config="uploadFileConfig"
                      @change="(files) => fileChange(item, files)"
                    />
                    <a-divider type="vertical" />
                  </template>
                </template>
              </template>
              <a-button type="link" @click="() => fileTypeToggle(item)">{{ item.__show ? '隐藏' : '显示' }}</a-button>
            </div>
          </div>
          <!-- <template v-if="+item.fileType === 1">
            <a-form-model-item  label="产品预估价" prop="predictPrice">
              <a-input-number
                v-model="form.predictPrice"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </a-form-model-item>
          </template>
          <template v-else> -->
          <div class="__bd" v-for="(dep, depIdx) in item.departmentVoList" :key="depIdx">
            <div>{{ dep.departmentName }}</div>
            <a-table
              :columns="item.fileType === 1 ? columnsPredictPrice : columns"
              :dataSource="dep.personApplyDetailVoList.filter((f) => !f.__del)"
              :pagination="false"
              size="small"
            >
              <div slot="predictPrice" slot-scope="text, record, index">
                <template v-if="!isDisabled && (+record.updateAuthority === 1 || (item.authorityVo && +item.authorityVo.uploadAuthority === 1))">
                  <a-input-number
                    :value="record.predictPrice"
                    :min="0"
                    :precision="2"
                    style="width: 100%"
                    @change="(v) => predictPriceChange(v, idx, record)"
                  />
                </template>
                <template v-else>{{ record.predictPrice | moneyFormatNumber }}</template>
              </div>

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
                <div class="__btns-action-wrapper">
                  <template v-if="!isDisabled">
                    <template v-if="record.findAuthority === 1 || record.__add">
                      <a href="javascript:void(0);" @click="doAction('view', idx, record)">查看</a>
                      <a href="javascript:void(0);" v-download="record.fileUrl">下载</a>
                    </template>

                    <template v-if="record.removeAuthority === 1 || record.__add">
                      <a href="javascript:void(0);" @click="doAction('del', idx, record)">删除</a>
                    </template>

                    <template v-if="item.fileType === 3 && (record.updateAuthority === 1 || record.__add)">
                      <a href="javascript:void(0);" @click="doAction('edit', idx, record)">修改</a>
                    </template>

                  </template>
                  <template v-else>
                    <a href="javascript:void(0);" @click="doAction('view', idx, record)">查看</a>
                  </template>
                </div>
              </div>
            </a-table>
          </div>
          <!-- </template> -->
        </a-spin>
      </div>

      <p class="btn-action-wrapper">
        <template v-if="!isDisabled">
          <a-button type="primary" v-if="+queryOneData.approvePersonButtonFlag === 1" @click="handleSubmit(1)">保存</a-button>
          <a-button v-if="+queryOneData.approvePersonButtonFlag === 1" type="primary" @click="handleSubmit(2)"
            >个人资料提交审核</a-button
          >
          <a-button v-if="+queryOneData.approveDepartmentButtonFlag === 1" type="primary" @click="handleSubmit(3)"
            >部门资料提交审核</a-button
          >
          <a-button v-if="+queryOneData.finishStageButtonFlag === 1" type="danger" @click="handleSubmit(4)"
            >完结当前节点</a-button
          >
        </template>
        <a-button @click="handleSubmit(5)">取消</a-button>
        <a-button
          key="back"
          icon="close"
          style="margin-right: 10px"
          v-if="normalAddForm.isApproval"
          @click="noPassAction"
          >不通过</a-button
        >
        <a-button
          v-if="normalAddForm.isApproval"
          key="submit"
          type="primary"
          icon="check"
          :loading="spinning"
          @click="passAction"
          >通过</a-button
        >
        <template
          v-if="
            (normalAddForm.record.status === 3 || normalAddForm.record.status === 11) &&
            normalAddForm.record.approveStatus === 2 &&
            normalAddForm.record.audit === 2
          "
        >
          <a-popconfirm title="确认是否反审核吗?" @confirm="() => toAdd(normalAddForm.record)">
            <a-button type="primary">反审核</a-button>
          </a-popconfirm>
        </template>
      </p>
      <XdocView ref="xdocView" />
      <BomForm ref="bomForm" :status="11" @change="bomEditChange" />
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-form-model>
  </a-spin>
</template>
<script>
import moment from 'moment'
import UploadFile from './UploadFile'
import UploadBom from './UploadBom'
import BomForm from './BomForm'
import XdocView from './XdocView'
import Approval from './Approval'
import {
  uploadFileTrailConfPerson_11,
  uploadFileTrailConfDepartment_11,
  finishGatherFileStage_11,
  getMaterialFormDetail11 as customGetMaterialFormDetail,
} from '@/api/researchManagementByWzz'
import { approveProjectStageApply, reverseAudit } from '@/api/projectManagement'
function uuid() {
  return Math.random().toString(32).slice(-10)
}

//2、 资料归档 3、 bom清单 4、 2d图纸 5、 3d图纸 6、可行性功能测试点 7、 产品标志与配色方案 8、配置方案
const fileTypes = [
  '',
  '产品预估价',
  '资料归档',
  'bom清单',
  '2d图纸',
  '3d图纸',
  '可行性功能测试点',
  '产品标志与配色方案',
  '配置方案',
]

const columns = [
  {
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '资料名称',
    dataIndex: 'fileUrl',
    scopedSlots: { customRender: 'fileUrl' },
    width: '500px',
  },
  {
    title: '提交人',
    dataIndex: 'userName',
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime',
  },
  {
    title: '审批状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]

const columnsPredictPrice = [
  {
    title: '产品预估价',
    width: '570px',
    dataIndex: 'predictPrice',
    scopedSlots: { customRender: 'predictPrice' },
  },
  {
    title: '提交人',
    dataIndex: 'userName',
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime',
  },
]

export default {
  inject: ['normalAddForm'],
  components: {
    UploadFile,
    XdocView,
    UploadBom,
    BomForm,
    Approval,
  },
  data() {
    return {
      visible: false,
      spinning: false,
      columns,
      columnsPredictPrice,
      form: {},
      rules: {},
      queryOneData: {}, // currUserType
      userList: [],
      uploadFileConfig: {
        multiple: true,
        maxFileCount: 100,
        btnTxt: '上传',
        fileType: 'file', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: false,
        fileValidate: () => true,
      },
      uploadImageConfig: {
        maxFileCount: 100,
        btnTxt: '上传',
        fileType: 'img', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: false,
        fileValidate: () => true,
      },
      typeListVoList: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {
    isDisabled() {
      //设计方案联合评审
      return (
        this.normalAddForm.isView ||
        this.normalAddForm.isApproval ||
        (this.normalAddForm.isHandle && this.normalAddForm.status !== 11)
      )
    },
  },
  watch: {
    'normalAddForm.Process11Data': function (newVal, oldVal) {
      console.log(newVal, oldVal)
      const that = this
      if (newVal) {
        that.queryOneData = newVal
        that.typeListVoList = newVal.typeListVoList.map((item) => {
          item.__show = true

          item.__spinning = false
          item.departmentVoList = item.departmentVoList.map((dep) => {
            //没有数据，有新增权限，默认添加一条空数据
            if (
              item.fileType === 1 &&
              ((Array.isArray(dep.personApplyDetailVoList) && dep.personApplyDetailVoList.length === 0) ||
                dep.personApplyDetailVoList === null) &&
              item.authorityVo &&
              item.authorityVo.uploadAuthority === 1
            ) {
              //产品预估价
              let __uuid = uuid()
              let __attrs = {
                key: __uuid,
                uid: __uuid,
                __add: true,
                __del: false,
                __edit: false,
              }
              dep.personApplyDetailVoList = [
                {
                  ...__attrs,
                  id: undefined,
                  fileType: 1,
                  operationStatus: 1,
                  predictPrice: undefined,
                  userName:that.userInfo.trueName,
                  createdTime:moment().format('YYYY-MM-DD HH:mm:ss')
                },
              ]
            } else {
              dep.personApplyDetailVoList = Array.isArray(dep.personApplyDetailVoList)
                ? dep.personApplyDetailVoList.map((f) => {
                    f.key = f.uid = uuid()
                    f.__add = false
                    f.__del = false
                    f.__edit = false
                    return f
                  })
                : []
            }
            return dep
          })
          //fileUrl
          return item
        })
        that.init()
      }
    },
  },
  methods: {
    toAdd(record) {
      reverseAudit(`serviceId=${record.serviceId}&&stageNum=${record.status}`)
        .then((res) => {
          if (res.code === 200) {
            this.$message.info(res.msg)
            this.$router.go(-1)
          }
        })
        .catch((err) => this.$message.info(err))
    },
    async init() {
      const that = this
      // that.spinning = true
      if (!('typeListVoList' in that.queryOneData)) {
        return
      }

      that.$nextTick(() => {
        let instance = that.$refs['uploadFile-items']
        that.typeListVoList.map((item, idx) => {
          if (item.fileType > 1) {
            let arr = []
            item.departmentVoList.map((dep) => {
              dep.personApplyDetailVoList.map((f) => {
                arr.push({
                  uid: f.uid,
                  name: that.getFileName(f.fileUrl),
                  url: f.fileUrl,
                })
              })
            })
            if (arr.length > 0 && instance) {
              let targetRef = instance.find(r => r.$attrs.fileType === item.fileType)
              targetRef && targetRef.setFiles && targetRef.setFiles(arr)
            }
          }
        })
      })

      // setTimeout(function () {
      //   that.spinning = false
      // }, 1500)
    },
    getFileTypeName(type) {
      return fileTypes[type]
    },
    handleSubmit(operationStatus) {
      const that = this
      that.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let api = {
            1: uploadFileTrailConfPerson_11, //个人保存
            2: uploadFileTrailConfPerson_11, //个人提交审批
            3: uploadFileTrailConfDepartment_11, //部门提交审批
            4: finishGatherFileStage_11, //完结
          }
          let params = {}

          if (operationStatus === 5) {
            //取消
            that.$router.go(-1)
            return
          }

          try {
            if (operationStatus === 1 || operationStatus === 2) {
              let files = []
              that.typeListVoList.map((item) => {
                item.departmentVoList.map((d) => {
                  d.personApplyDetailVoList
                    .filter((f) => f.__add || f.__edit || f.__del)
                    .map((f) => {
                      let __item = {
                        fileType: item.fileType,
                        fileUrl: f.fileUrl,
                        createdTime:
                          f.createdTime instanceof moment ? f.createdTime.format('YYYY-MM-DD HH:mm:ss') : f.createdTime,
                        predictPrice: 0,
                        id: f.id,
                        status: f.status,
                        operationStatus: f.__del ? 3 : f.__edit ? 2 : f.__add ? 1 : '',
                      }
                      if (item.fileType === 3) {
                        //bom
                        __item.materialForm = f.__bomData
                        __item.bomId = 1
                        __item.bomMaterialCode = f.fileUrl
                      } else if (item.fileType === 1) {
                        //产品预估价
                        __item.predictPrice = f.predictPrice
                      }
                      files.push(__item)
                    })
                })
              })
              params = {
                projectId: that.normalAddForm.record.id,
                operationStatus: operationStatus,
                confUploadDetailBoList: files,
              }
            } else {
              params = `projectId=${that.normalAddForm.record.id} `
            }
          } catch (err) {
            console.log(err)
          }

          that.spinning = true
          api[operationStatus](params)
            .then((res) => {
              that.spinning = false
              that.$message.info(res.msg)
              if(+res.code === 200){
                that.$router.go(-1)
              }
            })
            .catch((err) => {
              that.$message.info(err)
              that.spinning = false
            })
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
    fileTypeToggle(record) {
      const that = this
      let typeListVoList = [...that.typeListVoList]
      let target = typeListVoList.find((item) => item.fileType === record.fileType)
      if (target) {
        target.__show = !target.__show
        that.typeListVoList = typeListVoList
      }
    },
    fileChange(record, fileList) {
      const that = this
      let typeListVoList = [...that.typeListVoList]
      let target = typeListVoList.find((item) => item.fileType === record.fileType)
      if (!target) {
        return
      }
      if (target.__spinning === false) {
        target.__spinning = true
        that.typeListVoList = typeListVoList
      }
      if (!fileList.every((f) => f.url)) {
        return
      }
      target.__spinning = false
      let departmentVoList = target.departmentVoList
      let departmentId = that.userInfo.departmentId

      let targetDepartment = target.departmentVoList.find((dep) => dep.departmentId === departmentId)
      if (targetDepartment) {
        let uids = targetDepartment.personApplyDetailVoList.map((f) => f.uid)
        let files = fileList.filter((f) => !uids.includes(f.uid))
        targetDepartment.personApplyDetailVoList = [
          ...targetDepartment.personApplyDetailVoList,
          ...files.map((f) => {
            return {
              key: f.uid,
              uid: f.uid,
              fileUrl: f.url,
              userName: that.userInfo.trueName,
              createdTime: moment().format('YYYY-MM-DD HH:mm:ss'),
              status: 0,
              __add: true,
            }
          }),
        ]
      }
      that.typeListVoList = typeListVoList
    },
    fileBomChange(record, bomData) {
      const that = this
      let __bomData = that.formatBom(bomData)
      let typeListVoList = [...that.typeListVoList]
      let target = typeListVoList.find((item) => item.fileType === record.fileType)
      let departmentId = that.userInfo.departmentId
      let targetDepartment = target.departmentVoList.find((dep) => dep.departmentId === departmentId)
      let _uuid = uuid()
      targetDepartment.personApplyDetailVoList = [
        ...targetDepartment.personApplyDetailVoList,
        {
          key: _uuid,
          uid: _uuid,
          fileUrl: bomData.materialCode,
          userName: that.userInfo.trueName,
          createdTime: bomData.createdTime,
          status: 0,
          fileType: 3,
          __add: true,
          __bomData: { ...__bomData },
        },
      ]
    },
    getFileStatus(type) {
      let m = {
        //文件的审批状态：1、待审批 2、通过 3、不通过 4 已撤回，默认为0
        0: '待提交',
        1: '待审批',
        2: '通过',
        3: '不通过',
        4: '已撤回',
      }
      return m[type] || `未知状态:${type}`
    },
    getFileName(url) {
      let arr = String(decodeURIComponent(url)).split('/')
      return arr[arr.length - 1]
    },
    async doAction(type, idx, record) {
      const that = this
      let typeListVoList = [...that.typeListVoList]
      let target = typeListVoList[idx]
      let isBom = target.fileType === 3
      if (isBom && !record.__bomData) {
        record.__bomData = await customGetMaterialFormDetail({ id: record.bomId })
          .then((res) => {
            const data = res.data
            data.formChildDetailList = data.detailListVo.map((item) => {
              return Object.assign({}, item, { key: uuid() })
            })
            return res.data
          })
          .catch((err) => {
            that.$message.error(err)
            return null
          })
      }

      if (type === 'view') {
        if (target.fileType === 3) {
          //bom查看
          let bomData = { ...record.__bomData, id: record.bomId }
          bomData.groupName = that.normalAddForm.allInfo.materialCode
          that.$refs.bomForm.query(type, bomData)
          return
        } else {
          that.$refs.xdocView.query(record.fileUrl)
          return
        }
      } else if (type === 'del') {
        let typeListVoList = [...that.typeListVoList]
        let target = typeListVoList[idx]
        target.departmentVoList.map((dep) => {
          let f = dep.personApplyDetailVoList.find((f) => f.uid === record.uid)
          if (isBom && !f.__bomData) {
            f.__bomData = record.__bomData
          }
          f.__del = true
          dep.personApplyDetailVoList = [...dep.personApplyDetailVoList.filter((f) => f.uid !== record.uid), f]
        })
        that.typeListVoList = typeListVoList
        that.$refs['uploadFile-items'][idx].delFiles && that.$refs['uploadFile-items'][idx].delFiles([record.uid])
      } else if (type === 'edit') {
        //bom修改
        let typeListVoList = [...that.typeListVoList]
        let target = typeListVoList[idx]
        let bomData = { ...record.__bomData, id: record.bomId }
        bomData.groupName = that.normalAddForm.allInfo.materialCode
        that.$refs.bomForm.query(type, bomData, { idx, record })
        return
      }
    },
    bomEditChange({ bomData, extendsParams }) {
      const that = this
      let { idx, record } = extendsParams
      let typeListVoList = [...that.typeListVoList]
      let target = typeListVoList[idx]
      let departmentId = that.userInfo.departmentId
      let targetDepartment = target.departmentVoList.find((dep) => dep.departmentId === departmentId)

      let bom = targetDepartment.personApplyDetailVoList.find((b) => b.uid === record.uid)
      bom.__bomData = bomData
      if (bom.id) {
        bom.__edit = true
      }
      that.typeListVoList = typeListVoList
    },
    formatBom(bomData) {
      let __bomData = { ...bomData }
      __bomData.useStatus = 0
      __bomData.yield = 100
      delete __bomData.id
      delete __bomData.instanceId
      delete __bomData.craftId

      __bomData.formChildDetailList = __bomData.formChildDetailList.map((item) => {
        item.modelType = item.modelType.replace(/[\s,\\n]/, '')
        return item
      })
      return __bomData
    },
    predictPriceChange(v, idx, record) {
      const that = this
      let typeListVoList = [...that.typeListVoList]
      let target = typeListVoList[idx]
      target.departmentVoList.map((dep) => {
        let f = dep.personApplyDetailVoList.find((f) => f.uid === record.uid)
        if(f){
          f.__edit = true
          f.predictPrice = v
          dep.personApplyDetailVoList = [...dep.personApplyDetailVoList.filter((f) => f.uid !== record.uid), f]
        }
      })
      that.typeListVoList = typeListVoList
    },

    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, {
        projectId: that.normalAddForm.record.projectId,
        id: that.normalAddForm.record.id,
        serviceId: that.normalAddForm.record.serviceId,
        stageNum: that.normalAddForm.record.status,
        stageType: that.normalAddForm.record.stageType,
      })
      that.spinning = true
      approveProjectStageApply(values)
        .then((res) => {
          if (res.code === 200) {
            that.$message.info(res.msg)
            that.$router.go(-1)
          } else {
            that.$message.error(res.msg)
          }
        })
        .catch((err) => (that.spinning = false))
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
.custom-table-border caption {
  text-align: left;
  font-size: 100%;
}

.file-type-item {
  transition: all 0.2s;
  padding: 20px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 3px 6px #eee;
  margin-bottom: 20px;
}
.__hd {
  overflow: hidden;
}
.__hd_title {
  font-size: 16px;
}
.__hd_title-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: normal;
}
.file-type-item.hidden-content {
  height: 58px;
  overflow: hidden;
}
.btn-action-wrapper {
  text-align: center;
}
.btn-action-wrapper .ant-btn {
  margin: 5px;
}

.__btns-action-wrapper > a{
  margin: 0 7px;
}
</style>


