<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
      <a-button class="btn btn-primary" icon="download" @click="getPdf('pdfDom')">导出PDF</a-button>
    </div>
    <div class="contract-main" id="pdfDom">
      <div class="main-top" style="width: 60%;margin: auto;">
        <div class="contract-title-part">
          <h2>延迟付款承诺书</h2>
          <div>
            <span>合同编号：</span>
            <span> {{ contractNum }}</span>
          </div>
          <div>
            <span>承诺方：</span>
            <span> {{ customerName }}</span>
          </div>
          <div>
            <span>延迟付款原因：</span>
            <span> {{ reason }}</span>
          </div>
          <div>
            <span>承诺付款时间：</span>
            <span> {{ promiseTime }}</span>
          </div>
          <div>
            <span>延迟申请金额及币别：</span>
            <span> {{ delayedAmount }}{{ currency }}</span>
          </div>
          <div>
            <span>金额大写：</span>
            <span> {{ MaxDelayedAmount }}</span>
          </div>

          <div style="margin: 50px 0 50px 0">
            <span> 双方通过微信号、邮箱相互传递资料，作为合同的一部分，履行法律效力。</span>
          </div>

          <div>
            <span>承诺方全称：</span>
            <span> {{ AllCustomerName }}</span>
          </div>
          <div>
            <span>电话：</span>
            <span> {{ mobile }}</span>
          </div>
          <div>
            <span>地址：</span>
            <span> {{ address }}</span>
          </div>
          <div>
            <span>微信号：</span>
            <span> {{ wx }}</span>
          </div>
          <div>
            <span>电子邮箱：</span>
            <span> {{ email }}</span>
          </div>
          <div>
            <span>代表：</span>
            <span> (签字)</span>
          </div>
          <div>
            <span>盖章：</span>
            <span> (加盖公章)</span>
          </div>
          <div>
            <span>日期：</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getContractById } from '@/api/delayedPayment'
import { getRmb } from '@api/electronicReceipt'
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import moment from 'moment'
import ATextarea from 'ant-design-vue/es/input/TextArea'

export default {
  name: 'CreatePromise',
  components: {
    ATextarea,
    moment
  },
  data () {
    return {
      form: this.$form.createForm(this),
      title: 'wenjian',
      memberLoading: false,
      promiseTime: moment(),
      delayedTime: moment(),
      contract: {},
      record: {},

      contractNum: '',
      customerName: '',
      reason: '',
      currency: '',
      delayedAmount: '',
      AllCustomerName: '',
      mobile: '',
      address: '',
      wx: '',
      email: '',
      MaxDelayedAmount: ''
    }
  },
  computed: {},
  watch: {},
  mounted () {
    this.record = this.$route.params.record
    console.log('this.record', this.record)
    this.getContract()
    this.Rmb()
  },
  methods: {
    info () {
      this.$nextTick(() => {
        this.contractNum = this.record.contractNum
        this.customerName = this.record.customerName
        this.reason = this.record.reason
        if (this.record.currency == 1) {
          this.currency = '元'
        }
        this.promiseTime = this.record.promiseTime
        this.delayedAmount = this.record.delayedAmount

        this.AllCustomerName = this.record.customerName
        this.mobile = this.contract.customerInfo.mobile
        this.address = this.contract.customerInfo.address
        this.wx = this.contract.customerInfo.wx
        this.email = this.contract.customerInfo.email
      })
    },
    // 数字转大写
    Rmb () {
      var param = { money: this.record.delayedAmount }
      getRmb(param).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.MaxDelayedAmount = res.data
          }
        }
      }).catch(function (err) {
        alert(err)
      })
    },
    // 返回
    goBack () {
      this.$router.push({ name: 'delayedPayment' })
      this.$destroy('createPromise')
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit (e) {

    },
    getContract () {
      const parameter = { 'id': this.record.contractId }
      getContractById(parameter).then((res) => {
        this.contract = res.data
        // 把获取到的合同信息放入表中
        this.info()
      }).catch(error => {
        console.error(error)
      })
    },
    getPdf (id) {
      html2Canvas(document.querySelector(`#${id}`), {
        // allowTaint: true
        useCORS: true// 看情况选用上面还是下面的，
      }).then(function (canvas) {
        const contentWidth = canvas.width
        const contentHeight = canvas.height
        const pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        const imgWidth = 595.28
        const imgHeight = 592.28 / contentWidth * contentHeight
        const pageData = canvas.toDataURL('image/jpeg', 1.0)
        const PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save('延迟付款承诺书.pdf')
      }
      )
    }
  }
}
</script>

<style lang="less" scoped>
  .wdf-row {
    border: 1px solid #ddd;
  }

  .col-border {
    border: 1px solid #ddd;
    padding: 10px 0;
    border-bottom: none;
    min-height: 60px;
    box-sizing: border-box;
  }

  .col-border ~ .col-border {
    border-left: none;
  }

  .wdf-form {
    margin-top: 12px;
    padding: 12px;
  }

  .ant-row.ant-form-item {
    margin-bottom: 0;
  }

  .contract-title-part{
    color: #000;
    font-size: 18px;
    line-height: 2;
  }
  .contract-title-part h2{
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    color: #000;
  }
</style>
