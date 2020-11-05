<template>
  <a-modal
    title="操作"
    :width="800"
    :style="{height: '550px'}"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    v-model="visible">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12">
            <a-form-item
              label="项目编号">
              <a-input
                disabled
                placeholder="项目编号"
                v-decorator="[ 'advancesCode', {rules: [{ message: '请输入项目编号', whitespace: true}]} ]"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12">
            <CustomerSelect ref="customerSelect" :options="customerSelectOptions" />
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12">
            <a-form-item
              label="结算方式">
              <a-select
                placeholder="结算方式"
                v-decorator="[ 'bankId', {rules: [{ required: true, message: '请选择结算方式'}]} ]">
                <a-select-option :key="item.id" @click="writeAccountNum(item)" v-for="item in moneyTypes" :value="item.id">{{
                  item.unitName
                }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12">
            <a-form-item
              label="收款帐号">
              <a-input
                disabled
                placeholder="收款帐号"
                v-decorator="[ 'accountNum', {rules: [{ required: true, message: '请选择结算方式'}]} ]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12">
            <a-form-item
              label="产品类别">
             <!-- <a-select
                placeholder="产品类别"
                v-decorator="[ 'productType', {rules: [{ required: true, message: '请选择产品类别'}]} ]">
                <a-select-option :value="1">常规产品</a-select-option>
                <a-select-option :value="2">非常规产品</a-select-option>
              </a-select>-->
              <a-select placeholder="产品类别" v-decorator="['productType',{rules: [{ required: true, message: '请选择产品类别'}]}]">
                <a-select-option v-for="ptype in productTypes" :key="ptype.id" :value="ptype.id">{{ ptype.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12">
            <a-form-item
              label="收款日期">
              <a-date-picker
                style="width: 100%"
                v-decorator="[
                  'receiptTime',
                  {rules: [{ required: true, message: '请选择收款日期'}]}
                ]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12">
            <a-form-item
              label="结算实收金额(元)">
              <a-input
                placeholder="结算实收金额"
                v-decorator="[ 'paidMoney', {rules: [{ required: true, message: '结算实收金额', whitespace: true}]} ]"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12">
            <a-form-item
              label="预收原因">
              <a-textarea
                v-decorator="['remark']"/>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { advancesSave, goAdd ,advancesDetail ,advancesUpdate} from '@/api/advances'
  import { getAccountBankList } from '@/api/receipt'
  import { getDictionary} from '@/api/common'
  import moment from 'moment' 
  import CustomerSelect from '@/components/CustomerList/CustomerSelect'
  export default {
    name: 'advancesAdd',
    components: { CustomerSelect },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        queryBoolean: false,
        saleCustomers: [],
        productTypes:[],
        moneyTypes: [],
        customerId: '',
        accountNum: '',
        address: '',
        form: this.$form.createForm(this),
        id:null, //ID
        isEdit:false,
        customerSelectOptions:{
          wrapperStyle:{
            position: 'relative',
            top:'14px'
          },
          formLayout:'vertical',
          formItemLayout:{
            labelCol: { span: '' },
            wrapperCol: { span: '' },
          }
        }
      }
    },
    created (record) { 
      
    },
    methods: {
      async add (id,action) {
        let that = this
        that.id = id
        that.isEdit = action === 'edit' ? true : false 

        this.visible = true
        try{
          this.$refs.customerSelect.reset()
        }catch(err){}
        await Promise.all([
          getDictionary({ text: '产品类型' }).then(res => { //获取所有产品类型
            this.productTypes = res.data
          }),
          goAdd().then((res) => {  //获取项目编号
            const data = { 'advancesCode': res.data }
            this.$nextTick(() => {
              this.form.setFieldsValue({ ...data })
            })
          }),
          getAccountBankList().then((res) => { //获取结算方式
            console.log('getAccountBankList res :' + JSON.stringify(res))
            this.moneyTypes = res.data
            console.log('this.moneyTypes' + JSON.stringify(this.moneyTypes))
          })
        ])

        if(id && action === 'edit'){
          const data = { 'id': id }
          advancesDetail(data).then((res) => {
            console.log(JSON.stringify(res.data))
            //this.productType = res.data.productType
            that.data = res.data
            //填充收款账号
            let account = that.moneyTypes.find(item =>item.id === that.data.bankId)
            if(account){
              that.data.accountNum = account.accountNum
            }
            that.data.paidMoney = String(that.data.paidMoney)
            that.data.receiptTime = moment(that.data.receiptTime)
            this.$nextTick(() => {
              this.form.setFieldsValue({ ...that.data })
            })

            this.$refs.customerSelect.fill({id:res.data.saleCustomerId,name:res.data.customerName})
          })
        }
      }
    ,
    async handleOk () {
      const _this = this
      let customerSelectResult = await this.$refs.customerSelect.validate().then(res =>res)
      console.log(customerSelectResult)
      if(customerSelectResult.err){
        return
      }

      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          this.$set(values, 'receiptTime', values.receiptTime.format('YYYY-MM-DD'))
          _this.confirmLoading = true

          values.saleCustomerId = customerSelectResult.values.customerId
          values.customerName = customerSelectResult.values.customerName
          if(_this.isEdit){
            values.id = _this.id 
            advancesUpdate(values).then((data) => {
              if(data && +data.code === 200){
                _this.$emit('ok')
              }
              if(data && data.msg){
                _this.$message.success(data.msg)
              }
            }).catch((err) => {
              console.log(err)
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              _this.form.resetFields()
              _this.$refs.customerSelect.reset()
              _this.close()
            })
          }else{
            advancesSave(values).then((data) => {
              // Do something
              console.log(data)
              _this.$message.success('保存成功')
              _this.$emit('ok')
            }).catch(() => {
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              _this.form.resetFields()
              _this.close()
            })
          }
          // eslint-disable-next-line eqeqeq
        }
      }
      )
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleCancel () {
      this.close()
      this.form.resetFields()
    },
    writeAccountNum (record) {
      const data = { 'accountNum': record.accountNum }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    filterCustomerOption (input, option) { // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
      console.log('下拉框带搜索input', input)
      console.log('下拉框带搜索option', option)
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // option.componentOptions.children[0].text   结果是"郑州依依不舍"
    }
  }
}
</script>
<style>

</style>
