<template>
  <a-modal
    title="电子收据"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="Id"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hidden>
          <a-input v-decorator="['id', {}]"/>
          <a-input v-decorator="['customerId', {}]"/>
        </a-form-item>
        <a-form-item
          label="createdId"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hidden>
          <a-input v-decorator="['createdId', {}]"/>
        </a-form-item>
        <a-row :gutter="24" >
          <a-col :md="12">
            <a-form-item
              label="收据编号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input read-only="read-only" v-decorator="['receiptCode', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              label="入账日期"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-date-picker v-decorator="['entryTime', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              label="交款单位"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input v-decorator="['customerName', {}]" @click="openModel"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="交款方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择付款方式" v-decorator="['payment', {}]">
                <a-select-option value="1">银行卡</a-select-option>
                <a-select-option value="2">微信</a-select-option>
                <a-select-option value="3">支付宝</a-select-option>
                <a-select-option value="4">现金</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              label="人民币"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input @blur="Rmb()" v-decorator="['money', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              label="￥"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input v-decorator="['capitalRenminbi', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col>
            <a-form-item
              label="收款事由"
              :labelCol="labelCols"
              :wrapperCol="wrapperCol">
              <a-textarea v-decorator="['remarks', {}]"></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">

          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              label="是否显示日期"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-radio-group name="radioGroup" v-decorator="['isOptional', {initialValue: 0}]">
                <a-radio :value="0">是</a-radio>
                <a-radio :value="1">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              label="日期"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-date-picker v-decorator="['optionalTime', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              label="出纳"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input read-only="read-only" v-decorator="['createdName', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              label="经办"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <!--              <a-select mode="multiple" placeholder="请选择经办"  @change="handleChange" v-decorator="['transactor',{rules: [{required: true, message: '请选择经办！'}]}]">-->
              <a-select mode="multiple" @change="handleChange" placeholder="请选择经办" v-decorator="['transactor',{rules: [{required: true, message: '请选择经办！'}]}]">
                <a-select-option v-for="i in transactors" :key="i.userId">{{ i.salesmanName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" >
            <a-form-item
              label="单位盖章"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <receipt-sale-contract ref="receiptContract" @custom-change="contractChange"></receipt-sale-contract>
  </a-modal>
</template>

<script>
import { saveReceipt, getRmb, getReceiptCode, listSaleUser } from '@api/electronicReceipt'
import ReceiptSaleContract from './ReceiptSale'

export default {
  name: 'Receipt',
  components: {
    ReceiptSaleContract
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      labelCols: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      addOredit: 'save',
      queryBoolean: false,
      options: [],
      Selected: '',
      couponSelected: 0,
      transactors: [],
      transactor: ''
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    // 自动生成编号
    // 获取客户列表
    // 获取销售列表
  },
  methods: {
    add () {
      this.visible = true
      this.receiptCode()
      this.getListSaleUser()
      this.addOredit = 'save'
    },
    receiptCode () {
      getReceiptCode().then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.form.setFieldsValue({ receiptCode: res.data })
            this.form.setFieldsValue({ createdName: this.$store.getters.userInfo.userName })
            this.form.setFieldsValue({ createdId: this.$store.getters.userInfo.id })
          }
        }
      })
    },
    getListSaleUser () {
      listSaleUser().then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            console.log('res.data', res.data)
            this.transactors = res.data
          }
        }
      })
    },
    handleChange (value) {
      console.log(`selected ${value}`)
      this.transactor = `${value}`
    },
    openModel () {
      console.log('openModel click')
      this.$refs.receiptContract.query()
    },
    contractChange (data) {
      console.log('data', data)
      this.form.setFieldsValue({ customerName: data.name })
      this.form.setFieldsValue({ customerId: data.id })
    },
    query (record) {
      this.queryBoolean = true
      console.log('query :' + JSON.stringify(record))
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
    },
    // 数字转大写
    Rmb () {
      var param = {}
      if (this.form.getFieldValue('money') === undefined || this.form.getFieldValue('money').length < 1) {
        return
      }
      param = { money: this.form.getFieldValue('money') }
      getRmb(param).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.form.setFieldsValue({ capitalRenminbi: res.data })
          }
        }
      }).catch(function (err) {
        alert(err)
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          // 模拟后端请求 2000 毫秒延迟
          // setTimeout(() => resolve(), 2000)
          console.log('this.addOredit :' + _this.addOredit)
          if (_this.addOredit == 'save') {
            _this.$set(values, 'Authorization', _this.$store.getters.token)
            _this.$set(values, 'transactor', _this.transactor)
            saveReceipt(values).then((data) => {
              if (data.code == 200) {
                _this.$message.success('保存成功')
                _this.$emit('ok')
              } else {
                _this.$message.error(data.msg)
              }
            }).catch(() => {
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              _this.form.resetFields()
              _this.close()
            })
          }
        }
      }
      )
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
