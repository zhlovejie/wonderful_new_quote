<template>
<a-modal :title="modalTitle" :width="1050" :visible="visible" :footer="footer" @cancel="handleCancel" :maskClosable="false">
  <a-spin :spinning="spinning">
    <div >
      <div class="top-ation clearfix margin-b">
        <!-- <a-button class="fl-r" type="primary" @click="goBackConstractList" icon="backward">返回</a-button> -->
        <!-- <a-button class="fl-r" type="primary" @click="getPDF()" >导出成PDF</a-button> -->
        <a :href="detail.pdfUrl" target="_blank" class="ant-btn ant-btn-primary fl-r">导出成PDF</a>
      </div>

      <div class="contract-wrap" id="pdfDom">
        <div class="contract-header">
          <div class="log-wrap">
            <img src="@/assets/icon_contract.jpg" style="width: 48px; height: 56px" alt="合同图标" />
          </div>
          <div class="top-right-page">
            <div class="top-right-item">{{ enterpriseName }}</div>
            <div class="top-right-item">{{ enterpriseNameEnglish }}</div>
          </div>
        </div>
        <div class="contract-main">
          <h2 style="text-align: center">{{ contractTitle }}</h2>
          <div class="main-top" style="padding: 10pt 0">
            <div class="contract-title-part">
              <div>
                <span>供方(甲方)：</span>
                <span> {{ supplier }}</span>
              </div>
              <div>
                <span>需方(乙方)：</span>
                <span> <span class="span-underline"> {{ detail.customerName }} </span></span>
              </div>
            </div>
            <div class="contract-title-num">
              <div class="title-num-item">
                <span>合同编号 :</span>
                <span>{{ detail.contractNum }}</span>
              </div>
              <div class="title-num-item">
                <span>签订时间 :</span>
                <span :style="{color: detail.signingDate !== moment().format('YYYY-MM-DD') ? 'red' : ''}" >{{ detail.signingDate }}</span>
              </div>
            </div>
          </div>
          <div class="main-content-wrap">
            <div class="content-p">一、经销产品期限：</div>
            <div class="content-p p-text-index">1.1本协议有效期 <span class="span-underline">{{ detail.effectiveStart }} 至 {{detail.effectiveEnd}}</span> 。</div>

            <div class="content-p">二、甲方的责任和义务</div>
            <div class="content-p p-text-index">2.1甲方应确保提供给乙方的产品为合格产品。</div>
            <div class="content-p p-text-index">2.2甲方安排专业人员与乙方及时沟通联系，保证信息的流通及反馈。</div>
            <div class="content-p p-text-index">2.3甲方应提供给乙方产品的经销价格。</div>

            <div class="content-p">三、乙方的责任和义务</div>
            <div class="content-p p-text-index">3.1乙方不得经营销售假冒或仿冒甲方产品的侵权商品，或其它假冒伪劣商品，一经发现，甲方可中止合约并采取法律行动，追究乙方的责任。</div>
            <div class="content-p p-text-index">3.2乙方必须安排一名专职销售人员与甲方进行业务对接。</div>
            <div class="content-p p-text-index">3.3如甲乙双方发现任何第三方侵犯甲乙双方或甲乙双方关联公司的专利、商标、商号专用权或其它知识产权的行为应及时通知对方，并协助对方共同维权。</div>
            
            <div class="content-p">四、流动资金与付款</div>
            <div class="content-p p-text-index">4.1乙方承诺对销售甲方的产品投入足够的流动资金。</div>
            <div class="content-p p-text-index">4.2乙方订购甲方产品须以人民币进行付款，乙方承诺按照甲乙双方所约定的付款方式按时支付货款。</div>

            <div class="content-p">五、资质借用</div>
            <div class="content-p p-text-index">5.1如乙方因经营所需借用甲方资质，以甲方的名义进行产品销售或项目投标，需经甲方同意并签署《资质借用协议》后方可借用。</div>
            <div class="content-p p-text-index">5.2乙方承诺在此产品销售以及项目经营过程中，甲方代替乙方所签订的所有与本销售行为以及项目相关的合同、协议均为乙方的意愿，属于乙方独立经营行为与甲方无关；且项目经营过程中所产生的一切法律后果以及违约责任均由乙方承担。</div>
            <div class="content-p p-text-index">5.3乙方承诺在借用甲方资质以甲方的名义进行产品销售或项目投标过程中，遵守中华人民共和国法律法规，无违规违法行为。</div>

            <div class="content-p">六、产品交货</div>
            <div class="content-p p-text-index">6.1甲方将协助乙方联系物流把产品运输到乙方指定的地点，交付乙方。一切运输及其它费用均由乙方承担。</div>
            <div class="content-p p-text-index">6.2甲方为乙方代办托运，在运输过程中发生货物毁损或缺失情况时，甲方有义务协助乙方与承运方进行交涉并妥善处理。</div>

              <div class="content-p">七、协议书保密及完整性</div>
              <div class="content-p p-text-index">7.1乙方同意为甲方所有资料（包括本协议书以及相关文件）严格保守秘密。　</div>
              <div class="content-p p-text-index">7.2本协议书及本协议书之附件构成双方有关本协议书的全部协议。</div>

              <div class="content-p">八、期限及终止</div>
              <div class="content-p p-text-index">8.1如乙方要继续履行合同需在合同到期前一个月与甲方续签合同。 </div>
              <div class="content-p p-text-index">8.2当任何一方发生破产、无偿债能力、或在其他情况下按照法律规定须终止营业时，本协议书须提前终止或取消。</div>
              <div class="content-p p-text-index">8.3当一方违反本协议书，并且在收到守约方书面的违约通知之后十天内未能作出补救，则守约方可以书面通知违约方，立即提前终止本协议书。</div>

              <div class="content-p">九、违约责任</div>
              <div class="content-p p-text-index">9.1除本协议已有约定外，一方违反本协议书约定，守约方有权要求违约方立即采取补救措施，并赔偿守约方由此而产生的一切损失，包括但不限于合理的律师费、差旅费、公证费。</div>

              <div class="content-p">十、争议解决方式</div>
              <div class="content-p p-text-index">10.1 所有由本协议产生的争议，双方应当友好协商解决。协商解决不成的，双方均同意将前述争议提交   甲方所在地   人民法院裁决和管辖。诉讼费用由败诉方承担，除非诉讼裁决另有裁定。</div>

              <div class="content-p">十一、其他</div>
              <div class="content-p p-text-index">11.1对本协议书的任何修改和变更必须以书面方式进行，并经双方授权代表签字且加盖公司公章后方能生效。</div>
              <div class="content-p p-text-index">11.2本合同一式贰份，甲乙双方各持一份，经双方签字盖章后即生效。</div>
              <div class="content-p p-text-index">11.3乙方应向甲方提供营业执照复印件。</div>
              <div class="content-p p-text-index">11.4双方在此确认，本协议书的所有条款经双方充分协商，为双方的真实意思表示。</div>

              <div class="card-wrap" style="overflow:hidden;">
                <div class="card">
                  <p class="card-tit">供方（甲方）</p>
                  <p style="position: relative">
                    供方单位（盖章）：
                    <img
                      v-if="detail.commonSeal"
                      style="position: absolute; width: 140px; left: 35%; top: -50%"
                      :src="detail.commonSeal"
                      alt="公章"
                    />
                  </p>
                  <p>
                    供方代表签字：
                    <img
                      v-if="detail.saleUserSeal"
                      style="height: 50px; width: auto; vertical-align: middle"
                      :src="detail.saleUserSeal"
                      alt="销售人员章"
                    />
                  </p>
                  <p>地址：江苏省徐州市铜山区张集工业园</p>
                  <p>电话/传真：0516-66699966（传真）</p>
                  <p>邮政编码：221000</p>
                  <p>银行账户名称：江苏万德福公共设施科技有限公司</p>
                  <p>银行账号： 472871189287</p>
                  <p>开户行：中国银行徐州铜山支行营业部</p>
                  <p>
                    微信号：<span class="span-paddings">{{ detail.wxNum }}</span>
                  </p>
                  <p>
                    电子邮箱：<span class="span-paddings">{{ detail.email }}</span>
                  </p>
                </div>
                <div class="card">
                  <p class="card-tit">需方（乙方）</p>
                  <p>需方单位（盖章）：</p>
                  <p>需方代表签字：</p>
                  <p>
                    地址：<span class="span-paddings">{{ detail.address }}</span>
                  </p>
                  <p>
                    电话/传真：<span class="span-paddings">{{ detail.tel }}</span>
                  </p>
                  <p>
                    单位全称：<span class="span-paddings">{{ detail.fullName }}</span>
                  </p>
                  <!-- <p>
                    开户行：<span class="span-paddings">{{ detail.customerBank }}</span>
                  </p>
                  <p>
                    账号： <span class="span-paddings">{{ detail.customerBankAccount }}</span>
                  </p>
                  <p>
                    税号： <span class="span-paddings">{{ detail.customerTaxId }}</span>
                  </p> -->
                  <!-- <p>
                    开票类型：<span class="span-paddings"> {{ +detail.invoiceType === 1 ? '增票' : '普票' }}</span>
                  </p> -->
                  <p>
                    微信号：<span class="span-paddings">{{ detail.customerWxNum }}</span>
                  </p>
                  <!-- <p>
                    电子邮箱：<span class="span-paddings">{{ detail.customerEmail }}</span>
                  </p> -->
                  <p>
                    邮政编码：<span class="span-paddings">{{ detail.postalCode }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </a-spin>
</a-modal>
</template>

<script>
import {
  dealerContractDetail
} from '@/api/qualificationsBorrowManagement'

import util from '@/components/_util/util'
import moment from 'moment'

export default {
  name: 'agencyContractView',
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      spinning: false,
      enterpriseName: '江苏万德福公共设施科技有限公司',
      enterpriseNameEnglish: 'JiangSu Wonderful Infrastructure Manufacturing co.,Ltd',
      contractTitle: '经销商合同',
      supplier: '江苏万德福公共设施科技有限公司', // 供方（甲方）
      detail: {},
      modalTitle:'预览'
    }
  },
  computed:{
    footer(){
      let that = this
      const h = that.$createElement;
      let btn = []
      btn.push(h('a-button',{key:'cancel',props:{type:'primary'},on:{click:that.handleCancel},},'关闭'))
      return btn
    }
  },
  methods: {
    moment,
    async query(type, record) {
      let that = this
      that.detail = {}
      that.visible = true
      //填充数据
      that.spinning = true
      try{
        that.detail = await dealerContractDetail({ id: record.id }).then((res) => res.data)
      }catch(err){
        that.$message.info(err.message)
      }
      that.spinning = false
    },
    // 返回
    goBackConstractList() {
      // 点击返回，返回合同列表页
      let that = this
      that.$nextTick(() => {
        let _from = that.$route.params.from || 'agencyContractList'
        that.$router.push({ name: _from })
      })
    },
    getPDF() {
      util.handleWindowPrint('#pdfDom', '经销商合同')
    },
    handleCancel(){
      this.detail = {}
      this.visible = false
    }
  }
}
</script>

