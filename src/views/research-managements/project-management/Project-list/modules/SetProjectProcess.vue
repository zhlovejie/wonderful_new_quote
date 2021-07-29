<template>
  <a-modal
    title="项目进程配置"
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
        <div class="__hd">
          <span>项目节点选项</span>
        </div>
        <div class="__bd">
          <a-checkbox-group
            v-model="selectKeys"
            :options="optionsCheckbox"
            @change="optionsCheckboxChange"
          />
        </div>

        <div class="__hd">
          <span>项目节点列表</span>
        </div>
        <div class="__bd">
          <table class="custom-table custom-table-border">
            <tr>
              <th>序号</th>
              <th>项目节点</th>
              <th>参与人员</th>
              <th>权限设置</th>
              <th>预计完成时间</th>
            </tr>
            <tr v-for="(item,idx) in form.processList" :key="item.key">
              <td style="width:50px;">{{idx + 1}}</td>
              <td style="width:200px;">{{item.projectPeriodName}}</td>
              <td >
                <a-form-model-item
                  :prop="`processList.${idx}.stageDetailJoinBoList`"
                  :rules="{
                    required: true,
                    message: '请选择参与人员'
                  }"
                >
                <a-select
                  style="width:100%;"
                  placeholder="选择人员"
                  mode="multiple"
                  @change="users => userSelectChange(users,item)"
                  v-model="item.stageDetailJoinBoList"
                  :disabled="item.projectPeriod < detail.status"
                >
                  <a-select-option
                    v-for="(item,idx) in userList"
                    :key="item.key"
                    :value="item.userId"
                  >{{item.departmentName}}-{{item.userName}}</a-select-option>
                </a-select>
                </a-form-model-item>
              </td>
              <td style="width:100px;">
                <a-button
                  type="link"
                  v-if="[3,11,12].includes(item.projectPeriod)"
                  :disabled="item.projectPeriod < detail.status"
                  @click="setPermission(item)"
                >权限设置</a-button>
                <span v-else>-</span>
              </td>
              <td style="width:200px;">
                <!-- {{finishTime}} -->
                <a-form-model-item
                  :prop="`processList.${idx}.finishTimeInstance`"
                  :rules="{
                    required: true,
                    message: '请选择预计完成时间',
                  }"
                >
                  <a-date-picker :disabled="item.projectPeriod < detail.status" v-model="item.finishTimeInstance" />
                </a-form-model-item>
              </td>
            </tr>

          </table>
        </div>
      </a-form-model>

      <SetPermissionTypeOne ref="setPermissionTypeOne" />
      <SetPermissionTypeTwo ref="setPermissionTypeTwo" />
    </a-spin>
  </a-modal>
