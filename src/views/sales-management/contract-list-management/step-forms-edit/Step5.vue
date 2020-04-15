<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
    </div>
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">乙方信息</a-col>
      </a-row>
      <a-form
        :form="form"
        @submit="handleSubmit"
        class="form wdf-form"
      >
        <a-form-item
        >
          <a-row class="wdf-row">
            <a-col class="col-border" :span="4" justify="center" align="middle">乙方信息（开票信息）</a-col>
            <a-col class="col-border" :span="20" justify="center" align="middle">
              <a-row class="inner-row">
                <a-col :span="4">微信号:</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-input
                      type="text"
                      v-decorator="[
                        'wx',
                        {rules: [{ required: true, message: '填写微信号'},{pattern:/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/,message:'请填写正确微信号'}]}
                      ]" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">电子邮箱:</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-input
                      type="text"
                      v-decorator="[
                        'email',
                        {rules: [{ required: true, message: '填写电子邮箱' },{pattern:/^[0-9a-z]+\w*@([0-9a-z]+\.)+[0-9a-z]+$/,message:'请填写正确电子邮箱'}]}
                      ]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="inner-row">
                <a-col :span="4">需方单位:</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-input
                      type="text"
                      v-decorator="[
                        'demandUnit',
                        {rules: [{ required: true, message: '填写需方单位' }]}
                      ]" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">地址:</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-input
                      type="text"
                      v-decorator="[
                        'address',
                        {rules: [{ required: true, message: '填写详细地址' }]}
                      ]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="inner-row">
                <a-col :span="4">固话:</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-input
                      type="text"
                      v-decorator="[
                        'mobile',
                        {rules: [{ required: true, message: '填写电话' },{ pattern: /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/, message: '请输入正确电话!'}]}
                      ]" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">传真:</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-input
                      type="text"
                      v-decorator="[
                        'fax',
                        {rules: [{ required: true, message: '填写传真' },{pattern:/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,message:'请填写正确传真号'}]}
                      ]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="inner-row">
                <a-col :span="4">单位全称:</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-input
                      type="text"
                      v-decorator="[
                        'unitFullName',
                        {rules: [{ required: true, message: '填写单位全称' }]}
                      ]" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">邮政编码:</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-input
                      type="text"
                      v-decorator="[
                        'zipCode',
                        {rules: [{ required: true, message: '填写邮政编码' },{pattern:/^[1-9]\d{5}$/,message:'请填写正确邮政编码'}]}
                      ]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="inner-row">
                <a-col :span="4">开户行名称:</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-input
                      type="text"
                      v-decorator="[
                        'openingBank',
                        {rules: [{ required: true, message: '填写开户行名称' }]}
                      ]" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">银行账号:</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-input
                      type="text"
                      v-decorator="[
                        'bankCardAccount',
                        {rules: [{ required: true, message: '填写银行账号' },{pattern:/^\d{19}$/,message:'请填写正确银行账号'}]}
                      ]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="inner-row">
                <a-col :span="4">税号:</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-input
                      type="text"
                      v-decorator="[
                        'dutyParagraph',
                        {rules: [{ required: true, message: '填写税号' },{pattern: /^\d+$/,message:'请填写正确税号'}]}
                      ]" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">银行账号名称:</a-col>
                <a-col :span="8">
                  <a-input
                    type="text"
                    v-decorator="[
                      'accountTitle',
                      {rules: [{ required: false, message: '填写银行账号名称' }]}
                    ]" />
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item class="btns-grop" style="border-left: none">
          <a-button style="margin-left: 8px;" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </a-form-item>

      </a-form>
    </div>
  </div>
</template>

<script>
import { getQueryOne, saveBInformation, deleteQueryOne } from '@/api/contractListManagement'
import AFormItem from 'ant-design-vue/es/form/FormItem'
export default {
  name: 'Step5',
  components: { AFormItem },
  props: {
    queryonedata: {
      type: Object
    }
  },
  data () {
    return {
      // form
      form: this.$form.createForm(this),
      loading: false,
      timer: 0,
      id: 0,
      customerInfo: []
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
        that.queryOneData = res.data
        that.form.setFieldsValue({
          id: this.queryonedata.id || 0,
          wx: this.queryonedata.customerInfo.wx || '',
          demandUnit: this.queryonedata.customerInfo.demandUnit || '',
          mobile: this.queryonedata.customerInfo.mobile || 0,
          unitFullName: this.queryonedata.customerInfo.unitFullName || '',
          openingBank: this.queryonedata.customerInfo.openingBank || '',
          dutyParagraph: this.queryonedata.customerInfo.dutyParagraph || '',
          email: this.queryonedata.customerInfo.email || '',
          address: this.queryonedata.customerInfo.address || '',
          fax: this.queryonedata.customerInfo.fax || '',
          zipCode: this.queryonedata.customerInfo.zipCode || '',
          bankCardAccount: this.queryonedata.customerInfo.bankCardAccount || '',
          accountTitle: this.queryonedata.customerInfo.accountTitle || ''
        })
        that.contractId = this.queryonedata.id
        that.id = this.queryonedata.id
        that.contractId = res.data.id

        that.wx = res.data.customerInfo.wx || '',
        that.demandUnit = res.data.customerInfo.demandUnit || '',
        that.mobile = res.data.customerInfo.mobile || 0,
        that.unitFullName = res.data.customerInfo.unitFullName || '',
        that.openingBank = res.data.customerInfo.openingBank || '',
        that.dutyParagraph = res.data.customerInfo.dutyParagraph || '',
        that.email = res.data.customerInfo.email || '',
        that.address = res.data.customerInfo.address || '',
        that.fax = res.data.customerInfo.fax || '',
        that.zipCode = res.data.customerInfo.zipCode || '',
        that.bankCardAccount = res.data.customerInfo.bankCardAccount || '',
        that.accountTitle = res.data.customerInfo.accountTitle || ''
      }).catch(error => {
        console.error(error)
      })
      //
      that.form.setFieldsValue({
        id: this.queryonedata.id || 0,
        wx: this.queryonedata.customerInfo.wx || '',
        demandUnit: this.queryonedata.customerInfo.demandUnit || '',
        mobile: this.queryonedata.customerInfo.mobile || 0,
        unitFullName: this.queryonedata.customerInfo.unitFullName || '',
        openingBank: this.queryonedata.customerInfo.openingBank || '',
        dutyParagraph: this.queryonedata.customerInfo.dutyParagraph || '',
        email: this.queryonedata.customerInfo.email || '',
        address: this.queryonedata.customerInfo.address || '',
        fax: this.queryonedata.customerInfo.fax || '',
        zipCode: this.queryonedata.customerInfo.zipCode || '',
        bankCardAccount: this.queryonedata.customerInfo.bankCardAccount || '',
        accountTitle: this.queryonedata.customerInfo.accountTitle || ''
      })
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
            wx: values.wx,
            demandUnit: values.demandUnit,
            mobile: values.mobile,
            unitFullName: values.unitFullName,
            openingBank: values.openingBank,
            dutyParagraph: values.dutyParagraph,
            accountTitle: values.accountTitle,
            email: values.email,
            address: values.address,
            fax: values.fax,
            zipCode: values.zipCode,
            bankCardAccount: values.bankCardAccount
          }
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveBInformation(params).then((res) => {
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

    // 是否含运费
    freightTypeSelected (e) {
      this.freightType = e.target.value
      console.log('//选择是否含运费', e.target.value)
    },
    // 自提/代办运输
    transportTypeSelected (e) {
      this.transportType = e.target.value
      console.log('选择自提/代办运输', e.target.value)
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
</style>
