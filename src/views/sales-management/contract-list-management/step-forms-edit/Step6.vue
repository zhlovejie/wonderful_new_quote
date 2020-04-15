<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
      <a-button v-if="contractAttribute===0" class="fl-r" type="primary" @click="prevView" icon="backward">预览</a-button>
      <a-button v-if="contractAttribute===0" class="fl-r" type="primary" @click="lastSubmit" icon="check">提交</a-button>
    </div>
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">其他信息</a-col>
      </a-row>
      <a-form
        :form="form"
        @submit="handleSubmit"
        class="form wdf-form"
      >
        <a-form-item
        >
          <a-row class="wdf-row">
            <a-col class="col-border" :span="4" justify="center" align="middle">需方产品特殊要求说明</a-col>
            <a-col class="col-border" :span="20" justify="center" align="middle">
              <a-textarea
                type="text"
                v-decorator="['requirementSpecification',
                              {rules: [{ required: false, message: '需方产品特殊要求说明' }]}]" />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="4" justify="center" align="middle">合同争议的解决方式</a-col>
            <a-col class="col-border" :span="20" justify="center" align="middle">
              <a-radio-group @change="contractDisputeSelected" v-decorator="['contractDispute',{initialValue: 1}]">
                <a-radio :value="0">
                  提交仲裁委员会仲裁
                </a-radio>
                <a-radio :value="1">
                  向甲方所在地人民法院提起诉讼
                </a-radio>
                <a-radio :value="2">
                  向乙方所在地人民法院提起诉讼
                </a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="4" justify="center" align="middle">签订形式</a-col>
            <a-col class="col-border" :span="20" justify="center" align="middle">
              <a-radio-group style="width: 100%;" @change="signFormSelected" v-decorator="['signForm',{initialValue: 0}]">
                <a-row>
                  <a-col :span="6">
                    <a-radio :value="0">
                      邮件
                    </a-radio>
                  </a-col>
                  <a-col :span="4">甲方邮箱：</a-col>
                  <a-col :span="5">
                    <a-input
                      type="text"
                      v-decorator="['emailA',
                                    {rules: [{ required: false, message: '甲方邮箱' }]}]" />
                  </a-col>
                  <a-col :span="4">乙方邮箱：</a-col>
                  <a-col :span="5">
                    <a-input
                      type="text"
                      v-decorator="['emailB',
                                    {rules: [{ required: false, message: '乙方邮箱' }]}]" />
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="6">
                    <a-radio :value="1">
                      书面
                    </a-radio>
                  </a-col>
                </a-row>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
        >
          <a-row class="wdf-row">
            <a-col class="col-border" :span="4" justify="center" align="middle">甲方信息</a-col>
            <a-col class="col-border" :span="20" justify="center" align="middle">
              <a-row>
                <a-col :span="4">微信号:</a-col>
                <a-col :span="8">
                  <a-input
                    type="text"
                    v-decorator="['wxA',
                                  {rules: [{ required: false, message: '微信号' }]}]"
                    disabled />
                </a-col>
                <a-col :span="4">电子邮箱:</a-col>
                <a-col :span="8">
                  <a-input
                    type="text"
                    v-decorator="['emailA',
                                  {rules: [{ required: false, message: '甲方电子邮箱' }]}]"
                    disabled />
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item class="btns-grop" style="border-left: none">
          <a-button style="margin-left: 8px;" @click="prevStep">上一步</a-button>
          <a-button v-if="contractAttribute===1" type="primary" @click="nextStep">下一步</a-button>
        </a-form-item>

      </a-form>

    </div>
  </div>
</template>

