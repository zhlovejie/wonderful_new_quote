<template>
  <a-modal
    :title="modalTitle"
    :width="1050"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="addform-wrapper"
      >
        <div class="__hd">项目信息详情</div>
        <div class="__bd">

          <table class="custom-table custom-table-border">
            <tbody>
              <tr>
                <td style="width:150px;">
                  <span class="icon-required">项目开发模式</span>
                </td>
                <td>
                  <a-form-model-item prop="modelType">
                    <a-select
                      v-if="!isDisabled"
                      v-model="form.modelType"
                      style="width:100%;"
                    >
                      <a-select-option
                        v-for="item in projectDevelopmentModes"
                        :value="item.id"
                        :key="item.id"
                      >{{item.text}}</a-select-option>
                    </a-select>
                    <span v-else>{{getModelType(form.modelType)}}</span>
                  </a-form-model-item>
                </td>
                <td style="width:150px;">
                  <span class="icon-required">
                    {{ [1,2].includes(form.modelType) ? '产品型号' : '现产品型号' }}
                  </span>
                </td>
                <td>
                  <a-form-model-item prop="materialCode">
                    <a-select
                      v-if="!isDisabled"
                      show-search
                      :value="form.materialCode"
                      placeholder="模糊搜索"
                      style="width: 100%"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="bomFuzzySearch.fetching ? undefined : '未找到匹配项'"
                      @search="bomFuzzyAction"
                      @change="bomFuzzyHandleChange"
                    >
                      <a-spin
                        v-if="bomFuzzySearch.fetching"
                        slot="notFoundContent"
                        size="small"
                      />
                      <a-select-option
                        v-for="item in bomFuzzySearch.list"
                        :key="item.__key"
                        :value="item.__key"
                      >
                        {{ item.__label }}
                      </a-select-option>
                    </a-select>
                    <span v-else>{{form.materialCode}}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <template v-if="[3,4].includes(form.modelType)">
              <tr>
                <td style="width:150px;">
                  <span class="icon-required">
                    {{ '原产品型号' }}
                  </span>
                </td>
                <td colspan="3">
                  <a-form-model-item prop="oldMaterialCode">

                    <a-select
                      v-if="!isDisabled"
                      show-search
                      :value="form.oldMaterialCode"
                      placeholder="模糊搜索"
                      style="width: 100%"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="bomFuzzySearch.fetching ? undefined : '未找到匹配项'"
                      @search="bomFuzzyAction"
                      @change="bomFuzzyHandleChange1"
                    >
                      <a-spin
                        v-if="bomFuzzySearch.fetching"
                        slot="notFoundContent"
                        size="small"
                      />
                      <a-select-option
                        v-for="item in bomFuzzySearch.list"
                        :key="item.__key"
                        :value="item.__key"
                      >
                        {{ item.__label }}
                      </a-select-option>
                    </a-select>
                    <span v-else>{{form.materialCode}}</span>
                  </a-form-model-item>
                </td>
              </tr>
              </template>



              <tr>
                <td style="width:150px;">
                  <span class="icon-required">项目编号</span>
                </td>
                <td>
                  <a-form-model-item>
                    <span>{{form.projectCode}}</span>
                  </a-form-model-item>
                </td>
                <td style="width:150px;">
                  <span class="icon-required">项目名称</span>
                </td>
                <td>
                  <a-form-model-item prop="projectName">
                    <a-input v-if="!isDisabled" v-model="form.projectName" />
                    <span v-else>{{form.projectName}}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td style="width:150px;">
                  <span class="icon-required">项目总负责人</span>
                </td>
                <td>
                  <a-form-model-item prop="chargeUserId">
                    <DepUserSelect
                      v-if="!isDisabled"
                      @change="(...args) => depUserChange('charge',...args)"
                      :depId="form.chargeDepartmentId"
                      :userId="form.chargeUserId"
                    />
                    <span v-else>{{form.chargeDepartmentName}}-{{form.chargeUserName}}</span>
                  </a-form-model-item>
                </td>
                <td style="width:150px;">
                  <span class="icon-required">研发总监</span>
                </td>
                <td>
                  <a-form-model-item prop="inspectorUserId">
                    <DepUserSelect
                      v-if="!isDisabled"
                      @change="(...args) => depUserChange('inspector',...args)"
                      :depId="form.inspectorDepartmentId"
                      :userId="form.inspectorUserId"
                    />
                    <span v-else>{{form.inspectorDepartmentName}}-{{form.inspectorUserName}}</span>
                  </a-form-model-item>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="__hd">项目需求</div>
        <div class="__bd">
          <a-form-model-item
            label="需求描述"
            prop="demandDesc"
          >
            <a-input
              v-if="!isDisabled"
              v-model="form.demandDesc"
              type="textarea"
            />
            <span v-else>{{form.demandDesc}}</span>
          </a-form-model-item>

          <a-form-model-item
            label="配置方案"
            prop="confScheme"
          >
            <a-input
              v-if="!isDisabled"
              v-model="form.confScheme"
              type="textarea"
            />
            <span v-else>{{form.confScheme}}</span>
          </a-form-model-item>
        </div>
        <div class="__hd">
          <span class="icon-required">项目文件</span>
        </div>
        <div class="__bd">
          <Files ref="files" :disabled="isDisabled" @change="(files) => uploadChange(1,files)"/>
        </div>

        <div class="__hd">
          <span class="icon-required">项目图片</span>
        </div>
        <div class="__bd">
          <UploadFile
            ref="uploadFile"
            :disabled="isDisabled"
            :config="uploadConfig3"
            @change="(files) => uploadChange(2,files)"
          />
        </div>

        <template v-if="isView && form.projectStartJoinMap">
          <div class="__hd">项目成员</div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <th>部门</th>
                <th>人员</th>
              </tr>
              <tr v-for="(k,v) in form.projectStartJoinMap">
                <td>{{v}}</td>
                <td>{{k.map(u => u.userName).join(',')}}</td>
              </tr>
            </table>
          </div>
        </template>

        <template v-if="isEditUsers && form.projectStartJoinMap">
          <div class="__hd">
            <span>项目组成员</span>
            <a-button
              type="link"
              style="float:right;"
              @click="personListAction('add',null)"
            >新增</a-button>
          </div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <th>部门</th>
                <th>人员</th>
                <th>操作</th>
              </tr>
              <tr
                v-for="person in personBoList"
                :key="person.key"
              >
                <td style="width:200px;">
                  <a-select
                    :value="person.selectDep ? person.selectDep.id : undefined"
                    :disabled="!!person.disabled"
                    style="width:100%;"
                    placeholder="选择部门"
                    @change="e => depChangeHandler(e,person)"
                  >
                    <a-select-option
                      v-for="item in person.depList"
                      :key="item.id"
                      :value="item.id"
                    >{{item.departmentName}}</a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-select
                    :value="person.selectUsers ? person.selectUsers.map(u => u.id) : []"
                    :disabled="!!person.disabled"
                    style="width:100%;"
                    placeholder="选择人员"
                    mode="multiple"
                    @change="e => userChangeHandler(e,person)"
                  >
                    <a-select-option
                      v-for="item in person.userList"
                      :key="item.id"
                      :value="item.id"
                    >{{item.trueName}}</a-select-option>
                  </a-select>
                </td>
                <td style="width:100px;">
                  <a-button :disabled="!!person.disabled" @click="personListAction('del',person)">删除</a-button>
                </td>
              </tr>
            </table>
          </div>
        </template>



      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import moment from 'moment'
