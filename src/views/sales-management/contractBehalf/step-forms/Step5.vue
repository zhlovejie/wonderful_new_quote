<template>
  <div class="content-wrap">
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">乙方信息</a-col>
      </a-row>
      <a-form :form="form" @submit="handleSubmit" class="form wdf-form">
        <a-row class="wdf-row" style="border-radius: 3px">
          <a-col :span="4" justify="center" align="middle">
            <h3 style="padding: 20px">乙方信息（开票信息）</h3>
          </a-col>
          <a-col :span="20" justify="center" align="middle" style="border-left: 1px solid #ddd; padding: 20px">
            <a-row class="inner-row">
              <a-col :span="12">
                <a-form-item label="微信号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['wx', { rules: [{ required: true, message: '填写微信号' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="电子邮箱" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['email', { rules: [{ required: !isProductOrder, message: '填写电子邮箱' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="inner-row">
              <!--<a-col :span="12">
                  <a-form-item label="需方单位" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-input type="text" v-decorator="['demandUnit',{rules: [{ required: true,  message: '填写需方单位' }]}]" />
                  </a-form-item>
              </a-col>-->
              <a-col :span="12">
                <a-form-item label="地址" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['address', { rules: [{ required: true, message: '填写详细地址' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="手机号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['mobile', { rules: [{ required: true, message: '填写手机号' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <!-- <a-row class="inner-row">
                 <a-col :span="12">
                   <a-form-item  label="手机号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                     <a-input type="text" v-decorator="['mobile',{rules: [{ required: true, message: '填写电话' }]}]" />
                   </a-form-item>
                 </a-col>
                 <a-col :span="12" >
                   <a-form-item label="传真" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                     <a-input type="text" v-decorator="['fax',{rules: [{ required: !isProductOrder, message: '填写传真' }]}]" />
                   </a-form-item>
                 </a-col>
            </a-row>-->
            <a-row class="inner-row">
              <a-col :span="12">
                <a-form-item label="单位全称" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['unitFullName', { rules: [{ required: true, message: '填写单位全称' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="邮政编码" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['zipCode', { rules: [{ required: false, message: '填写邮政编码' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="inner-row">
              <a-col :span="12">
                <a-form-item label="开户行名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['openingBank', { rules: [{ required: false, message: '填写开户行名称' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="银行账号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['bankCardAccount', { rules: [{ required: false, message: '填写银行账号' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="inner-row">
              <a-col :span="12">
                <a-form-item label="税号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['dutyParagraph', { rules: [{ required: false, message: '填写税号' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="银行账号名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['accountTitle', { rules: [{ required: false, message: '填写银行账号名称' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-form-item class="btns-grop" style="border-left: none">
          <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
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
      type: Object,
    },
  },
  data() {
    return {
      // form
      form: this.$form.createForm(this),
      loading: false,
      timer: 0,
      customerId: 0,
      id: 0,
      customerInfo: [],
      queryOneData: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapper: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
      //是否(产品订货单 isTax = 0 )
      //新增需求0612
      isProductOrder: false,
    }
  },
  computed: {},
  watch: {
    $route(to, from) {
      if (to.fullPath === '/sales-management/contract-list-management/distributionContractList') {
        this.currentTab = 0
      }
    },
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const that = this
      that.id = that.queryonedata.id
      const params = { id: that.queryonedata.id }
      if (that.id > 0) {
        console.log('step5 called ... getQueryOne')
        getQueryOne(params)
          .then((res) => {
            //debugger
            that.queryOneData = res.data

            that.isProductOrder = that.queryOneData.isTax === 0 ? true : false

            that.form.setFieldsValue({
              id: res.data.id || 0,
            })

            if (res.data.customerInfo) {
              that.form.setFieldsValue({
                wx: res.data.customerInfo.wx || '',
                demandUnit: res.data.customerInfo.demandUnit || '',
                mobile: res.data.customerInfo.mobile || 0,
                unitFullName: res.data.customerInfo.unitFullName || '',
                openingBank: res.data.customerInfo.openingBank || '',
                dutyParagraph: res.data.customerInfo.dutyParagraph || '',
                email: res.data.customerInfo.email || '',
                address: res.data.customerInfo.address || '',
                fax: res.data.customerInfo.fax || '',
                zipCode: res.data.customerInfo.zipCode || '',
                bankCardAccount: res.data.customerInfo.bankCardAccount || '',
                accountTitle: res.data.customerInfo.accountTitle || '',
              })
            }

            that.contractId = res.data.id
            that.id = res.data.id
            that.contractId = res.data.id
            that.customerId = res.data.customerId

            if (res.data.customerInfo) {
              ;(that.wx = res.data.customerInfo.wx || ''),
                (that.demandUnit = res.data.customerInfo.demandUnit || ''),
                (that.mobile = res.data.customerInfo.mobile || 0),
                (that.unitFullName = res.data.customerInfo.unitFullName || ''),
                (that.openingBank = res.data.customerInfo.openingBank || ''),
                (that.dutyParagraph = res.data.customerInfo.dutyParagraph || ''),
                (that.email = res.data.customerInfo.email || ''),
                (that.address = res.data.customerInfo.address || ''),
                (that.fax = res.data.customerInfo.fax || ''),
                (that.zipCode = res.data.customerInfo.zipCode || ''),
                (that.bankCardAccount = res.data.customerInfo.bankCardAccount || ''),
                (that.accountTitle = res.data.customerInfo.accountTitle || '')
            }
          })
          .catch((error) => {
            console.error(error)
          })
      } else {
        //
        try {
          that.form.setFieldsValue({
            id: this.queryonedata.id || 0,
          })

          if (this.queryonedata.customerInfo) {
            that.form.setFieldsValue({
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
              accountTitle: this.queryonedata.customerInfo.accountTitle || '',
            })
          }
        } catch (err) {}
      }
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      if (that.$parent.routeParams.action === 'see') {
        return that.$emit('nextStep', { ...that.queryonedata })
      }
      const {
        form: { validateFields },
      } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步
      console.log('customerId:' + that.customerId)
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          const params = {
            contractId: that.queryonedata.id,
            //customerId: that.customerId,
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
            bankCardAccount: values.bankCardAccount,
          }
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveBInformation(params)
            .then((res) => {
              console.log('校验成功，保存填写的信息，请求后端接口结果', res)
              that.id = res.data.id
              that.loading = false
              // that.form.setFieldsValue({
              //   contractNum: res.data.contractNum
              // })
              if (status != 1) {
                that.$emit('nextStep', { ...res.data })
              } else {
                that.$message.success('保存成功')
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
    },
    // 上一步
    prevStep() {
      const id = this.id
      this.$emit('prevStep', id)
    },

    // 是否含运费
    freightTypeSelected(e) {
      this.freightType = e.target.value
      console.log('//选择是否含运费', e.target.value)
    },
    // 自提/代办运输
    transportTypeSelected(e) {
      this.transportType = e.target.value
      console.log('选择自提/代办运输', e.target.value)
    },
  },
}
</script>

<style lang="less" scoped>
.wdf-row {
  border: 1px solid #ddd;
}
.col-border {
  border: 1px solid #ddd;
  padding: 10px;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}
.wdf-form {
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
.label-fix {
  display: inline-block;
  width: 50%;
  text-align: left;
  position: relative;
  top: 8px;
}
</style>
