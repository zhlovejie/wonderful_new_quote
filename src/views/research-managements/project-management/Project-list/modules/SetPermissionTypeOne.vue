<template>
  <a-modal
    title="数据权限设置"
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
        <div class="file-type-item" v-for="(item,idx) in fileTypes" :key="item.key">
          <div class="__hd">
            <span>{{item.name}}</span>
          </div>
          <div class="__bd">
            <table class="custom-table custom-table-border">
              <tr>
                <th>参与人员</th>
                <th>操作权限</th>
              </tr>
              <tr v-for="(u,idx) in item.users" :key="u.key">
                <td>
                  {{u.departmentName}}-{{u.userName}}
                </td>
                <td style="width:400px;">
                  <a-checkbox-group
                    :value="u.__permission"
                    :options="item.fileType === 1 ? optionsCheckbox1 : (item.fileType === 3 ? optionsCheckbox3 : optionsCheckboxOthers)"
                    @change="e => permissionChange(item,idx,e)"
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
  listProjectAllJoin,
  listTrailAuthorityConf,
  saveProjectFileTrailAuthorityConf
} from '@/api/researchManagementByWzz'

function uuid() {
  return Math.random()
    .toString(32)
    .slice(-10)
}

//2、 资料归档 3、 bom清单 4、 2d图纸 5、 3d图纸 6、可行性功能测试点 7、 产品标志与配色方案 8、配置方案
const fileTypes = ['产品预估价','资料归档','bom清单','2d图纸','3d图纸','可行性功能测试点','产品标志与配色方案','配置方案']

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
      optionsCheckbox3:[
        { label: '查看/下载', value: 'findAuthority' },
        { label: '删除', value: 'removeAuthority' },
        { label: '修改', value: 'updateAuthority' },
        { label: '上传', value: 'uploadAuthority' },
      ],
      optionsCheckbox1:[
        { label: '查看', value: 'findAuthority' },
        { label: '录入', value: 'uploadAuthority' },
        { label: '修改', value: 'updateAuthority' },
      ],
      optionsCheckboxOthers:[
        { label: '查看/下载', value: 'findAuthority' },
        { label: '删除', value: 'removeAuthority' },
        { label: '上传', value: 'uploadAuthority' },
      ],
    }
  },
  methods: {
    async query(record,item,users) {
      const that = this
      that.detail = record
      that.visible = true
      that.spinning = true

      //人员列表
      // let userList = await listProjectAllJoin({ projectId: record.id }).then(res => {
      //   return res.data
      // })

      let userList = users

      that.fileTypes = fileTypes.map((v,idx) => {
        return {
          name:v,
          key:uuid(),
          fileType:idx + 1,
          users:userList.map(u => {
            return {...u,key:uuid(),__permission:[]}
          })
        }
      })

      await listTrailAuthorityConf({projectId:record.id}).then(res => {
        let fileTypes = [...that.fileTypes]
        let permission = ['findAuthority','removeAuthority','updateAuthority','uploadAuthority']
        res.data.map(item => {
          let target = fileTypes.find(f => f.fileType === item.fileType)
          let users = target.users
          let userList = item.confListVo
          userList.map(u => {
            let __permission = []
            permission.map(k => {
              if(+u[k] === 1){
                __permission.push(k)
              }
            })
            let _u = users.find(usr => usr.userId === u.userId)
            if(_u){
              _u.__permission = __permission
            }
          })
        })
        that.fileTypes = fileTypes
      })

      that.spinning = false
    },

    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.spinning = true
          let permission = ['findAuthority','removeAuthority','updateAuthority','uploadAuthority']
          let userList = that.fileTypes.map(item => {
            return item.users.filter(u => u.__permission.length > 0).map(u => {
                permission.map(k => {
                  u[k] = u.__permission.includes(k) ? 1 : 0
                })
                u.fileType = item.fileType
                return u
              })
          })

          let params = {
            projectId:that.detail.id,
            confListBo:userList.flat(2)
          }
          saveProjectFileTrailAuthorityConf(params)
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
    permissionChange(record,userIdx,permissionKeys){
      const that = this
      let fileTypes = [...that.fileTypes]
      let target = fileTypes.find(f => f.key === record.key)
      if(target){
        let targetUser = target.users[userIdx]
        targetUser.__permission = [...permissionKeys]
        that.fileTypes = fileTypes
      }
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