import { productMaterialInfoPageList } from '@/api/routineMaterial'

import {
  listProjectAllDetail,
  listProjectAllAdd,
  listProjectAllUpdate ,
  addProjectAllJoin
} from '@/api/researchManagementByWzz'

import DepUserSelect from '@/components/CustomerList/DepUserSelect'
import UploadFile from './UploadFile'
import Files from './Files'

import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'


function uuid() {
  return Math.random()
    .toString(16)
    .slice(2)
}

function makeProjectDevelopmentMode() {
  const arr = ['全部', '自主研发新产品', '客户定制新产品', '产品研发改进', '非常规产品开发']
  return arr
    .map((v, idx) => {
      return { id: idx, text: v }
    })
    .filter(item => item.id > 0)
}

export default {
  name: 'project-management-Project-list_AddForm',
  components: {
    DepUserSelect,
    UploadFile,
    Files
  },
  data() {
    this.bomFuzzyAction = this.$_.debounce(this.bomFuzzyAction, 800)
    return {
      projectDevelopmentModes: Object.freeze(makeProjectDevelopmentMode()),
      bomFuzzySearch: {
        list: [],
        item: {},
        fetching: false
      },
      type: 'add',
      visible: false,
      spinning: false,
      form: {
        modelType: 1
      },
      rules: {
        modelType: [{ required: true, message: '请选择项目开发模式' }],
        materialCode: [{ required: true, message: '请输入产品型号' }],
        oldMaterialCode: [{ required: true, message: '请输入原产品型号' }],
        projectName: [{ required: true, message: '请输入项目名称' }],
        chargeUserId:[{ required: true, message: '请选择项目总负责人' }],
        inspectorUserId:[{ required: true, message: '请选择研发总监' }],
        demandDesc:[{ required: true, message: '请输入项目需求描述' }],
        confScheme:[{ required: true, message: '请输入项目配置方案' }],
      },
      uploadConfig3: {
        maxFileCount: 3,
        fileType: 'img',
        enablePreview: true
      },
      fileAddBoList:[],

      personBoList: [],
      depList: []
    }
  },
  created() {},
  computed: {
    modalTitle() {
      const type = this.type
      return type === 'add' ? '新增' : type === 'edit' ? '修改' : type === 'view' ? '查看' : '未知'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit' && +this.form.status === 1
    },
    isView() {
      return this.type === 'view'
    },
    isDisabled(){
      return this.isView || this.isEditUsers
    },
    isEditUsers(){ // 只能修改参与人，不能修改项目其他内容
      return this.type === 'edit' && +this.form.status > 1
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true
      that.form = {
        modelType: 1
      }
      if (!this.isAdd) {
        that.spinning = true
        await listProjectAllDetail({ projectId: record.id })
          .then(res => {
            that.spinning = false
            let result = {...res.data}
            let {fileList,picList} = result

            that.fileAddBoList = [...fileList,...picList].map(f => {
              f.uid = f.id
              return f
            })

            that.$refs.files.setFiles(fileList.map(f => {
              let key = uuid()
              return {
                name:f.fileName,
                url:f.fileUrl,
                uid:key,
                key
              }
            }))
            that.$refs.uploadFile.setFiles(picList.map(f => {
              let key = uuid()
              return {
                name:f.fileName,
                url:f.fileUrl,
                uid:key,
                key
              }
            }))

            delete result.fileList
            delete result.picList

            that.form = result
          })
          .catch(err => {
            that.spinning = false
            console.log(err)

          })

        if(that.isEditUsers){ // 填充项目参与人员 ， 可修改
          that.spinning = true
          await that.initDepList()
          await that.fillUsers(that.form.projectStartJoinMap)
          that.spinning = false
        }
      }
    },
    doAction(type, item) {
      const that = this
      if (type === 'clearAll') {
        that.form = { ...that.form, stageList: [] }
      } else if (type === 'clear') {
        let stageList = [...that.form.stageList]
        stageList = stageList.filter(v => v !== item.id)
        that.form = { ...that.form, stageList }
      }
    },
    async handleSubmit() {
      const that = this
      if(that.isView){
        that.handleCancel()
        return
      }

      if(that.isEditUsers){
        let personBoList = that.personBoList.map(p => {
          return p.selectUsers.map(u => {
            return {
              departmentId:p.selectDep.id,
              departmentName:p.selectDep.departmentName,
              departmentType:p.selectDep.type,
              userId:u.id,
              userName:u.trueName
            }
          })
        })
        let others = {
          id:that.form.id,
          chargeDepartmentId:that.form.chargeDepartmentId,
          chargeDepartmentName:that.form.chargeDepartmentName,
          chargeUserId:that.form.chargeUserId,
          chargeUserName:that.form.chargeUserName,
          inspectorDepartmentId:that.form.inspectorDepartmentId,
          inspectorDepartmentName:that.form.inspectorDepartmentName,
          inspectorUserId:that.form.inspectorUserId,
          inspectorUserName:that.form.inspectorUserName,
          reviewTime:that.form.reviewTime,
          startTime:that.form.startTime
        }
        let params = {
          id:that.form.id,
          personBoList:personBoList.flat(Infinity),
          ...others
        }
        addProjectAllJoin(params).then(res => {
          that.spinning = true
          that.$message.info(res.msg)
          that.handleCancel()
        }).catch(err => {
          that.spinning = false
          that.$message.info(res.err)
        })
        return
      }


      let validated =  await that.formValidate()
      if(validated){
        let hasFiles = that.fileAddBoList.filter(f => +f.fileType === 1).length > 0
        let hasImgs = that.fileAddBoList.filter(f => +f.fileType === 2).length > 0
        if(!hasFiles){
          that.$message.info('请上传项目文件');
          return
        }
        if(!hasImgs){
          that.$message.info('请上传项目图片');
          return
        }

        const api = that.isAdd ? listProjectAllAdd : listProjectAllUpdate
        that.spinning = true
        let result = await api({ ...that.form ,fileAddBoList:that.fileAddBoList})
        .then(res => res)
        .catch(err => {
          console.log(err)
          return err
        })
        that.spinning = false
        if(result && result.code && result.msg){
          that.$message.info(result.msg)
          that.$emit('finish')

          if(that.isEdit){
            that.handleCancel()
            return
          }
          that.$confirm({
            title: '发起会议',
            content: '是否需要发起会议？',
            onOk() {
              that.handleCancel()
              that.$nextTick(() => {
                that.$router.push({ name: 'meetingManagementRecords' })
              })
            },
            onCancel() {
              that.handleCancel()
            },
          });
        }else{
          that.$message.info(result)
        }
      }else{

      }
      // that.$refs.ruleForm.validate(valid => {
      //   if (valid) {
      //     const api = that.isAdd ? listProjectAllAdd : listProjectAllUpdate
      //     that.spinning = true
      //     api({ ...that.form ,fileAddBoList:that.fileAddBoList})
      //       .then(res => {
      //         that.spinning = false
      //         that.$message.info(res.msg)
      //         that.$emit('finish')
      //         that.handleCancel()
      //       })
      //       .catch(err => (that.spinning = false))
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    formValidate(){
      const that = this
      return new Promise((resolve,reject) => {
        that.$refs.ruleForm.validate(valid => {
          resolve(!!valid)
        })
      })
    },
    handleCancel() {
      const that = this
      that.$refs.ruleForm.resetFields()
      that.form = {}
      that.$nextTick(() => (that.visible = false))
    },
    getProjectCode(materialCode, modelType) {
      const that = this
      if (!(materialCode && modelType)) {
        return ''
      }
      //'自主研发新产品'1, '客户定制新产品'2, '产品研发改进'3, '非常规产品开发'4
      const suffix = { 1: 'Z', 2: 'K', 3: 'G', 4: 'F' }[modelType]
      return `${materialCode}${moment().format('YYYYMMDDSS')}${suffix}`
    },
    async bomFuzzyAction(wd) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 10,
        materialCode: wd
      }
      that.bomFuzzySearch = { ...that.bomFuzzySearch, fetching: true }
      const result = await productMaterialInfoPageList(_searchParam).then(res => {
        const records = res.data.records.map(item => {
          item.__key = uuid()
          item.__label = `${item.materialCode}(${item.materialName})`
          item.__value = item.materialCode
          return item
        })
        return records
      })
      that.bomFuzzySearch = { ...that.bomFuzzySearch, fetching: false, list: result }
    },
    bomFuzzyHandleChange(key) {
      const that = this
      const target = that.bomFuzzySearch.list.find(item => item.__key === key)
      that.form = {
        ...that.form,
        materialLibId: target.id,
        materialCode: target.materialCode,
        materialName: target.materialName,
        projectCode: that.getProjectCode(target.materialCode, that.form.modelType)
      }
      that.bomFuzzySearch = { ...that.bomFuzzySearch, item: target }
    },
    bomFuzzyHandleChange1(key) {
      const that = this
      const target = that.bomFuzzySearch.list.find(item => item.__key === key)
      that.form = {
        ...that.form,
        oldMaterialLibId: target.id,
        oldMaterialCode: target.materialCode,
        oldMaterialName: target.materialName,
      }
      that.bomFuzzySearch = { ...that.bomFuzzySearch, item: target }
    },
    depUserChange(type, depId, userId,targetDep,targetUser) {
      if(!(targetDep && targetUser)){
        return
      }
      if (type === 'inspector') {
        this.form = {
          ...this.form,
          inspectorDepartmentId: depId,
          inspectorDepartmentName:targetDep.departmentName,
          inspectorUserId: userId,
          inspectorUserName:targetUser.trueName
        }
      } else if (type === 'charge') {
        this.form = {
          ...this.form,
          chargeDepartmentId: depId,
          chargeDepartmentName:targetDep.departmentName,
          chargeUserId: userId ,
          chargeUserName:targetUser.trueName
        }
      }
    },
    uploadChange(fileType,fileList) {
      let fileAddBoList = [...(this.fileAddBoList || [])]
      let files = fileAddBoList.filter(f => f.fileType !== fileType)
      fileAddBoList = [
        ...fileList.map(f => {
          return {fileName:f.name,fileType,fileUrl:f.url}
        }),
        ...files
      ]
      this.fileAddBoList = fileAddBoList
    },
    getModelType(type){
      let _txt = ''
      try{
        _txt = this.projectDevelopmentModes[type].text
      }catch(err){
        console.log(err)
      }
      return _txt
    },

    personListAction(type, record) {
      const that = this
      let personBoList = [...that.personBoList]
      if (type === 'add') {
        personBoList.push({
          key: uuid(),
          depList: that.depList,
          selectDep:null,
          userList: [],
          selectUsers: []
        })
      } else if (type === 'del') {
        personBoList = personBoList.filter(item => item.key !== record.key)
      }
      that.personBoList = personBoList
    },
    initDepList() {
      //部门  id,departmentName
      return departmentList().then(res => (this.depList = res.data))
    },
    initUserList(depId) {
      //人员 id,trueName
      if (!depId) {
        this.userList = []
        return
      }
      return getUserByDep({ departmentId: depId }).then(res => res.data)
    },
    async depChangeHandler(depId, record) {
      const that = this
      const personBoList = [...that.personBoList]
      const target = personBoList.find(item => item.key === record.key)
      const userList = await that.initUserList(depId)
      target.selectDep = {...record.depList.find(dep => dep.id === depId)}
      target.userList = userList
      that.personBoList = personBoList
    },
    userChangeHandler(users, record) {
      const that = this
      const personBoList = [...that.personBoList]
      const target = personBoList.find(item => item.key === record.key)
      target.selectUsers = record.userList.filter(user => users.includes(user.id))
      that.personBoList = personBoList
    },
    async fillUsers(usersMap){
      const that = this
      let personBoList = [...that.personBoList]

      for(let [k,v] of Object.entries(usersMap)){
        if(Array.isArray(v) && v.length > 0){
          let departmentId = v[0].departmentId
          let departmentName = v[0].departmentName
          let userList = await that.initUserList(departmentId)
          let selectUsers = v.map(u => {
            return { id:u.userId,trueName:u.userName }
          })
          personBoList.push({
            key: uuid(),
            depList: that.depList,
            selectDep:{id:departmentId,departmentName},
            userList,
            selectUsers,
            disabled:false
          })
        }
      }

      that.personBoList = personBoList
    }
  }
}
</script>

<style scoped>
  .addform-wrapper >>> .ant-form-item {
    display: flex;
    margin: 0;
  }
  .addform-wrapper >>> .ant-form-item .ant-form-item-label {
    width: auto;
    text-align: left;
  }
  .addform-wrapper >>> .ant-form-item .ant-form-item-control-wrapper {
    flex: 1;
  }
  .custom-table-border th,
  .custom-table-border td {
    padding: 5px;
  }

  .__hd {
    font-size: 125%;
    line-height: 40px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;
  }

  .icon-required::before {
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
</style>

