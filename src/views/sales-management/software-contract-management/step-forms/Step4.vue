<template>
  <div class="software-contract-step4-wrapper">
    <a-form :form="form" layout="inline">
    <a-form-item><a-input hidden type="text" v-decorator="['id']"/></a-form-item>
    <table class="custom-table custom-table-border">
      <caption>支付、交付与验收</caption>
      <tbody>
        <tr>
          <td style="width:300px">支付</td>
          <td>
            <p>合同签署２个工作日内向甲方支付本合同费用40％款项应付金额 <span class="underline">{{payPriceA | moneyFormatNumber}}</span> 元</p>
            <p>部署实施２个工作日内向甲方支付本合同费用40％款项应付金额 <span class="underline">{{payPriceB | moneyFormatNumber}}</span> 元</p>
            <p>交付、验收完毕后3个工作日内向甲方支付本合同剩余费用应付金额 <span class="underline">{{payPriceC | moneyFormatNumber}}</span> 元</p>
          </td>
        </tr>
        <tr>
          <td>交付</td>
          <td>
            <p>甲方应于本合同签署并确认收到乙方提供的运行环境后 
              <a-form-item><a-input type="text" style="text-align:center;" v-decorator="['deliveryDay', { rules: [{ required: true, message: '请输入交付天数' }] }]"/></a-form-item>
              天内向乙方完成交付
            </p>
            <p>甲方应在收到乙方书面异议后 
              <a-form-item><a-input type="text" style="text-align:center;" v-decorator="['classfiyDay', { initialValue:3,rules: [{ required: true, message: '请输入甲方承诺问题技术处理允许天数' }] }]"/></a-form-item>
              天内给予处理，否则，视为接受乙方提出的处理意见
            </p>
          </td>
        </tr>
        <tr>
          <td>维护</td>
          <td>
            <p>自乙方验收通过之日起 
              <a-form-item><a-input type="text" style="text-align:center;" v-decorator="['defendYear', { initialValue:1,rules: [{ required: true, message: '请输入甲方承诺维护周期' }] }]"/></a-form-item>
              年内，甲方应向乙方免费提供产品维护服务，上述期限届满后，甲方可继续向乙方提供产品维护服务，<br/>
              具体费用 
              <a-form-item><a-input type="text" style="text-align:center;width:300px;" v-decorator="['defendPayDesc', { initialValue:'每年按照合同费用的15%收取维护费用',rules: [{ required: true, message: '请输入维护费用说明' }] }]"/></a-form-item>
              。服务器、带宽、微信等第三方费用由乙方自行承担。</p>
          </td>
        </tr>
        <tr>
          <td>接收人信息</td>
          <td>
            <a-row  :gutter="20">
              <a-col :span=12 >
                <p>
                  <span>接收人：</span> 
                  <a-form-item><a-input type="text" v-decorator="['receiveName', { rules: [{ required: true, message: '请输入姓名' }] }]"/></a-form-item>
                </p>
              </a-col>
              <a-col :span=12>
                <p>
                  <span>联系电话：</span>
                  <a-form-item><a-input type="text" v-decorator="['receiveTel', { rules: [{ required: true, message: '请输入电话' }] }]"/></a-form-item>
                </p>
              </a-col>
              <a-col :span=12>
                <p> 
                  <span>微信号：</span> 
                  <a-form-item><a-input type="text" v-decorator="['receiveWx', { rules: [{ required: true, message: '请输入微信号' }] }]"/></a-form-item>
                </p>
              </a-col>
              <a-col :span=12>
                <p>
                  <span>邮箱：</span>
                  <a-form-item><a-input type="text" v-decorator="['receiveMail', { rules: [{ required: true, message: '请输入邮箱' }] }]"/></a-form-item>
                </p>
              </a-col>
            </a-row>
          </td>
        </tr>
      </tbody>
    </table>
    </a-form>

    <a-row type="flex">
      <a-col :span="24" justify="center" align="middle">
        <a-button style="margin-right:8px;" @click="prevStep">上一步</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getSoftwareContractQueryOne,updateSoftwareContract} from '@/api/contractListManagement'
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
      form: this.$form.createForm(this),
      queryOneData: queryOneData,
      id: 0
    }
  },
  computed:{
    payPriceA:function(){ //合同签署 合同费用40％
      return this.queryOneData.totalAmount * 0.4
    },
    payPriceB:function(){ //部署实施 合同费用40％
      return this.queryOneData.totalAmount * 0.4
    },
    payPriceC:function(){ //剩余 合同费用20％
      return this.queryOneData.totalAmount * 0.2
    } 
  },
  watch: {
    $route (to, from) {
      
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      console.log('step 4 init called...')
      const that = this
      that.id = that.queryonedata.id
      const params = { id: that.queryonedata.id }
      getSoftwareContractQueryOne(params).then(res => {
        debugger
        that.queryOneData = res.data
        that.form.setFieldsValue({
          id: this.queryonedata.id || 0,
          classfiyDay:res.data.classfiyDay,
          defendPayDesc:res.data.defendPayDesc || '每年按照合同费用的15%收取维护费用',
          defendYear:res.data.defendYear,
          deliveryDay:res.data.deliveryDay,
          receiveMail:res.data.receiveMail,
          receiveName:res.data.receiveName,
          receiveTel:res.data.receiveTel,
          receiveWx:res.data.receiveWx
        })
      }).catch(error => {
        console.error(error)
      })
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit (e) {
      e.preventDefault()
    },
    // 点击下一步
    nextStep (status) {
      const that = this
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          updateSoftwareContract(values).then((res) => {
            that.id = res.data.id
            if(status != 1){
              that.$emit('nextStep', { ...res.data })
            }else {
              that.$message.success('保存成功')
            }
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
    }
  }
}
</script>

<style scoped>
  .software-contract-step4-wrapper .custom-table p{
    line-height: 39px;
    text-align: left;
  }
  .software-contract-step4-wrapper .custom-table p span:first-child{
    display: inline-block;
    width: 80px;
  }

  .software-contract-step4-wrapper .custom-table .underline{
    display: inline-block;
    width: auto !important;
    padding: 0 10px;
    border-bottom: 1px dashed #ddd;
  }

  
  .software-contract-step4-wrapper .custom-table >>> .ant-form-item{
    margin:0 7px;
  }
  .software-contract-step4-wrapper >>> p{
    margin-bottom: 0;
  }
</style>
