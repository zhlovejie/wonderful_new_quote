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
                      v-if="!isView"
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
                      v-if="!isView"
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
                      v-if="!isView"
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
                    <a-input v-if="!isView" v-model="form.projectName" />
                    <span v-else>{{form.projectName}}</span>
                  </a-form-model-item>
                </td>
              </tr>
              <tr>
                <td style="width:150px;">
                  <span class="icon-required">项目总负责人</span>
                </td>
                <td>
                  <a-form-model-item prop="chargeDepartmentId">
                    <DepUserSelect
                      v-if="!isView"
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
                  <a-form-model-item ref="inspectorDepartmentId">
                    <DepUserSelect
                      v-if="!isView"
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
              v-if="!isView"
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
              v-if="!isView"
              v-model="form.confScheme"
              type="textarea"
            />
            <span v-else>{{form.confScheme}}</span>
          </a-form-model-item>
        </div>
        <div class="__hd">项目文件</div>
        <div class="__bd">
          <Files ref="files" :disabled="isView" @change="(files) => uploadChange(1,files)"/>
        </div>

        <div class="__hd">项目图片</div>
        <div class="__bd">
          <UploadFile
            ref="uploadFile"
            :disabled="isView"
            :config="uploadConfig3"
            @change="(files) => uploadChange(2,files)"
          />
        </div>

        <template v-if="form.projectStartJoinMap">
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
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import moment from 'moment'
import { productMaterialInfoPageList } from '@/api/routineMaterial'

import { listProjectAllDetail, listProjectAllAdd, listProjectAllUpdate } from '@/api/researchManagementByWzz'
import DepUserSelect from '@/components/CustomerList/DepUserSelect'
import UploadFile from './UploadFile'
import Files from './Files'

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
      rules: {},
      uploadConfig3: {
        maxFileCount: 3,
        fileType: 'img',
        enablePreview: true
      },
      fileAddBoList:[]
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
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true

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
      let validated =  await that.formValidate()
      if(validated){
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
</style>

