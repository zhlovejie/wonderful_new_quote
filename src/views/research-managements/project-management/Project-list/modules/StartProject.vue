<template>
  <a-modal
    title="项目立项"
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
        <a-row>
          <a-col :span="12">
            <a-form-model-item
              label="研发总监"
              prop="inspectorUserName"
            >
              <DepUserSelect
                @change="(...args) => depUserChange('inspector',...args)"
                :depId="form.inspectorDepartmentId"
                :userId="form.inspectorUserId"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="项目总负责人"
              prop="chargeUserName"
            >
              <DepUserSelect
                @change="(...args) => depUserChange('charge',...args)"
                :depId="form.chargeDepartmentId"
                :userId="form.chargeUserId"
              />
            </a-form-model-item>
          </a-col>
        </a-row>

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

        <a-form-model-item
          label="设计方案联合评审时间"
          prop="reviewTime"
        >
          <a-date-picker
            :show-time="{ format: 'HH:mm' }"
            v-model="form.reviewTime"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { listProjectAllDetail, addProjectAllJoin } from '@/api/researchManagementByWzz'
import DepUserSelect from '@/components/CustomerList/DepUserSelect'
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
    DepUserSelect
  },
  data() {
    return {
      visible: false,
      spinning: false,
      form: {},
      rules: {
        inspectorUserName: [{ required: true, message: '请选择研发总监' }],
        chargeUserName: [{ required: true, message: '请选择项目总负责人' }],
        reviewTime: [{ required: true, message: '请选择设计方案联合评审时间' }]
      },
      detail: {},
      personBoList: [],
      depList: [],
      hasRootPerson:true
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true
      that.personBoList = []
      that.spinning = true
      that.hasRootPerson = true
      try{
        await listProjectAllDetail({ projectId: record.id })
          .then(res => {
            that.detail = { ...res.data }
            let {
              id,
              inspectorDepartmentId,
              inspectorDepartmentName,
              inspectorUserId,
              inspectorUserName,
              chargeDepartmentId,
              chargeDepartmentName,
              chargeUserId,
              chargeUserName
            } = that.detail
            that.hasRootPerson = !!(inspectorDepartmentId && chargeDepartmentId)

            that.form = {
              ...that.form,
              id,
              inspectorDepartmentId,
              inspectorDepartmentName,
              inspectorUserId,
              inspectorUserName,

              chargeDepartmentId,
              chargeDepartmentName,
              chargeUserId,
              chargeUserName
            }
          })
          .catch(err => {
            console.log(err)
            that.$message.info(err)
          })
        that.initDepList()
        if(!(that.form.chargeDepartmentId && that.form.inspectorDepartmentId)){
          that.spinning = false
          return
        }
        let personBoList = [...that.personBoList]

        let [userList1,userList2] = await Promise.all([
          that.initUserList(that.form.chargeDepartmentId),
          that.initUserList(that.form.inspectorDepartmentId)
        ])
        let targetChargeDepartment = that.depList.find(dep => dep.id === that.form.chargeDepartmentId)
        personBoList.push({
          key: uuid(),
          depList: that.depList,
          selectDep:{
            id:targetChargeDepartment.id,
            departmentName:targetChargeDepartment.departmentName,
            type:targetChargeDepartment.type
          },
          userList: userList1,
          selectUsers: [
            {
              id:that.form.chargeUserId,
              trueName:that.form.chargeUserName,
            }
          ],
          disabled:true
        })
        if(that.form.inspectorUserId !== that.form.chargeUserId){
          let targetInspectorDepartment = that.depList.find(dep => dep.id === that.form.inspectorDepartmentId)
          personBoList.push({
            key: uuid(),
            depList: that.depList,
            selectDep:{
              id:targetInspectorDepartment.id,
              departmentName:targetInspectorDepartment.departmentName,
              type:targetInspectorDepartment.type
            },
            userList: userList2,
            selectUsers: [
              {
                id:that.form.inspectorUserId,
                trueName:that.form.inspectorUserName,
              }
            ],
            disabled:true
          })
        }

        that.personBoList = personBoList
      }catch(err){
        console.log(err)
        that.spinning = false
        that.$message.info(err)
      }
      that.spinning = false
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
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
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

          //新建项目时 没选择项目负责人和项目总监的情况，这里必须手选，添加到人员列表
          if(!that.hasRootPerson){
            let arr = []
            let {
              inspectorDepartmentId,
              inspectorDepartmentName,
              inspectorDepartmentType,
              inspectorUserId,
              inspectorUserName,

              chargeDepartmentId,
              chargeDepartmentName,
              chargeDepartmentType,
              chargeUserId,
              chargeUserName,

            } = that.form
            arr.push({
              departmentId:inspectorDepartmentId,
              departmentName:inspectorDepartmentName,
              departmentType:inspectorDepartmentType,
              userId:inspectorUserId,
              userName:inspectorUserName
            })
            // 项目负责人和项目总监 是否同一个人
            if(inspectorUserId !== chargeUserId){
              arr.push({
                departmentId:chargeDepartmentId,
                departmentName:chargeDepartmentName,
                departmentType:chargeDepartmentType,
                userId:chargeUserId,
                userName:chargeUserName
              })
            }
            personBoList.push(arr)
          }

          //去除重复人员
          personBoList = that.flatten(personBoList)
          let keys = [...new Set([...personBoList.map(p => p.userId)])]
          let ps = []
          keys.map(userId => {
            let u = personBoList.find(u => u.userId === userId)
            if(u){
              ps.push({...u})
            }
          })
          //去除重复人员 END

          let reviewTime = that.form.reviewTime
          reviewTime = reviewTime instanceof moment ? reviewTime.format('YYYY-MM-DD HH:mm') : reviewTime

          that.spinning = true
          addProjectAllJoin({ ...that.form ,personBoList:ps,reviewTime})
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              that.$emit('finish')
              that.handleCancel()
            })
            .catch(err => {
              console.log(err)
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
          inspectorDepartmentType: targetDep.type,
          inspectorUserId: userId,
          inspectorUserName: targetUser.trueName
        }
      } else if (type === 'charge') {
        that.form = {
          ...that.form,
          chargeDepartmentId: depId,
          chargeDepartmentName: targetDep.departmentName,
          chargeDepartmentType: targetDep.type,
          chargeUserId: userId,
          chargeUserName: targetUser.trueName
        }
      }
      that.$nextTick(() => {
        try{
          that.$refs.ruleForm && that.$refs.ruleForm.validate()
        }catch(err){
          console.log(err)
        }
      })
    },
    flatten(array) {
      var flattend = [];
      (function flat(array) {
        array.forEach(function(el) {
          if (Array.isArray(el)) flat(el);
          else flattend.push(el);
        });
      })(array);
      return flattend;
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}
</style>

