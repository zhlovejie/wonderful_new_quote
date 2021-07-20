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
      depList: []
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true

      that.spinning = true
      try{
        await that.initDepList()
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
          })

        let personBoList = [...that.personBoList]
        const userList1 = await that.initUserList(that.form.chargeDepartmentId)
        personBoList.push({
          key: uuid(),
          depList: that.depList,
          selectDep:{
            id:that.form.chargeDepartmentId,
            departmentName:that.form.chargeDepartmentName
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
        const userList2 = await that.initUserList(that.form.inspectorDepartmentId)
        personBoList.push({
          key: uuid(),
          depList: that.depList,
          selectDep:{
            id:that.form.inspectorDepartmentId,
            departmentName:that.form.inspectorDepartmentName
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
        that.personBoList = personBoList
      }catch(err){
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
          that.spinning = true

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


          let reviewTime = that.form.reviewTime
          reviewTime = reviewTime instanceof moment ? reviewTime.format('YYYY-MM-DD HH:mm') : reviewTime
          addProjectAllJoin({ ...that.form ,personBoList:personBoList.flat(2),reviewTime})
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

