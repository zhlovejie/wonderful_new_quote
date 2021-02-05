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
                    v-decorator="['customerWxNum', { rules: [{ required: true, message: '填写微信号' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="电子邮箱" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['customerEmail', { rules: [{ required: !isProductOrder, message: '填写电子邮箱' }] }]"
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
                    v-decorator="['customerAddress', { rules: [{ required: true, message: '填写详细地址' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="手机号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['customerPhone', { rules: [{ required: true, message: '填写手机号' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <!-- <a-row class="inner-row">
                 <a-col :span="12">
                   <a-form-item  label="手机号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                     <a-input type="text" v-decorator="['customerPhone',{rules: [{ required: true, message: '填写电话' }]}]" />
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
                    v-decorator="['customerFullName', { rules: [{ required: true, message: '填写单位全称' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="邮政编码" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['customerPostcode', { rules: [{ required: false, message: '填写邮政编码' }] }]"
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
                    v-decorator="['customerBankName', { rules: [{ required: false, message: '填写开户行名称' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="银行账号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['customerBankAccount', { rules: [{ required: false, message: '填写银行账号' }] }]"
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
                    v-decorator="['customerTfn', { rules: [{ required: false, message: '填写税号' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="银行账号名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-input
                    type="text"
                    :disabled="this.$parent.routeParams.action === 'see'"
                    v-decorator="['customerBankUser', { rules: [{ required: false, message: '填写银行账号名称' }] }]"
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
import { saveNewstCustomer, saveBInformation, deleteQueryOne } from '@/api/contractListManagement'
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
      if (that.queryonedata && that.queryonedata.purchaseContractSaveBo.customerWxNum) {
        let rest = that.queryonedata.purchaseContractSaveBo
        that.form.setFieldsValue({
          customerWxNum: rest.customerWxNum || '',
          customerEmail: rest.customerEmail || '',
          customerAddress: rest.customerAddress || '',
          customerPhone: rest.customerPhone || '',
          customerFullName: rest.customerFullName || '',
          customerPostcode: rest.customerPostcode || '',
          customerBankName: rest.customerBankName || '',
          customerBankAccount: rest.customerBankAccount || '',
          customerTfn: rest.customerTfn || '',
          customerBankUser: rest.customerBankUser || '',
        })
      } else {
        let arrId = that.queryonedata.purchaseContractSaveBo.customerId
        console.log(arrId)
        // `customerId=${arrId}`
        saveNewstCustomer({ customerId: arrId }).then((res) => {
          console.log(res)
          if (res === 200) {
            that.form.setFieldsValue({
              customerWxNum: res.data.customerWxNum || '',
              customerEmail: res.data.customerEmail || '',
              customerAddress: res.data.customerAddress || '',
              customerPhone: res.data.customerPhone || '',
              customerFullName: res.data.customerFullName || '',
              customerPostcode: res.data.customerPostcode || '',
              customerBankName: res.data.customerBankName || '',
              customerBankAccount: res.data.customerBankAccount || '',
              customerTfn: res.data.customerTfn || '',
              customerBankUser: res.data.customerBankUser || '',
            })
          }
        })
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
            // contractId: that.queryonedata.id,
            //customerId: that.customerId,
            customerWxNum: values.customerWxNum,
            // demandUnit: values.demandUnit,
            customerPhone: values.customerPhone,
            customerFullName: values.customerFullName,
            customerBankName: values.customerBankName,
            customerTfn: values.customerTfn,
            customerBankUser: values.customerBankUser,
            customerEmail: values.customerEmail,
            customerAddress: values.customerAddress,
            // fax: values.fax,
            customerPostcode: values.customerPostcode,
            customerBankAccount: values.customerBankAccount,
          }
          let params1 = {
            purchaseContractSaveBo: { ...that.queryonedata.purchaseContractSaveBo, ...params },
          }
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          // saveBInformation(params)
          //   .then((res) => {
          //     console.log('校验成功，保存填写的信息，请求后端接口结果', res)
          //     that.id = res.data.id
          //     that.loading = false
          //     // that.form.setFieldsValue({
          //     //   contractNum: res.data.contractNum
          //     // })
          //     if (status != 1) {
          that.$emit('nextStep', { ...params1 })
          //     } else {
          //       that.$message.success('保存成功')
          //     }
          //   })
          //   .catch((error) => {
          //     console.error(error)
          //   })
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