<style scoped>
.approval-checkbox-wrapper {
  background-color: #fafad2;
  padding: 10px 30px;
}

.clearfix:after {
  display: block;
  content: '';
  clear: both;
  height: 0;
}
.clearfix {
  zoom: 1;
}
.contract-wrap {
  padding: 20px;
  background-color: #fff;
}
.contract-header {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.log-wrap img {
  width: 56px;
  height: 56px;
}
.top-right-page {
  text-align: right;
}
.contract-header {
  margin-bottom: 16px;
}
.contract-title-part {
  color: #000;
  font-size: 18px;
  line-height: 2;
}
.contract-title-part h2 {
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: #000;
}
.main-top {
  position: relative;
  margin-bottom: 20px;
}
.contract-title-num {
  position: absolute;
  right: 8px;
  top: 50%;
  margin-top: -38px;
  padding: 12px 16px;
  border: 1px solid #999;
}
.title-num-item {
  color: #000;
  font-size: 18px;
  line-height: 2;
}
.title-num-item span:first-child {
  margin-right: 12px;
}
.main-content-wrap {
  font-size: 16px;
  color: #000;
}
.content-p {
  line-height: 2;
}
.productTab {
  margin: 6px auto;
}
.span-paddings {
  margin: 0 6px;
}
.p-text-index {
  padding-left: 34px;
}
.span-underline {
  padding: 6px 10px;
  border-bottom: 1px solid #000;
  color: red;
}
.card {
  width: 500px;
  padding: 16px;
  border: 1px solid #999;
  margin: 10px 16px 10px 112px;
}
.card-tit {
  color: #000;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
.card-wrap {
  display: flex;
  justify-content:space-around;
  margin: 20px auto;
}
.card-wrap .card {
  flex: 40% 0 0;
  margin: 0;
  padding: 20px 0 20px 35px;
  width: auto !important;
}

.card-wrap .card p {
  margin-bottom: 0;
}
.margin-b {
  margin-bottom: 24px;
}

#pdfDom >>> .red-flag {
  color: red !important;
}
</style>
