<template>
  <a-modal
    :title="modalTitle"
    :width="760"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-form-wrapper">
        <h3>基本信息</h3>
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">部门</td>
            <td>
              <a-form-item>
                <a-select 
                  :disabled="isView"
                  placeholder="选择部门"
                  @change="depChangeHandler"
                  v-decorator="['departmentId',{initialValue:detail.departmentId,rules: [{required: true,message: '请选择部门'}]}]"
                  :allowClear="true" 
                  style="width:210px;"
                >
                  <a-select-option
                    v-for="item in depSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.departmentName}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td style="width:120px;">岗位</td>
            <td>
              <a-form-item >
                <a-select 
                  :disabled="isView"
                  placeholder="选择岗位"
                  @change="postChangeHandler"
                  v-decorator="['stationId',{initialValue:detail.stationId,rules: [{required: true,message: '请选择岗位'}]}]"
                  :allowClear="true" 
                  style="width:210px;"
                >
                  <a-select-option
                    v-for="item in postSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.stationName}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>人员</td>
            <td colspan="3" style="text-align:left;">
              <a-form-item>
                <a-select 
                  :disabled="isView"
                  placeholder="选择人员"
                  v-decorator="['userId',{initialValue:detail.userId,rules: [{required: true,message: '请选择人员'}]}]"
                  :allowClear="true"
                  style="width: 215px" 
                  @change="userChange"
                >
                  <a-select-option
                    v-for="item in personSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.trueName}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
        </table>
        <h3>工作账户信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">万德福云账号</td>
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="['wdfAccount',{initialValue:detail.wdfAccount,rules: [{required: false,message: '输入万德福云账号'}]}]" placeholder="输入万德福云账号"/>
              </a-form-item>
            </td>
            <td style="width:120px;">钉钉账号</td>
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="['ddAccount',{initialValue:detail.ddAccount,rules: [{required: false,message: '输入钉钉账号'}]}]" placeholder="输入钉钉账号"/>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>电脑开机密码</td>
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="['computerPassword',{initialValue:detail.computerPassword,rules: [{required: false,message: '输入电脑开机密码'}]}]" placeholder="输入电脑开机密码"/>
              </a-form-item>
            </td>
            <td>K3账号</td>
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="['k3Account',{initialValue:detail.k3Account,rules: [{required: false,message: '输入K3账号'}]}]" placeholder="输入K3账号"/>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>手机ID账号</td>
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="['idAccount',{initialValue:detail.idAccount,rules: [{required: false,message: '输入手机ID账号'}]}]" placeholder="输入手机ID账号"/>
              </a-form-item>
            </td>
            <td>微信账号</td>
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="['wxAccount',{initialValue:detail.wxAccount,rules: [{required: false,message: '输入微信账号'}]}]" placeholder="输入微信账号"/>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>QQ账号</td>
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="['qqAccount',{initialValue:detail.qqAccount,rules: [{required: false,message: '输入QQ账号'}]}]" placeholder="输入QQ账号"/>
              </a-form-item>
            </td>
            <td>QQ邮箱账号</td>
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="['qqEmailAccount',{initialValue:detail.qqEmailAccount,rules: [{required: false,message: '输入QQ邮箱账号'}]}]" placeholder="输入QQ邮箱账号"/>
              </a-form-item>
            </td>
          </tr>
        </table>
        <h3>邮箱账户信息</h3>
        <table class="custom-table custom-table-border">
          <tr v-for="(item ,index) in infoEmailList" :key="item.__key">
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="[`infoEmailList[${index}].accountName`,{initialValue:item.accountName,rules: [{required: false,message: '输入邮箱账号'}]}]" placeholder="输入邮箱账号"/>
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="[`infoEmailList[${index}].account`,{initialValue:item.account,rules: [{required: false,message: '输入邮箱账户名称'}]}]" placeholder="输入邮箱账户名称"/>
              </a-form-item>
            </td>
            
            <td v-if="!isView">
              <a-form-item>
                <a href="javascript:void(0);" @click="addItem('infoEmailList',item.__key)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button 
          v-if="!isView"
          style="width:100%;"
          type="dashed"
          icon="plus"
          @click="addItem('infoEmailList')"
        >添加邮箱账户</a-button>
        <h3>岗位账户信息</h3>
        <table class="custom-table custom-table-border">
          <tr v-for="(item ,index) in infoPostList" :key="item.__key">
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="[`infoPostList[${index}].accountName`,{initialValue:item.accountName,rules: [{required: false,message: '输入岗位账号'}]}]" placeholder="输入岗位账号"/>
              </a-form-item>
            </td>
            <td>
              <a-form-item>
                <a-input :disabled="isView" :allowClear="true" v-decorator="[`infoPostList[${index}].account`,{initialValue:item.account,rules: [{required: false,message: '输入岗位名称'}]}]" placeholder="输入岗位名称"/>
              </a-form-item>
            </td>
            
            <td v-if="!isView">
              <a-form-item>
                <a href="javascript:void(0);" @click="addItem('infoPostList',item.__key)">删除</a>
              </a-form-item>
            </td>
          </tr>
        </table>
        <a-button 
          v-if="!isView"
          style="width:100%;"
          type="dashed"
          icon="plus"
          @click="addItem('infoPostList')"
        >添加岗位账户</a-button>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取所有岗位
  getUserByStation //获取岗位下人员
} from '@/api/systemSetting'
import {
  comManageAccountAddAndUpdate,
  comManageAccountDetail
} from '@/api/communicationManagement'

