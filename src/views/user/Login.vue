<template>
  <!--  <div>-->
  <!--    <script style="width: 40vw;height: 30vh;margin: 0 auto;" id="container" name="content" type="text/plain">这里写你的初始化内容</script>-->
  <!--  </div>-->
  <div class="main" style="position: relative;">
    <div class="android-qrcode-wrapper" v-if="qrText.length > 0">
      <vue-qr :text="qrText" :size="200"></vue-qr>
      <p style="text-align:center;">扫一扫&nbsp;&nbsp;下载万德福云</p>
    </div>
    
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="账号密码登录">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="账号为手机号"
              v-decorator="['username', {rules: [{ required: true, pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]}]"
            >
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }]}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <div class="form-group">
              <label class="verifylab">验证码</label>
              <a-input
                type="text"
                placeholder="请输入验证码"
                maxlength="4"
                style="width: 120px"
                v-decorator="[
                    'code',
                    {rules: [{ required: true, message: '请输入验证码' }]}
                  ]"
              />
              <img
                v-if="showImg"
                id="valid_code_img"
                :src="imgSrc"
                width="140px"
                height="35px"
                alt="验证码图片"
                @click="getCode(1)"
              />
            </div>
          </a-form-item>
        </a-tab-pane>

        <a-tab-pane key="tab2" tab="短信验证登录">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="手机号"
              v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }]}]"
            >
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <div class="form-group">
              <a-button type="primary" :disabled="buttonDisable" @click="getCode(2)">{{buttonText}}</a-button>
              <a-input
                type="text"
                placeholder="请输入验证码"
                maxlength="4"
                style="width: 120px"
                v-decorator="[
                    'mobileCode',
                    {rules: [{ required: true, message: '请输入验证码' }]}
                  ]"
              />
            </div>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe']">自动登录</a-checkbox>
        <!--        <router-link-->
        <!--          :to="{ name: 'recover', params: { user: 'aaa'} }"-->
        <!--          class="forge-password"-->
        <!--          style="float: right;"-->
        <!--        >忘记密码</router-link>-->
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >登&nbsp;&nbsp;录</a-button>
      </a-form-item>
    </a-form>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </div>
</template>

<script>
import Vue from 'vue'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
// import { getSmsCaptcha, get2step, turingNumber } from '@/api/login'
import { turingNumber, routerListByUser, getAndroidQRCode } from '@/api/login'
import AFormItem from 'ant-design-vue/es/form/FormItem'

import VueQr from 'vue-qr'

export default {
  components: {
    AFormItem,
    TwoStepCaptcha,
    VueQr
  },
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 1,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      value: '',
      imgSrc: null,
      token: null,
      showImg: true,
      buttonText: '获取验证码',
      buttonDisable: false,
      totalTime: 60, // 验证码发送倒计时
      qrText:'' //安卓版本生成二维码地址
    }
  },
  // created() {
  //   get2step({})
  //     .then(res => {
  //       this.requiredTwoStepCaptcha = res.result.stepCode
  //     })
  //     .catch(() => {
  //       this.requiredTwoStepCaptcha = false
  //     })
  //   // this.requiredTwoStepCaptcha = true
  // },
  mounted () {
    let that = this
    this.getCode(1)

    getAndroidQRCode().then(res =>{
      that.qrText = res.data.downloadUrl
    }).catch(err =>{
      that.qrText = ''
    })
  },
  methods: {
    // ...mapActions(['Login', 'Logout']),
    ...mapActions(['Login']),
    handleTabClick (key) {
      if (key === 'tab2') {
        this.showImg = false
      } else {
        this.showImg = true
      }
      this.customActiveKey = key
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey
      } = this
      state.loginBtn = true
      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password', 'code'] : ['mobile', 'mobileCode']
      this.form.validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          if ( customActiveKey === 'tab2') {
            values.code = values.mobileCode
            values.username = values.mobile
          }
          const loginParams = {
            userName: values.username,
            password: values.password,
            code: values.code,
            token: this.token,
            loginWay: customActiveKey,
            type: 1
          }
          this.Login(loginParams)
            .then((res) => {
              if (res.code === 200) {
                this.loginSuccess(res)
              } else {
                if (customActiveKey === 'tab1') {
                  this.getCode(1)
                }
                this.$message.error(res.msg)
              }
            })
            .catch(err => {
              this.requestFailed(err)
            })
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      this.$router.push({ name: 'Workplace' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: '请求出现错误，请稍后再试!',
        duration: 4
      })
    },
    getCode (type) {
      if (type === 1) { // 账号密码登录的验证码
        turingNumber({ type: type}).then((res) => {
          if ( res.code === 200 ) {
            this.imgSrc = res.data.img
            this.token = res.data.token
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => {
          console.error('获取验证码失败')
        })
      } else if (type === 2) { // 短信验证登录的验证码
        const { form: { validateFields } } = this
        const validateFieldsKey = ['mobile'] // 只需要验证手机号是否输入正确
        validateFields(validateFieldsKey, { force: true }, (err, values) => {
          if (!err) {
            this.buttonDisable = true
            this.buttonText = this.totalTime + 's后重新发送'
            let clock = window.setInterval(() => {
              this.totalTime--
              this.buttonText = this.totalTime + 's后重新发送'
              if (this.totalTime < 0) {
                window.clearInterval(clock) // 停止执行
                this.buttonText = '重新发送验证码'
                this.totalTime = 60
                this.buttonDisable = false  //这里重新开启
              }
            },1000) // 每秒执行
            const params = {
              username: values.mobile,
              type: type
            }
            turingNumber(params).then((res) => {
              if ( res.code === 200 ) {
                this.token = res.data.token
              } else {
                this.$message.error(res.msg)
              }
            }).catch(() => {
              console.error('获取验证码失败')
            })
          }
        })
      }
    }
  }
}

</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}

.form-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.verifylab {
  width: 80px;
  height: 32px;
  line-height: 32px;
  background-color: #1890ff;
  text-align: center;
  color: #fff;
  border-radius: 4px;
}

#valid_code_img {
  background-color: #ddd;
  height: 32px;
  line-height: 32px;
  text-align: center;
  width: auto;
  border-radius: 4px;
}

#valid_code_img:hover {
  cursor: pointer;
}

.android-qrcode-wrapper{
  background-color: #fff;
  position: absolute;
  left: 125%;
}
</style>