<script>
import { saveOtherInfo, buildCreateWork, deleteQueryOne, getQueryOne } from '@/api/contractListManagement'
export default {
  name: 'Step6',
  components: {},
  props: {
    queryonedata: {
      type: Object
    }
  },
  data () {
    return {
      // form
      form: this.$form.createForm(this),
      contractAttribute: this.queryonedata.contractAttribute, // 0使用我方合同 1反之
      isTax: this.queryonedata.isTax, // 0含税 1不含税
      loading: false,
      timer: 0,
      id: 0
    }
  },
  computed: {},
  watch: {
    $route (to, from) {
      if (to.fullPath === '/sales-management/contract-list-management/distributionContractList') {
        this.currentTab = 0
      }
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const that = this
      that.id = that.queryonedata.id
      const params = { id: that.queryonedata.id }
      getQueryOne(params).then(res => {
        this.queryOneData = res.data
        console.log('这是点击下一步的时候同样请求queryone接口this.queryOneData', this.queryOneData)
        that.form.setFieldsValue({
          contractId: res.data.id,
          requirementSpecification: res.data.requirementSpecification || '',
          contractDispute: res.data.contractDispute || 1,
          signForm: res.data.signForm || 0,
          emailA: res.data.saleUser.email || '',
          emailB: res.data.emailB || '',
          wxA: res.data.saleUser.wxNum || ''
        })
        that.contractId = res.data.id
        that.id = res.data.id,
        that.requirementSpecification = res.data.requirementSpecification || '',
        that.contractDispute = res.data.contractDispute || 0,
        that.signForm = res.data.signForm || 0,
        that.emailA = res.data.saleUser.email || '',
        that.emailB = res.data.emailB || '',
        that.wxA = res.data.saleUser.wxNum || ''
      }).catch(error => {
        console.error(error)
      })
      that.form.setFieldsValue({
        contractId: this.queryonedata.id,
        requirementSpecification: this.queryonedata.requirementSpecification || '',
        contractDispute: this.queryonedata.contractDispute || 1,
        signForm: this.queryonedata.signForm || 0,
        emailA: this.queryonedata.saleUser.email || '',
        emailB: this.queryonedata.emailB || '',
        wxA: this.queryonedata.saleUser.wxNum || ''
      })
    },
    contractDisputeSelected (value) {
      console.log('合同争议的解决方式---下拉', value)
      this.contractDispute = value
    },
    signFormSelected (value) {
      console.log('签订形式---下拉', value)
      this.signForm = value
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    // 点击下一步
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          const params = {
            contractId: that.queryonedata.id,
            requirementSpecification: values.requirementSpecification,
            contractDispute: values.contractDispute,
            signForm: values.signForm,
            emailA: values.emailA,
            emailB: values.emailB,
            wxA: values.wxA
          }
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveOtherInfo(params).then((res) => {
            console.log('校验成功，保存填写的信息，请求后端接口结果', res)
            that.id = res.data.id
            that.loading = false
            // that.form.setFieldsValue({
            //   contractNum: res.data.contractNum
            // })
            that.$emit('nextStep', { ...res.data })
          }).catch(error => {
            console.error(error)
          })
        }
      })
    },
    // 上一步
    prevStep () {
      const id = this.id
      this.$emit('prevStep', id)
    },
    // 点击提交
    lastSubmit () {
      const that = this
      const { form: { validateFields } } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          const params = {
            contractId: that.queryonedata.id,
            additionalTreaty: values.additionalTreaty,
            requirementSpecification: values.requirementSpecification,
            contractDispute: values.contractDispute,
            signForm: values.signForm,
            // emailA:that.queryonedata.saleUser.email,
            emailA: values.email,
            emailB: values.emailB,
            // wxA:that.queryonedata.saleUser.wxNum,
            wxA: values.wxA
          }

          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveOtherInfo(params).then((res) => {
            console.log('校验成功，保存填写的信息，请求后端接口结果', res)
            that.id = res.data.id
            that.loading = false
            // 保存信息成功之后，调取生成合同PDF的接口，留作列表页导出使用
            const paramsc = {
              id: that.queryonedata.id
            }
            buildCreateWork(paramsc).then((res) => {
              console.log('调取生成合同PDF的接口，留作列表页导出使用', res)
            }).catch(error => {
              console.error(error)
            })

            that.$router.push({ name: 'distributionContractList' }) // 提交之后跳转到销售合同列表页
          }).catch(error => {
            console.error(error)
          })
        }
      })
    },
    // 预览
    prevView () {
      const that = this
      const { form: { validateFields } } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          const params = {
            contractId: that.queryonedata.id,
            additionalTreaty: values.additionalTreaty,
            requirementSpecification: values.requirementSpecification,
            contractDispute: values.contractDispute,
            signForm: values.signForm,
            emailA: values.emailA,
            emailB: values.emailB,
            wxA: values.wxA
          }

          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveOtherInfo(params).then((res) => {
            console.log('校验成功，保存填写的信息，请求后端接口结果', res)
            that.id = res.data.id
            that.loading = false
            const id = that.queryonedata.id
            // 保存信息成功之后，调取生成合同PDF的接口，留作列表页导出使用
            const paramsc = {
              id: that.queryonedata.id
            }
            buildCreateWork(paramsc).then((res) => {
              console.log('调取生成合同PDF的接口，留作列表页导出使用', res)
            }).catch(error => {
              console.error(error)
            })
            if (that.contractAttribute === 1) { // 选择三方合同
              that.$router.push({ name: 'previewTripartiteContract', params: { id: id } })
            } else {
              if (that.isTax === 0) { // 含税--选择销售合同
                that.$router.push({ name: 'previewSalesContract', params: { queryOneData: this.queryonedata } })
              } else {
                that.$router.push({ name: 'previewProductOrderForm', params: { id: id } })
              }
            }
          }).catch(error => {
            console.error(error)
          })
        }
      })
    },
    // 返回
    goBack () {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确定要放弃本条合同的创建吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          const params = { id: _this.queryonedata.id }
          deleteQueryOne(params).then((res) => {
            if (res.code == 200) {
              _this.$message.info('删除合同编辑成功')
              _this.$router.push({ name: 'distributionContractList' })
            } else {
              _this.$message.error(res.msg)
            }
          })
          console.log('OK')
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .wdf-row{
    border: 1px solid #ddd;
  }
  .col-border{
    border: 1px solid #ddd;
    padding: 10px;
    border-bottom: none;
    min-height: 60px;
    box-sizing: border-box;
  }
  .wdf-form{
    margin-top: 12px;
    padding: 12px;
  }
  .btns-grop {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 24px;
  }
  .btns-grop button:not(first-child) {
    margin-left: 12px;
  }
  .ant-row.ant-form-item{
    margin-bottom: 0;
  }
</style>
