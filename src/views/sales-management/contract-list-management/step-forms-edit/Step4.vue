<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
    </div>
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">运输方式/交货地址</a-col>
      </a-row>
      <a-form
        :form="form"
        @submit="handleSubmit"
        class="form wdf-form"
      >
        <a-form-item
        >
          <a-row class="wdf-row">
            <a-col class="col-border" :span="4" justify="center" align="middle">交货地点及联系人</a-col>
            <a-col class="col-border" :span="20" justify="center" align="middle">
              <a-row class="inner-row">
                <a-col :span="6">详细地址（省市区县乡镇街道）:</a-col>
                <a-col :span="18">
                  <a-input
                    type="text"
                    @change="deliveryAddressChange"
                    v-decorator="[
                      'deliveryAddress',
                      {rules: [{ required: false, message: '填写详细地址' }]}
                    ]" />
                </a-col>
              </a-row>
              <a-row class="inner-row">
                <a-col :span="6">联系人姓名:</a-col>
                <a-col :span="18">
                  <a-input
                    type="text"
                    @change="deliveryNameChange"
                    v-decorator="[
                      'deliveryName',
                      {rules: [{ required: false, message: '填写联系人姓名' }]}
                    ]" />
                </a-col>
              </a-row>
              <a-row class="inner-row">
                <a-col :span="6">联系人电话号码:</a-col>
                <a-col :span="18">
                  <a-input
                    type="text"
                    @change="deliveryMobileChange"
                    v-decorator="[
                      'deliveryMobile',
                      {rules: [{ required: false, message: '填写联系人电话号码' }]}
                    ]" />
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="4" justify="center" align="middle">运输方式及到达（港）站和费用承担</a-col>
            <a-col class="col-border" :span="20" justify="center" align="middle">
              <a-row class="inner-row6">
                <a-col :span="6">运费类型：</a-col>
                <a-col :span="18">
                  <a-radio-group @change="freightTypeSelected" v-decorator="['freightType',{initialValue: 0}]">
                    <a-radio :value="0">
                      含运费
                    </a-radio>
                    <a-radio :value="1">
                      不含运费
                    </a-radio>
                  </a-radio-group>
                </a-col>
              </a-row>
              <a-row class="inner-row6">
                <a-col :span="6">运输方式：</a-col>
                <a-col :span="18">
                  <a-radio-group @change="transportTypeSelected" v-decorator="['transportType',{initialValue: 0}]">
                    <a-radio :value="0">
                      自提
                    </a-radio>
                    <a-radio :value="1">
                      代办运输
                    </a-radio>
                  </a-radio-group>
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
import { getQueryOne, saveDeliveryAddress, deleteQueryOne } from '@/api/contractListManagement'
export default {
  name: 'Step4',
  components: {},
  props: {
    queryonedata: {
      type: Object
    }
  },
  data () {
    const queryOneData = { ...this.queryonedata }
    return {
      queryOneData: queryOneData,
      // form
      form: this.$form.createForm(this),
      contractNum: this.queryonedata.contractNum, // 合同编号
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
        that.queryOneData = res.data
        that.form.setFieldsValue({
          id: this.queryonedata.id || 0,
          deliveryAddress: res.data.deliveryAddress || '',
          deliveryName: res.data.deliveryName || '',
          deliveryMobile: res.data.deliveryMobile || '',
          freightType: res.data.freightType || 0,
          transportType: res.data.transportType || 0
        })
        that.contractId = this.queryonedata.id
        that.id = this.queryonedata.id
        that.contractId = res.data.id
        that.deliveryAddress = res.data.deliveryAddress
        that.deliveryName = res.data.deliveryName
        that.deliveryMobile = res.data.deliveryMobile
        that.freightType = res.data.freightType
      }).catch(error => {
        console.error(error)
      })
      that.form.setFieldsValue({
        id: this.queryonedata.id || 0,
        deliveryAddress: this.queryonedata.deliveryAddress || '',
        deliveryName: this.queryonedata.deliveryName || '',
        deliveryMobile: this.queryonedata.deliveryMobile || '',
        freightType: this.queryonedata.freightType || 0,
        transportType: this.queryonedata.transportType || 0
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
            id: that.queryonedata.id,
            deliveryAddress: values.deliveryAddress,
            deliveryName: values.deliveryName,
            deliveryMobile: values.deliveryMobile,
            freightType: values.freightType,
            transportType: values.transportType
          }
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveDeliveryAddress(params).then((res) => {
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
    // 详细地址
    deliveryAddressChange (e) {
      this.deliveryAddress = e.target
    },
    // 联系人姓名
    deliveryNameChange (e) {
      this.deliveryName = e.target
    },
    // 联系人手机号
    deliveryMobileChange (e) {
      this.deliveryMobile = e.target
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
    padding: 10px 0;
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
  .inner-row{
    width: 80%;
  }
  .inner-row6{
    width: 60%;
  }
  .ant-row.ant-form-item{
    margin-bottom: 0;
  }
  .ant-form-item-children{
    display: block;
  }
  .ant-form-item-control-wrapper{
    width: 100%;
  }
</style>
