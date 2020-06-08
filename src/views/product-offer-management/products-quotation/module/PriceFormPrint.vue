<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    okText="下载"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <div id="price-print-form-wrapper">
        <div class="header">
          <div class="header_logo">
            <div class="header_logo_img">
              <img src="@/assets/icon_contract.jpg" style="width:48px;height:56px;" alt="合同图标" />
            </div>
            <div class="header_logo_txt">
              <div>江苏万德福公共设施科技有限公司</div>
              <div>JiangSu Wonderful Infrastructure Manufacturing co.,Ltd</div>
            </div>
          </div>
          <div class="header_title">
            <h2 style="font-weight: bold;margin-bottom: 5px;font-size: 200%;">
              报价单
              <span style="font-size:75%;">[Quotation]</span>
            </h2>
            <div>报单编号：{{detail.quoteCode}}</div>
            <div>报价时间：{{detail.quoteTime}}</div>
          </div>
        </div>

        <div class="product-main-wrapper add-form__bd-item" :style="borderImageObj">

          <div
            class="slider-bar"
            style="flex:0 0 250px;margin-right:15px;background-color: #757882;"
          >
            <div class="custom_info">
              <div class="custom_info_sell">
                <p class="__ele-english" data-english="quotation party">报价方：</p>
                <p
                  class="__ele-english"
                  data-english="JiangSu Wonderful Infrastructure Manufacturing co.,Ltd"
                >江苏万德福公共设施科技有限公司</p>
                <p style="display:flex;">
                  <span class="__ele-english" data-english="contact">联系人：</span>
                  <span>{{detail.saleUserName}}</span>
                </p>
                <p style="display:flex;">
                  <span class="__ele-english" data-english="phone">电话：</span>
                  <span>{{detail.saleUserPhone}}</span>
                </p>
              </div>
              <div class="custom_info_buy">
                <p class="__ele-english" data-english="inquiry party">询价方：</p>
                <p>{{detail.customerName}}</p>
                <p style="display:flex;">
                  <span class="__ele-english" data-english="contact">联系人：</span>
                  <span>{{detail.customerContacts}}</span>
                </p>
                <p style="display:flex;">
                  <span class="__ele-english" data-english="phone">电话：</span>
                  <span>{{detail.customerMobile}}</span>
                </p>
              </div>
            </div>
          </div>

          <div class="main-content " style="flex:1;">

              <p
                class="__ele-english"
                data-english="the following is the details of your company's inquiry product, please read: if you have any questions, please Contact us in time."
              >以下为贵公司询价产品明细，请详阅：如有疑问，请及时与我司联系，谢谢！</p>
              <table class="custom-table custom-table-border">
                <tr class="__table-thead">
                  <td>
                    <span class="__ele-english" data-english="product name">产品名称</span>
                  </td>
                  <td>
                    <span class="__ele-english" data-english="number">数量</span>
                  </td>
                  <td>
                    <span class="__ele-english" data-english="unit-price">单价</span>
                  </td>
                  <td>
                    <span class="__ele-english" data-english="price">总价</span>
                  </td>
                  <td>
                    <span class="__ele-english" data-english="remarks">备注</span>
                  </td>
                </tr>
                <tr>
                  <td>{{detail.productName}}</td>
                  <td>{{detail.productNum}}</td>
                  <td>{{detail.unitPrice | moneyFormatNumber}}</td>
                  <td>{{(+detail.unitPrice * +detail.productNum) | moneyFormatNumber}}</td>
                  <td>{{+detail.remark === 1 ? '含税' : '不含税' }}</td>
                </tr>
              </table>


            <div class="add-form__bd-item " style="padding-bottom:0;margin-top:1em;" :style="borderImageObj123">
              <p class="__ele-english" data-english="product function List">产品功能清单：</p>

              <table class="custom-table custom-table-border">
                <tr class="__table-thead">
                  <td>
                    <span class="__ele-english" data-english="Product name/model">产品名称/型号</span>
                  </td>
                  <td>
                    <span class="__ele-english" data-english="Product picture">图片</span>
                  </td>
                </tr>
                <tr>
                  <td>{{detail.productName}}&nbsp;&nbsp;{{detail.model}}</td>
                  <td>
                    <img
                      style="min-width:0;max-width:80%;width:auto;height:auto;overflow:hidden;"
                      :src="detail.productPic"
                    />
                  </td>
                </tr>
              </table>

              <SelectProductViewHTML key="v2" :productInfo="viewDataSourceHTMLWithoutTitle" />
            </div>
          </div>
        </div>
        <div class="add-form__bd-item" :style="borderImageObj123">
          <p class="__ele-english" data-english="quotation description">报价说明：</p>
          <p
            style="height:auto;border:1px solid #ddd;padding:10px;border-radius:3px;" 
            v-html="detail.quoteExplainHTML"
          ></p>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import PngLine from '@/assets/png_line.png'
