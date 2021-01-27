<template>
<a-modal :title="modalTitle" :width="1050" :visible="visible" :footer="footer" @cancel="handleCancel" :maskClosable="false">
  <a-spin :spinning="spinning">
    <div >
      <div class="top-ation clearfix margin-b">
        <!-- <a-button class="fl-r" type="primary" @click="goBackConstractList" icon="backward">返回</a-button> -->
        <a-button class="fl-r" type="primary" @click="getPDF()" >导出成PDF</a-button>
        <!-- <a :href="detail.pdfUrl" target="_blank" class="ant-btn ant-btn-primary fl-r">导出成PDF</a> -->
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
            <div class="content-p">双方根据&lt;中华人民共和国合同法&gt;及其他相关法律，本着平等互利的原则，就建立战略合作伙伴关系的规则等相关事宜，双方经协商一致，达成战略合作协议，协议如下:</div>
            <div class="content-p">一、本协议下列术语应解释为：</div>
            <div class="content-p p-text-index">1.1战略合作：甲方与乙方本着合作双赢的模式形成长期战略合作伙伴关系。</div>
            <div class="content-p p-text-index">1.2战略合作协议：由甲、乙双方签署的包括本协议正文、附件在内的协议文件。当乙方有本协议约定范围中的产品采购需求时，由甲、乙双方根据本协议规定另行签订销售合同或订单，本战略合作协议为双方另行签订的合同或订单组成部份。</div>
            <div class="content-p p-text-index">1.3订单：甲方与乙方根据本协议约定的条件及乙方实际需求数量签署的订单合同。</div>

            <div class="content-p">二、合作关系</div>
            <div class="content-p p-text-index">2.1双方希望通过建立密切、长久及融洽的战略合作伙伴关系，充分发挥各自网络和业务特点，在业务捆绑、市场营销、产业推动等多个领域开展强强合作，实现资源共享、优势互补，共同促进双方产品与服务的延伸和发展。</div>
            <div class="content-p p-text-index">2.2双方一致同意致力于在整体产品或服务领域建立全面、深入的战略合作伙伴关系。</div>
            <div class="content-p p-text-index">2.3双方一致同意以各自的资源和专业技术及经验为基础，在前述产品或服务领域的宣传推广、产品开发与支持、客户服务、网络支持、信息转接等方面进行广泛合作。</div>
            <div class="content-p p-text-index">2.4甲、乙双方同意基于本协议及其后的任何修改、补充（以下合称“协议”）的规定，建立长期合作伙伴关系。在合作期内，乙方可按照协议规定向甲方采购，甲方应向乙方供应协议产品（以下简称“产品”）。</div>
            <div class="content-p p-text-index">2.5甲、乙双方以销售合同或订单的形式履行本协议。</div>
            <div class="content-p p-text-index">2.6如甲乙双方发现任何第三方侵犯甲乙双方或甲乙双方关联公司的专利、商标、商号专用权或其它知识产权的行为应及时通知对方，并协助对方共同维权。</div>

            <div class="content-p">三、标的</div>
            <div class="content-p p-text-index">3.1甲方根据本协议向乙方出售乙方需求的产品或软件。</div>
            <div class="content-p p-text-index">3.2甲方向乙方出售的产品的数量、规格和型号以双方签署的具体采购合同为主。</div>
            
            <div class="content-p">四、产品价格</div>
            <div class="content-p p-text-index">4.1本协议一经签订，乙方享有甲方提供的战略合作协议价格。</div>
            <div class="content-p p-text-index">4.2销售合同或订单的计价货币为人民币。 </div>

            <div class="content-p">五、资质借用</div>
            <div class="content-p p-text-index">5.1如乙方因经营所需借用甲方资质，以甲方的名义进行产品销售或项目投标，需经甲方同意并签署《资质借用协议》后方可借用。</div>
            <div class="content-p p-text-index">5.2乙方承诺在此产品销售以及项目经营过程中，甲方代替乙方所签订的所有与本销售行为以及项目相关的合同、协议均为乙方的意愿，属于乙方独立经营行为与甲方无关；且项目经营过程中所产生的一切法律后果以及违约责任均由乙方承担。</div>
            <div class="content-p p-text-index">5.3乙方承诺在借用甲方资质以甲方的名义进行产品销售或项目投标过程中，遵守中华人民共和国法律法规，无违规违法行为。</div>

            <div class="content-p">六、保密条款</div>
            <div class="content-p p-text-index">6.1双方约定，未经对方同意，任何一方不得将本协议的有关内容以任何方式透露给任何第三方或本公司其它无关人员，也不得用于本协议以外的其他目的。</div>

              <div class="content-p">七、合作期限</div>
              <div class="content-p p-text-index">7.1本协议所指的合作期限为协议生效之日起<span class="span-underline">{{detail.cooperationYear}}</span>年。合作期限截止，经甲乙双方对合作期内工作评价结果确认符合双方要求，双方协商续签。</div>

              <div class="content-p">八、争议解决</div>
              <div class="content-p p-text-index">8.1双方在本协议执行过程中发生争议时，应首先协商解决。如协商不成，由甲方所在人民法院诉讼解决。</div>
              <div class="content-p p-text-index">8.2由甲方与乙方所签订战略合作协议在执行过程中发生争议，按照相应销售合同的具体约定执行。</div>

              <div class="content-p">九、其他</div>
              <div class="content-p p-text-index">9.1本协议自双方法定代表人或授权代表签字并加盖双方公章或合同专用章后生效，未经另一方同意，任何一方不得单方面对协议进行修改。</div>
              <div class="content-p p-text-index">9.2未经另一方事先书面同意，任何一方均不得向其他方转让本协议规定的任何权利或义务。</div>
              <div class="content-p p-text-index">9.3本协议由协议正文以及附件组成，以上文件均具有同等法律效力。</div>
              <div class="content-p p-text-index">9.4本协议未尽事宜由双方友好协商另行确定。</div>
              <div class="content-p p-text-index">9.5本协议正本一式贰份，甲、乙双方各执壹份。</div>

              <div class="card-wrap" style="overflow:hidden;">
                <div class="card">
                  <p >甲方名称：江苏万德福公共设施科技有限公司</p>
                  <p style="position: relative">
                    授权代表签字（盖章）：
                    <!-- <img
                      v-if="detail.commonSeal"
                      style="position: absolute; width: 140px; left: 35%; top: -50%"
                      :src="detail.commonSeal"
                      alt="公章"
                    /> -->
                  </p>
                  <p>日期：{{detail.formatSigningDate}}</p>
                </div>
                <div class="card">
                  <p >乙方名称：{{ detail.customerName }}</p>
                  <p style="position: relative">
                    授权代表签字（盖章）：
                  </p>
                  <p>日期：{{detail.formatSigningDate}}</p>
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
  cooperationProtocolDetail
} from '@/api/qualificationsBorrowManagement'

import util from '@/components/_util/util'
import moment from 'moment'

export default {
  name: 'strategicCooperationAgreementView',
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      spinning: false,
      enterpriseName: '江苏万德福公共设施科技有限公司',
      enterpriseNameEnglish: 'JiangSu Wonderful Infrastructure Manufacturing co.,Ltd',
      contractTitle: '战略合作协议',
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
        let detail = await cooperationProtocolDetail({ id: record.id }).then((res) => res.data)
        detail.formatSigningDate = moment(detail.signingDate).format('YYYY年MM月DD日')
        that.detail = {... detail}
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
      util.handleWindowPrint('#pdfDom', '战略合作协议')
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
