<template>
  <a-modal
    title="产品设计权限设置"
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
        <div class="file-type-item" v-for="(item,idx) in fileTypes" :key="idx">
          <div class="__hd">
            <span>{{item.name}}</span>
          </div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <th>参与人员</th>
                <th>操作权限</th>
              </tr>
              <tr>
                <td>
                  <a-select
                    style="width:100%;"
                    placeholder="选择人员"
                    mode="multiple"
                    v-model="item.users"
                  >
                    <a-select-option
                      v-for="(item,idx) in userList"
                      :key="item.userId"
                      :value="item.userId"
                    >{{item.departmentName}}-{{item.userName}}</a-select-option>
                  </a-select>
                </td>
                <td style="width:400px;">
                  <a-checkbox-group
                    v-model="item.permission"
                    :options="optionsCheckbox"
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  getAuthorityConfDetail,
  saveAuthorityConf
} from '@/api/researchManagementByWzz'
import { getListByText } from '@/api/workBox'
function uuid() {
  return Math.random()
    .toString(32)
    .slice(-10)
}

export default {
  components: {

  },
  data() {
    return {
      visible: false,
      spinning: false,
      form: {},
      rules: {

      },
      detail: {},
      fileTypes:[],
      userList:[],
      optionsCheckbox:[
        { label: '查看/下载', value: 'findAuthority' },
        { label: '删除', value: 'removeAuthority' },
        { label: '修改', value: 'updateAuthority' },
        { label: '上传', value: 'uploadAuthority' },
      ]
    }
  },
  methods: {
    async query(record,item,users) {
      const that = this
      that.detail = record
      that.visible = true
      that.spinning = true
      that.userList = users

      that.fileTypes = await getListByText({ text: '研发管理-产品设计阶段权限' }).then((res) => {
        return res.data.records.map((v,idx) => {
          return {
            name:v.text,
            key:uuid(),
            fileType:v.id,
            users:[],
            permission:[]
          }
        })
      })

      await getAuthorityConfDetail({projectId:record.id}).then(res => {
        let list = res.data.confListVo
        let fileTypes = [...that.fileTypes]
        that.fileTypes = fileTypes.map(item => {
          let target = list.find(_item => _item.fileDicId === item.fileType)
          if(target && Array.isArray(target.authorityConfVoList)){
            item.users = target.authorityConfVoList.map(c => c.userId)
            if(target.authorityConfVoList.length > 0){
              let permission = []
              for(let [k,v] of Object.entries(target.authorityConfVoList[0])){
                if(k.endsWith('Authority') && v === 1){
                  permission.push(k)
                }
              }
              item.permission = permission
            }else{
              item.permission = []
            }
          }
          return item
        })
      })

      that.spinning = false
    },

    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.spinning = true

          let confListBo =that.fileTypes.map(item => {
            let arr = []
            let permission = ['findAuthority','removeAuthority','updateAuthority','uploadAuthority']
            let permissionObj = {}
            permission.map(k => {
              permissionObj[k] = item.permission.includes(k) ? 1 : 0
            })

            that.userList
            .filter(u => item.users.includes(u.userId))
            .map(u => {
              arr.push({
                ...u,
                ...permissionObj
              })
            })

            return {
              authorityConfBoList:arr,
              fileDicId:item.fileType,
              fileDicName:item.name
            }
          })

          let params = {
            projectId:that.detail.id,
            confListBo
          }
          console.log(params)
          saveAuthorityConf(params)
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
    }
  }
}
</script>

<style scoped>

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
</style>