import { getListSaleContractUser } from '@/api/contractListManagement'
import { priceAdjustProductQuoteDetail } from '@/api/productOfferManagement'
import SelectProductViewHTML from './SelectProductViewHTML'
import util from '@/components/_util/util'
export default {
  name: 'AddForm',
  components: {
    SelectProductViewHTML
  },
  data() {
    return {
      borderImageObj:{
        'display':'flex',
        'border-top':'4px solid #ddd',
        'border-image':`url(${PngLine}) 27 round`
      },
      borderImageObj123:{
        'border-top':'4px solid #ddd',
        'border-image':`url(${PngLine}) 27 round`
      },
      visible: false,
      actionType: 'add',
      spinning: false,
      saleUserList: [],
      record: {},
      detail: {},
      viewDataSourceHTMLWithoutTitle: {}
    }
  },
  computed: {
    modalTitle() {
      return '查看报价单'
    }
  },
  methods: {
    init() {
      let that = this
      let queue = []
      let task1 = getListSaleContractUser().then(res => (that.saleUserList = res.data))
      queue.push(task1)
      return Promise.all(queue)
    },
    async handleOk() {
      util.handleWindowPrint('#price-print-form-wrapper', '产品报价单')
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}

      await that.init()
      that.visible = true

      that.$nextTick(() => that.editAction())
    },
    editAction() {
      let that = this
      that.spinning = true
      priceAdjustProductQuoteDetail({ id: this.record.id })
        .then(res => {
          that.spinning = false
          that.detail = { ...res.data }
          let _quoteExplain = that.detail.quoteExplain
          if(_quoteExplain){
            that.detail.quoteExplainHTML = _quoteExplain.split('\n').map(p =>`<div>${p}</div>`).join('')
          }
          let target = that.saleUserList.find(u => u.userId === res.data.saleUserId)
          if (target) {
            that.detail.saleUserName = target.salesmanName
            that.detail.saleUserPhone= target.mobile || target.userInfo.mobile || ''
          }
          that.viewDataSourceHTMLWithoutTitle = {
            __config: {
              showTitle: false,
              showEnglish: true
            },
            optStand: [...res.data.productQuoteChooses.filter(p => +p.type === 1)],
            optSelect: [...res.data.productQuoteChooses.filter(p => +p.type === 2)]
          }

          that.$nextTick(() => that.translate())
        })
        .catch(err => (that.spinning = false))
    },
    translate() {
      document.querySelectorAll('.__ele-english').forEach((ele, idx, arr) => {
        let _w = ele.dataset['english']
        let _has_translated = ele.dataset['translated'] || '0'
        if(_has_translated === '0'){
          ele.setAttribute('data-translated','1')
          ele.innerHTML = ele.innerHTML + `<br/><i class="__translate__" style="font-size:80%;">${_w}</i>`
        }
      })
    }
  }
}
</script>

<style scoped>
#price-print-form-wrapper .header {
  display: flex;
  align-items: center;
  padding: 0 0 10px 0;
  overflow: hidden;
}
#price-print-form-wrapper .header .header_logo {
  flex: 1;
  display: flex;
  align-items: center;
}

#price-print-form-wrapper .header .header_logo .header_logo_txt {
  margin-left: 10pt;
}

#price-print-form-wrapper .header_info {
  display: flex;
  justify-content: space-between;
}

#price-print-form-wrapper .custom_info {
  color: #fff !important;
  background-color: #757882;
  font-size: 110%;
}
#price-print-form-wrapper .custom_info p {
  margin-bottom: 20px;
}
#price-print-form-wrapper .custom_info .custom_info_sell,
#price-print-form-wrapper .custom_info .custom_info_buy {
  position: relative;
  margin: 25% 0 0 20px;
}
#price-print-form-wrapper .custom_info .custom_info_sell::before,
#price-print-form-wrapper .custom_info .custom_info_buy::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  width: 30%;
  height: 4px;
  background-color: #d4e8f7;
}

#price-print-form-wrapper .custom_info .__ele-english i {
  color: #fff !important;
}
#price-print-form-wrapper .custom-table-border th,
#price-print-form-wrapper .custom-table-border td {
  padding: 5px 10px;
}

#price-print-form-wrapper >>> .custom-table-border .__table-thead {
  background-color: #d4e8f7;
}

#price-print-form-wrapper .add-form__bd-item {
  padding: 15px 0;
}
</style>