import moment from 'moment'

function makeKey(){
  return Math.random().toString(32).slice(-10)
}

export default {
  name: 'AddForm',
  data() {
    return {
      depSelectDataSource: [],
      postSelectDataSource: [],
      personSelectDataSource:[],
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      detail: {},
      infoEmailList:[],
      infoPostList:[]
    }
  },
  computed: {
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    modalTitle() {
      return this.type === 'add' ? '新增' : this.type === 'view' ? '查看' : '编辑'
    }
  },
  methods: {
    moment,
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.detail = {}
      that.infoEmailList = []
      that.infoPostList = []
      that.form.resetFields()
      await that.initData()
      if (type === 'view' || type === 'edit') {
        that.spinning = true
        let _detail = null
        try{
          _detail = await comManageAccountDetail({ id: record.id }).then(res => res.data)
          that.spinning = false
          await that.depChangeHandler(_detail.departmentId)
          await that.postChangeHandler(_detail.stationId)
          that.userChange(_detail.userId)
          
          
          that.infoEmailList = _detail.infoList.filter(item => item.type === 1)
          that.infoPostList = _detail.infoList.filter(item => item.type === 2)

          that.detail = {..._detail}

          that.form.setFieldsValue({
            departmentId:_detail.departmentId,
            stationId:_detail.stationId,
            userId:_detail.userId
          })
        }
        catch(err){
          console.log(err)
          that.spinning = false
        }
      }
    },
    initData() {
      let that = this
      let task1 = departmentList().then(res => (that.depSelectDataSource = res.data))
      return Promise.all([task1])
    },

    handleSubmit() {
      let that = this
      if(that.isView){
        that.handleCancel()
        return
      }
      this.form.validateFields(async (err, values) => {
        if (!err) {
          values.infoEmailList.map(item =>{
            item.type = 1
            return item
          })
          values.infoPostList.map(item =>{
            item.type = 2
            return item
          })
          values.infoList = [...values.infoEmailList,...values.infoPostList]
          delete values.infoEmailList
          delete values.infoPostList
          console.log('Received values of form: ', values)
          that.spinning = true
          comManageAccountAddAndUpdate(values)
            .then(res => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    depChangeHandler(dep_id) {
      let that = this
      that.form.setFieldsValue({stationId:undefined})
      that.form.setFieldsValue({userId:undefined})
      return getStationList({ id: dep_id }).then(res => (that.postSelectDataSource = res.data))
    },
    postChangeHandler(stationId){
      let that = this
      that.form.setFieldsValue({userId:undefined})
      return getUserByStation({ stationId: stationId }).then(res => (that.personSelectDataSource = res.data))
    },
    userChange(id){

      let target = this.personSelectDataSource.find(p => +p.id === +id)
      if(target){
        this.form.setFieldsValue({
          wxAccount:target.userInfo.wxNum,
          qqAccount:target.userInfo.qqNum,
          qqEmailAccount:target.userInfo.email,
          wdfAccount:target.userName,
          ddAccount:target.mobile
        })
      }else{
        this.form.setFieldsValue({
          wxAccount:undefined,
          qqAccount:undefined,
          qqEmailAccount:undefined,
          wdfAccount:undefined,
          ddAccount:undefined
        })
      }
    },
    addItem(key,itemKey){
      if(itemKey !== undefined){
        this[key] = this[key].filter(item => item.__key !== itemKey)
      }else{
        this[key].push({
          __key:makeKey(),
          account:undefined,
          accountName:undefined,
          type:key === 'infoEmailList' ? 1 : 2,
          accountManageId:undefined
        })
      }
    },
  }
}
</script>
<style scoped>
.wdf-custom-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.wdf-custom-form-wrapper >>> .custom-table td{
  padding: 5px 10px;
}
</style>
