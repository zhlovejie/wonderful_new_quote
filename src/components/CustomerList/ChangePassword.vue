<template>
  <!--修改密码 -->
  <a-modal
    :title="modalTitle"
    :width="400"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-form-wrapper">
        <a-form-item label="原始密码">
          <a-input
            allowClear
            :type="inputType"
            v-decorator="['oldPassword',{rules: [{ required: true, message: '请输入原始密码'}, { min: 4, max: 16, message: '密码位4-16位' }]}]"
          >
            <a-icon
              slot="suffix"
              :type="eyeIcon"
              style="color: rgba(0,0,0,.45)"
              @click="togglePassword"
            />
          </a-input>
        </a-form-item>
        <a-form-item label="新密码">
          <a-input
            allowClear
            :type="inputType"
            v-decorator="['newPassword',{rules: [{ required: true, message: '请输入新密码'}, { min: 4, max: 16, message: '密码位4-16位' }]}]"
          >
            <a-icon
              slot="suffix"
              :type="eyeIcon"
              style="color: rgba(0,0,0,.45)"
              @click="togglePassword"
            />
          </a-input>
        </a-form-item>
        <!-- <a-form-item label="确认密码">
          <a-input
            allowClear
            :type="inputType"
            v-decorator="['reNowPassWord',{rules: [{ required: true, message: '确认密码'}, { min: 4, max: 16, message: '密码位4-16位' }]}]"
          >
            <a-icon
              slot="suffix"
              :type="eyeIcon"
              style="color: rgba(0,0,0,.45)"
              @click="togglePassword"
            />
          </a-input>
        </a-form-item> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { userUpdatePassWord} from '@/api/common'
export default {
  name:"userUpdatePassWord",
  data(){
    return {
      modalTitle:"修改密码",
      visible:false,
      spinning:false,

      form: this.$form.createForm(this, { name: 'forget-password-form' }),
      eyePassword: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {
    inputType() {
      return this.eyePassword ? 'text' : 'password'
    },
    eyeIcon() {
      return this.eyePassword ? 'eye' : 'eye-invisible'
    }
  },
  methods:{
    init(){

    },
    handleOk(){
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          values.id = that.userInfo.id
          //console.log(values)
          // let { nowPassWord, reNowPassWord } = values
          // if (nowPassWord !== reNowPassWord) {
          //   that.$message.info('您两次输入的新密码不一致，请确认密码一致。')
          //   return
          // }
          that.spinning = true
          userUpdatePassWord(values)
            .then(res => {
              that.spinning = false
              if(+res.code === 200){
                that.$message.info('密码已修改成功')
                that.handleCancel()
              }else{
                that.$message.info(`接口返回：${res.msg}，请联系管理人员`)
              }
            })
            .catch(err => {
              that.spinning = false
              that.handleCancel()
              that.$message.info(`错误信息:${err.message}，请联系管理人员`)
            })
        }
      })
    },
    handleCancel(){
      this.visible = false
    },
    query(){
      this.visible = true

      this.$nextTick(() => this.reset())
    },
    reset(){
      this.form.resetFields()
      this.spinning = false
      this.eyePassword = false
    },
    togglePassword() {
      this.eyePassword = !this.eyePassword
    },
  }
}
</script>

<style scoped>
.wdf-custom-form-wrapper >>> .ant-form-item {
  display: flex;
}
.wdf-custom-form-wrapper >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
.wdf-custom-form-wrapper >>> .ant-form-item .ant-form-item-label {
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
}
</style>