</template>
<script>
import {
  listProjectAllDetail,
  listAllSchemeNodeRelation ,
  schemeNodeRelationDetail,
  saveOrUpdateProjectAllInfoStage,
  getSchemeNodeInfoDetailByProjectId,
  getProjectStageProcessJoinDetal,
  listProjectAllJoin,
  getProjectStageProcessDetail
} from '@/api/researchManagementByWzz'
import DepUserSelect from '@/components/CustomerList/DepUserSelect'
import SetPermissionTypeOne from './SetPermissionTypeOne'
import SetPermissionTypeTwo from './SetPermissionTypeTwo'
import moment from 'moment'
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'
function uuid() {
  return Math.random()
    .toString(32)
    .slice(-10)
}
export default {
  components: {
    DepUserSelect,
    SetPermissionTypeOne,
    SetPermissionTypeTwo
  },
  data() {
    return {
      type:'add',
      visible: false,
      spinning: false,
      form: {
        processList:[]
      },
      rules: {
        // inspectorUserName: [{ required: true, message: '请选择研发总监' }],
        // chargeUserName: [{ required: true, message: '请选择项目总负责人' }],
        // reviewTime: [{ required: true, message: '请选择设计方案联合评审时间' }]
      },
      detail: {},
      tags:[],
      selectKeys:[],
      depList:[],
      userList:[],

    }
  },
  computed:{
    optionsCheckbox() {
      const that = this
      return that.tags.map(item => {
        return { label: item.nodeName, value: item.id }
      })
    },
    isAdd(){
      return this.type === 'add'
    },
    isEdit(){
      return this.type === 'edit'
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.detail = record
      that.visible = true
      that.form = {...that.form,processList:[],projectId:record.id}
      that.spinning = true

      that.selectKeys = []
      //detail.status //项目进行到哪一阶段

      await Promise.all([
        //项目节点选项
        getSchemeNodeInfoDetailByProjectId({ projectId: record.id }).then(res => {
          that.tags = res.data.nodeInfoList
        }),
        //人员列表
        listProjectAllJoin({ projectId: record.id }).then(res => {
          that.userList = res.data.map(u => {
            u.key = uuid()
            return u
          })
        })
      ])

      await getProjectStageProcessJoinDetal({ //来判断 第一次设置还是修改
        projectId:record.id,
      }).then(res => {
        let {nodeInfoList,stageDetailVoList} = res.data
        that.type = Array.isArray(stageDetailVoList) && stageDetailVoList.length > 0 ? 'edit' : 'add'

        if(that.isEdit){
          that.selectKeys = nodeInfoList.map(node => node.id)
          let processList = stageDetailVoList.map(node => {
            node.key = uuid()
            node.projectPeriodName = that.getProjectPeriodName(node.projectPeriod)
            node.stageDetailJoinBoList = node.stageDetailJoinBoList.map(u => u.userId)
            node.finishTimeInstance = node.finishTime ? moment(node.finishTime) : null
            return node
          })
          that.form = {...that.form,processList}
        }
      })

      that.spinning = false
    },

    async optionsCheckboxChange(keys) {
      const that = this
      if(keys.length === 0){
        that.form = {...that.form,processList:[]}
        return
      }
      that.spinning = true
      getProjectStageProcessJoinDetal({
        projectId:that.detail.id,
        chooseNodeNums:keys.join(',')
      }).then(res => {
        that.spinning = false
        let processList = res.data.stageDetailVoList.map(node => {
          node.key = uuid()
          node.projectPeriodName = that.getProjectPeriodName(node.projectPeriod)
          node.stageDetailJoinBoList = node.stageDetailJoinBoList.map(u => u.userId)
          node.finishTimeInstance = node.finishTime ? moment(node.finishTime) : null
          return node
        })
        that.form = {...that.form,processList}
      }).catch(err => {
        that.spinning = false
        console.log(err)
      })
    },
    getProjectPeriodName(type){
      const m = [
        '',
        '立项阶段',
        '设计方案评审',
        '试制资料输出',
        '产品试制',
        '可行性测试',
        '可行性测试结果联合评审',
        '稳定性测试',
        '稳定性测试结果评审',
        '配置方案研发',
        '配置方案研发评审',
        '配置方案技术资料归档',
        '设计模块',
        '工艺研发',
        '工艺下达',
        '小批量生产',
        '小批量生产评审',
        '样品展示',
        '批量生产&完结'
      ]
      return m[type]
    },

    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          let processList = that.form.processList
          let nodeIds = that.selectKeys.join(',');
          let projectId = that.detail.id;
          let projectPeriods = processList.map(item => item.projectPeriod).join(',');
          let stageDetailBoList = processList.map(item => {
            let obj = {}
            let _realityFinishTime = item.finishTimeInstance.format('YYYY-MM-DD')
            obj.realityFinishTime = obj.finishTime = _realityFinishTime
            obj.joinPersonStr = item.stageDetailJoinBoList.join(',')
            obj.projectId = projectId
            obj.projectPeriod = item.projectPeriod
            obj.stageDetailJoinBoList = that.userList.filter(u => item.stageDetailJoinBoList.includes(u.userId))
            return obj
          });

          let params = {
            nodeIds,
            projectId,
            projectPeriods,
            stageDetailBoList
          };

          console.log(params)
          that.spinning = true
          saveOrUpdateProjectAllInfoStage(params)
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              that.$emit('finish')
              that.handleCancel()
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
    depUserChange(type, depId, userId, targetDep, targetUser) {
      const that = this
      if (!(targetDep && targetUser)) {
        return
      }
      if (type === 'inspector') {
        that.form = {
          ...that.form,
          inspectorDepartmentId: depId,
          inspectorDepartmentName: targetDep.departmentName,
          inspectorUserId: userId,
          inspectorUserName: targetUser.trueName
        }
      } else if (type === 'charge') {
        that.form = {
          ...that.form,
          chargeDepartmentId: depId,
          chargeDepartmentName: targetDep.departmentName,
          chargeUserId: userId,
          chargeUserName: targetUser.trueName
        }
      }
      that.$nextTick(() => {
        that.$refs.ruleForm.validate()
      })
    },

    getRelationSchema(type){
      let m = ['全部', '自主研发新产品', '客户定制新产品', '产品研发改进', '非常规产品开发']
      return m[type]
    },
    userSelectChange(users,record){
      // const that = this
      // let processList = [...that.processList]
      // let target = processList.find(item => item.projectPeriod === record.projectPeriod)
      // target.__selectUsers = that.userList.filter(item => users.includes(item.userId))
      // that.processList = processList
    },
    setPermission(item){
      const that = this
      let step = item.projectPeriod
      if(step === 3 || step === 11){
        let users = that.userList.filter(u => item.stageDetailJoinBoList.includes(u.userId))
        that.$refs.setPermissionTypeOne.query({...that.detail},{...item},[...users])
        return
      }else if(step === 13){
        let users = that.userList.filter(u => item.stageDetailJoinBoList.includes(u.userId))
        that.$refs.setPermissionTypeTwo.query({...that.detail},{...item},[...users])
        return
      }else{

      }
    }

  }
}
</script>

<style scoped>
.__hd {
  font-size: 125%;
  line-height: 40px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 10px;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
</style>

