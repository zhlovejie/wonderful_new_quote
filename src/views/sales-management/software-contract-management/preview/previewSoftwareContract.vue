<template>
  <a-spin :spinning="spinning">
  <div>
    <div class="top-ation clearfix margin-b">
      <a-button
        class="fl-r"
        type="primary"
        v-if="isPassBtn"
        @click="okPass()"
        :loading="loading"
        icon="check">通过</a-button>
      <a-button
        class="fl-r"
        type="primary"
        v-if="isPassBtn"
        @click="isPass({isAdopt:1})"
        :loading="loading"
        icon="close">不通过</a-button>

      <a-button class="fl-r" type="primary" @click="goBackConstractList" icon="backward">返回</a-button>
      <!-- <a-button class="fl-r" type="primary" @click="getPDF()" >导出成PDF</a-button> -->
      <a :href="wordUrl" target="_blank" class="ant-btn ant-btn-primary fl-r" >导出成PDF</a>
    </div>

    <div class="contract-wrap" id="pdfDom">
      <div class="contract-header">
        <div class="log-wrap">
          <img src="@/assets/icon_contract.jpg" style="width:48px;height:56px;" alt="合同图标">
        </div>
        <div class="top-right-page">
          <div class="top-right-item">{{ enterpriseName }}</div>
          <div class="top-right-item">{{ enterpriseNameEnglish }}</div>
        </div>
      </div>
      <div class="contract-main">
        <h2 style="text-align: center;">{{ contractTitle }}</h2>
        <div class="main-top" style="padding:10pt 0;">
          <div class="contract-title-part">
            <div>
              <span>供方(甲方)：</span>
              <span> {{ supplier }}</span>
            </div>
            <div>
              <span>需方(乙方)：</span>
              <span> {{ demandUnit }}</span>
            </div>
          </div>
          <div class="contract-title-num">
            <div class="title-num-item">
              <span>合同编号 :</span>
              <span>{{ contractNum }}</span>
            </div>
            <div class="title-num-item">
              <span>签订时间 :</span>
              <span :class="{'red-flag':!isCurrentDay}">{{ createTime }}</span>
            </div>
          </div>
        </div>
        <div class="main-content-wrap">
          <div class="content-p">一、标的、数量、货款：</div>
          <a-table
            class="productTab"
            :columns="productColumns"
            :dataSource="productDataSource"
            :pagination="false"
            bordered
          >
            <template slot="taxPrice" slot-scope="text">
              <span>{{text | moneyFormatNumber}}</span>
            </template>
            <template slot="footer" slot-scope="currentPageData">
              合计：（人民币）<span class="span-paddings">{{ chineseTotalAmount }}</span><span class="span-paddings">({{ totalAmount | moneyFormatNumber}})</span>。此价格含税。
            </template>
          </a-table>

          <p>产品详情</p>
          <a-table
            class="productTab"
            :columns="pointColumns"
            :dataSource="pointDataSource"
            :pagination="false"
            bordered
          >
            <template slot="productFunPoint" slot-scope="text ,record">
              <ol class="point-list-wrapper" v-html="record.pointHTML"></ol>
            </template>
          </a-table>

          <div class="content-p"> 二、合同费用及支付</div>
          <div class="content-p p-text-index">
            2.1本合同费用总额为{{totalAmount | moneyFormatNumber}}元（{{chineseTotalAmount}}）。
          </div>
          <div class="content-p p-text-index">
            2.2乙方应于本合同签署后2个工作日内向甲方支付本合同费用总40%的款项，即{{payPartAmount | moneyFormatNumber}}元（{{chinesePayPartAmount}}）；乙方应于甲方部署实施时2个工作日内向甲方支付本合同费用总额的40% 的款项，即{{payPartAmount | moneyFormatNumber}}（{{chinesePayPartAmount}}）；乙方应于交付、验收完毕后3个工作日内向甲方支付本合同剩余费用，即{{remainAmount | moneyFormatNumber}}（{{chinesepayRemainAmount}}）。此费用不包含云主机、带宽、微信等第三方平台产生的费用。如因乙方延时付款，甲方根据乙方付款时间顺延交付时间。
          </div>
          <div class="content-p p-text-index">
            2.3乙方应按照本合同约定将每期应支付的费用用以银行转账的方式一次性汇入甲方以下银行行号：<br/>
            开户行：中国银行徐州铜山支行营业部<br/>
            户  名：江苏万德福公共设施科技有限公司<br/>
            账  号：472871189287
          </div>

          <div class="content-p"> 三、交付与验收</div>
          <div class="content-p p-text-index">
            3.1经双方同意，本合同产品采用线上部署的交付方式。乙方需提供服务运行环境，包括服务器、域名等必备条件，甲方应于本合同签署并确认收到乙方提供的运行环境后 {{deliveryDay}} 天内向乙方完成交付，如乙方不能提供运行环境，可委托甲方采购运行环境，产生的第三方费用，由乙方承担。交付时间后延。<br/>
            接收人：{{receiveName}}；联系电话：{{receiveTel}}<br/>
            微信号：{{receiveWx}} ；邮    箱： {{receiveMail}}
          </div>
          <div class="content-p p-text-index">
            3.2经双方同意，乙方应于收到产品后 3天内以验收报告签署的方式完成验收。
          </div>
          <div class="content-p p-text-index">
            3.3经乙方验收不合格的，其应在交付产品后3天内向甲方提出书面异议，该书面异议应包括产品出现的问题及处理意见，乙方未在该期限内提出异议或者未提出书面异议的，均视为验收合格，乙方不能就此主张任何赔偿。
          </div>
          <div class="content-p p-text-index">
            3.4甲方应在收到乙方书面异议后 {{classfiyDay}} 天内给予处理，否则，视为接受乙方提出的处理意见。
          </div>

          <div class="content-p"> 四、培训指导</div>
          <div class="content-p p-text-index">
            4.1自硬件和软件安装、调试完成后，甲方应与乙方协调培训时间。维护服务有效期内，甲方应为乙方提供产品远程技术支持。
          </div>
          <div class="content-p p-text-index">
            4.2如乙方需要甲方提供现场培训，需提前三个工作日提出，基于甲乙双方协商一致的培训时间和培训内容予以实施，此过程中产生的差旅费以及培训讲师费用由乙方承担。
          </div>
          <div class="content-p p-text-index">
            4.3如乙方需要到甲方所在地进行学习，需提前三个工作日提出，基于甲方制定的培训时间和培训内容予以实施，此过程中乙方产生的差旅费由乙方自行承担。
          </div>

          <div class="content-p"> 五、产品维护</div>
          <div class="content-p p-text-index">
            5.1自乙方验收通过之日起 {{defendYear}} 年内，甲方应向乙方免费提供产品维护服务，上述期限届满后，甲方可继续向乙方提供产品维护服务，具体费用 {{defendPayDesc}} 。服务器、带宽、微信等第三方费用由乙方自行承担。
          </div>
          <div class="content-p p-text-index">
            5.2经双方同意，产品维护服务的方式为：线上远程技术支持。
          </div>


          <div class="content-p"> 六、甲方的其他义务及保证</div>
          <div class="content-p p-text-index">
            6.1甲方应为乙方提供相关软件产品及相应的技术文档，有责任对乙方相关人员进行管理、操作、使用及线上技术培训。
          </div>
          <div class="content-p p-text-index">
            6.2甲方保证本合同软件产品的质量、规格、性能及标准，且系经严格测试、成熟稳定、无病毒及重大缺陷的软件产品。
          </div>
          <div class="content-p p-text-index">
            6.3甲方保证本合同产品无任何著作权归属的纠纷，并保证本合同产品皆为可执行的软件产品，未在其中设置任何妨碍软件正常运行的限制措施。
          </div>


          <div class="content-p"> 七、乙方的其他义务</div>
          <div class="content-p p-text-index">
            7.1乙方应按甲方要求提供本合同所规定的软件产品所需的硬件设备及硬件环境，并有责任为甲方提供便利的工作条件。
          </div>
          <div class="content-p p-text-index">
            7.2乙方应当按甲方所提供的相关软件的使用手册进行操作，以确保系统运行安全可靠。
          </div>

          <div class="content-p"> 八、知识产权</div>
          <div class="content-p p-text-index">
            8.1对甲方提供的技术资料，乙方应负责保密。
          </div>
          <div class="content-p p-text-index">
            8.2甲方对本合同软件产品及相关文档拥有独立的软件著作权。未经甲方事先书面同意，乙方不得复制、仿制本合同软件产品，不得许可任何第三方以任何方式使用，亦不得向任何第三方泄露。
          </div>
          <div class="content-p p-text-index">
            8.3乙方不得对本合同软件产品自行进行任何修改，如乙方予以修改，甲方对修改后的软件产品的使用效果不负任何责任，且甲方自动拥有该修改后的软件产品的著作权，乙方不得向任何第三方提供修改后的软件产品。
          </div>

          <div class="content-p"> 九、保密</div>
          <div class="content-p p-text-index">
            9.1甲乙双方保证对其在本合同磋商、签订、执行过程中所获悉的属于对方的保密信息，包括但不限制于商业秘密、公司计划、运营活动、财务信息、技术、经营信息及其他商业秘密等予以保密。未经该资料和文件的提供方事先书面同意，另一方不得向任何第三方泄露该保密信息的部分或全部内容。但法律、法规另有规定或双方另有约定的除外。本条所述双方承担保密责任的期限为3年。
          </div>

          <div class="content-p"> 十、违约责任</div>
          <div class="content-p p-text-index">
            10.1甲方提供的产品不符合本合同约定的质量标准或者不能正常使用的，经甲乙双方协商一致，乙方可要求甲方根据协商结果予以整改。
          </div>
          <div class="content-p p-text-index">
            10.2乙方拒收产品或拖延收货，视为单方解除合同，则需向甲方支付合同总额50%（百分之五十）的违约金。
          </div>
          <div class="content-p p-text-index">
            10.3乙方应按本合同约定支付费用，逾期支付的，每逾期一天，乙方应按应付未付费用的千分之3向甲方支付违约金。
          </div>
          <div class="content-p p-text-index">
            10.4双方任何一方未经另一方书面同意，均不得将其在本合同中的权利及/或义务转让给第三方，否则构成违约，且该等转让对另一方不发生法律效力，一方应承担由此给另一方造成的全部损失并应继续履行其在本合同中的义务。
          </div>

          <div class="content-p"> 十一、合同变更、解除和终止</div>
          <div class="content-p p-text-index">
            11.1本合同经双方协商一致可变更或解除。
          </div>
          <div class="content-p p-text-index">
            11.2本合同自双方履行完毕其在本合同中的义务后自行终止。
          </div>

          <div class="content-p"> 十二、争议解决</div>
          <div class="content-p p-text-index">
            12.1双方因本合同内容及在本合同履行中发生的任何争议，应友好协商解决，协商不成的，可将争议提交至甲方所在地有管辖权的人民法院进行诉讼解决。
          </div>

          <div class="content-p"> 十三、生效及其他</div>
          <div class="content-p p-text-index">
            13.1本合同自双方法定代表人签字并加盖公章后生效，一式两份，双方各执一份，具有同等法律效力。
          </div>
          <div class="content-p p-text-index">
            13.2本合同未尽事宜，由双方协商一致另行签署书面补充协议，补充协议作为本合同不可分割的组成部分，与本合同具有同等法律效力。
          </div>

          <div class="content-p"> 十四、所有权保留条款</div>
          <div class="content-p p-text-index">
            14.1在乙方付清全部款项前，甲方保留产品的所有权。
          </div>

          <div class="content-p"> 十五、不可抗力条款</div>
          <div class="content-p p-text-index">
            15.1不可抗力事件包括火灾、水灾、地震、台风、自然灾害、战争、交通瘫痪、突发疫情等情形。
          </div>
          <div class="content-p p-text-index">
            15.2不可抗力事件发生后，受不可抗力事件影响的一方应在不可抗力发生后不迟于十五个工作日内，将不可抗力事件的发生，预计延续的时间和终止情况书面通知另一方。双方同意，可据此免除全部或部分责任。
          </div>
          <div class="content-p p-text-index">
            15.3主张不可抗力事由的一方有责任在发生不可抗力事件时，采取适当的补救措施尽量减少不可抗力事件给合同双方带来的损失，而由此支付的费用应由合同双方依据受益比例合理分担。
          </div>

          <div class="content-p"> 十六、补充协议</div>
          <div class="content-p p-text-index" v-html="supAggrementHTML"></div>

          <div class="card-wrap clearfix">
            <div class="card">
              <p class="card-tit">供方（甲方）</p>
              <p style="position: relative;">
                供方单位（盖章）：
                <img
                  v-if="commonSeal !== null"
                  style="position: absolute;width: 140px;left: 35%;top: -50%;"
                  :src="commonSeal"
                  alt="公章"
                />
              </p>
              <p>
                供方代表签字：
                <img
                  style="height: 50px;width: auto;vertical-align: middle;"
                  :src="saleUserSeal"
                  alt="销售人员章"
                />
              </p>
              <p>地址：江苏省徐州市铜山区张集工业园</p>
              <p>电话/传真：0516-66699966</p>
              <p>邮政编码：221000</p>
              <p>银行账户名称：江苏万德福公共设施科技有限公司</p>
              <p>银行账号： 472871189287</p>
              <p>开户行：中国银行徐州铜山支行营业部</p>
            </div>
            <div class="card">
              <p class="card-tit">需方（乙方）</p>
              <p>需方单位（盖章）：</p>
              <p>需方代表签字：</p>
              <p>
                地址：
                <span class="span-paddings">{{ address }}</span>
              </p>
              <p>
                电话/传真：
                <span class="span-paddings">{{ mobile }}</span>
              </p>
              <p>
                邮政编码：
                <span class="span-paddings">{{ zipCode }}</span>
              </p>
              <p>
                单位全称：
                <span class="span-paddings">{{ unitFullName }}</span>
              </p>
              <p>
                开户行：
                <span class="span-paddings">{{ openingBank }}</span>
              </p>
              <p>
                账号：
                <span class="span-paddings">{{ bankCardAccount }}</span>
              </p>
              <p>
                税号：
                <span class="span-paddings">{{ dutyParagraph }}</span>
              </p>
              <p>
                微信号：
                <span class="span-paddings">{{ wx }}</span>
              </p>
              <p>
                电子邮箱：
                <span class="span-paddings">{{ email }}</span>
              </p>
              <p>
                开票类型：<span class="span-paddings">{{ billingTypeSTR }}</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
    <a-modal
      :title="dialogTitle"
      v-model="visible"
      v-if="visible"
      @ok="handleSubmit()"
      @cancel="handleCancel"
      okText="确认"
      cancelText="取消"
      :maskClosable="false"
    >
      <a-textarea :autosize="{ minRows: 2, maxRows: 6 }" v-model="opinion"/>
    </a-modal>
  </div>
  </a-spin>
</template>

<script>
import {
  getSoftwareContractQueryOne,
  softwareContractApproval
} from '@/api/contractListManagement'

import util from '@/components/_util/util'

import moment from 'moment'

let productColumns = [
  {
    align: 'center',
    title: '标的名称',
    dataIndex: 'targetName',
    key: 'targetName'
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName'
  },
  {
    align: 'center',
    title: '产品类别',
    dataIndex: 'productType',
    key: 'productType'
  },
  {
    align: 'center',
    title: '软件版本号',
    dataIndex: 'productVersionName',
    key: 'productVersionName'
  },
  {
    align: 'center',
    title: '是否含税',
    dataIndex: 'hasTax',
    key: 'hasTax'
  },
  {
    align: 'center',
    title: '含税金额(元)',
    dataIndex: 'taxPrice',
    key: 'taxPrice',
    scopedSlots: { customRender: 'taxPrice' }
  }
]

let pointColumns = [
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName'
  },
  {
    align: 'center',
    title: '功能点',
    dataIndex: 'productFunPoint',
    key: 'productFunPoint',
    scopedSlots: { customRender: 'productFunPoint' }
  },
]


let resetData = {
      isPassBtn: false, // 通过不通过按钮的是否显示
      opinion: '', // 审批意见
      visible: false, // 审批弹出层是否可见
      loading: false,
      dialogTitle: '审批操作',
      data: [],
      productColumns:productColumns,
      productDataSource:[],
      pointColumns:pointColumns,
      pointDataSource:[],
      enterpriseName: '江苏万德福公共设施科技有限公司',
      enterpriseNameEnglish: 'JiangSu Wonderful Infrastructure Manufacturing co.,Ltd',
      contractTitle: '软件合同',
      supplier: '江苏万德福公共设施科技有限公司', // 供方（甲方）
      demandUnit: '', // 需方（乙方）
      contractNum: '', // 合同编号
      createTime: '', // 签订日期
      //合同费用及支付
      totalAmount:0,//总金额
      chineseTotalAmount:'零元整',//总金额大写
      payPartAmount:0,
      chinesePayPartAmount:'零元整',
      remainAmount:0,
      chinesepayRemainAmount:'零元整',

      //交付与验收
      receiveName:'',
      receiveTel:'',
      receiveWx:'',
      receiveMail:'',

      classfiyDay:'',
      defendYear:'',
      defendPayDesc:'',
      deliveryDay:'',
      //补充协议
      supAggrement:'',

      commonSeal:'',
      saleUserSeal:'',

      wx:'',
      mobile:'',
      unitFullName:'',
      openingBank:'',
      dutyParagraph:'',
      email:'',
      address:'',
      zipCode:'',
      bankCardAccount:'',
      accountTitle:'',
      billingType:1,
      spinning:false
    }

export default {
  name: 'previewSoftwareContract',
  components: {},
  props: {},
  data () {
    return {
      isPassBtn: false, // 通过不通过按钮的是否显示
      opinion: '', // 审批意见
      visible: false, // 审批弹出层是否可见
      loading: false,
      dialogTitle: '审批操作',
      data: [],
      productColumns:productColumns,
      productDataSource:[],
      pointColumns:pointColumns,
      pointDataSource:[],
      enterpriseName: '江苏万德福公共设施科技有限公司',
      enterpriseNameEnglish: 'JiangSu Wonderful Infrastructure Manufacturing co.,Ltd',
      contractTitle: '软件合同',
      supplier: '江苏万德福公共设施科技有限公司', // 供方（甲方）
      demandUnit: '', // 需方（乙方）
      contractNum: '', // 合同编号
      createTime: '', // 签订日期
      //合同费用及支付
      totalAmount:0,//总金额
      chineseTotalAmount:'零元整',//总金额大写
      payPartAmount:0,
      chinesePayPartAmount:'零元整',
      remainAmount:0,
      chinesepayRemainAmount:'零元整',

      //交付与验收
      receiveName:'',
      receiveTel:'',
      receiveWx:'',
      receiveMail:'',

      classfiyDay:'',
      defendYear:'',
      defendPayDesc:'',
      deliveryDay:'',
      //补充协议
      supAggrement:'',

      commonSeal:'',
      saleUserSeal:'',

      wx:'',
      mobile:'',
      unitFullName:'',
      openingBank:'',
      dutyParagraph:'',
      email:'',
      address:'',
      zipCode:'',
      bankCardAccount:'',
      accountTitle:'',
      billingType:1,
      spinning:false ,
      wordUrl:''
    }
  },
  computed: {
    isCurrentDay(){
      let m1 = String(this.createTime)
      let m2 = moment().format('YYYY-MM-DD')
      return m1 === m2
    },
    supAggrementHTML(){
      if(this.isEmpty(this.supAggrement)) return ''
      return this.supAggrement.split('\n').map(p =>`<div>${p}</div>`).join('')
    },
    billingTypeSTR(){
      return parseInt(this.billingType) === 1 ? '增票' : '普票'
    }
  },
  watch: {
    $route (to, from) {

      if(to.name === 'previewSoftwareContract'){
        console.log('previewSoftwareContract $route called...')
        this.init()
      }
    }
  },
  cerated () {},
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      let that = this
      //先清空上次缓存数据
      Object.assign(this,resetData)
      that.spinning = true

      let routeParam = this.$router.currentRoute.params
      this.isPassBtn = routeParam.action === 'approval' ? true : false
      getSoftwareContractQueryOne({id: routeParam.id})
      .then(res =>res.data)
      .then(result =>{
        let customerInfo = result.customerInfo //乙方信息
        that.demandUnit = result.saleCustomerName || customerInfo.demandUnit
        that.contractNum = result.contractNum
        this.createTime = result.signDate

        this.totalAmount = result.totalAmount
        this.chineseTotalAmount = result.chineseTotalAmount
        this.payPartAmount = result.payPartAmount
        this.chinesePayPartAmount = result.chinesePayPartAmount
        this.remainAmount = result.remainAmount
        this.chinesepayRemainAmount = result.chinesepayRemainAmount

        this.receiveName = result.receiveName
        this.receiveTel = result.receiveTel
        this.receiveWx = result.receiveWx
        this.receiveMail = result.receiveMail

        this.classfiyDay = result.classfiyDay
        this.defendYear = result.defendYear
        this.defendPayDesc = result.defendPayDesc
        this.deliveryDay = result.deliveryDay

        this.supAggrement = result.supAggrement

        this.saleUserSeal = result.saleUserSeal
        this.commonSeal = result.commonSeal

        this.billingType = result.billingType

        this.wx = customerInfo.wx

        this.mobile = customerInfo.mobile
        this.unitFullName = customerInfo.unitFullName
        this.openingBank = customerInfo.openingBank
        this.dutyParagraph = customerInfo.dutyParagraph
        this.email = customerInfo.email
        this.address = customerInfo.address
        this.zipCode = customerInfo.zipCode
        this.bankCardAccount = customerInfo.bankCardAccount
        this.accountTitle = customerInfo.accountTitle
        this.wordUrl = result.wordUrl

        this.productDataSource = result.products.map((p,index) =>{
          return {
            key:index,
            targetName:'分类管理软件',
            productName:p.productName,
            productType:p.productType === 1 ? '定制版' : '标准版',
            productVersionName:p.productVersionName,
            hasTax:'是',
            taxPrice:p.taxPrice
          }
        })

        this.pointDataSource = result.products.map((p,index) =>{
          let pointHTML = ''
          let isCustom = p.productType === 1 ? true : false
          if(isCustom){
            pointHTML = p.productFunPoint
            .split('\n')
            .map(point =>{
              return `<span style="display:inline-block;margin:5px 7px;">${point}</span>`
            })
            .join('')
          }else{
            pointHTML = p.productFunPoint
            .split(',')
            .map(point =>{
              return `<span style="display:inline-block;margin:5px 7px;">${point}</span>`
            })
            .join('')
          }
          return {
            key:index,
            productName:p.productName,
            productFunPoint:p.productFunPoint,
            pointHTML:pointHTML
          }
        })

        console.log(result)
      }).finally(() =>{
        that.spinning = false
      })
    },
    // 返回
    goBackConstractList () {
      // 点击返回，返回合同列表页
      let that = this
      that.$nextTick(() => {
        let _from = that.$route.params.from || 'softwareContractList'
        that.$router.push({ name: _from})
      })
    },
    // 通过
    okPass () {
      this.spinning = true
      let that = this
      const params = {
        contractId: that.$router.currentRoute.params.id,
        isAdopt: 0 ,
        opinion:''
      }
      //原流程
      softwareContractApproval(params).then((res) => {
        that.spinning = false
        that.$router.go(-1)// 返回上一页
        // this.$router.push({name:'distributionContractList'})
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        that.spinning = false
      })
    },
    // 不通过
    isPass (e) {
      this.visible = true
      console.log('点击的到底是通过还是不通过', e)
      this.isAdopt = e.isAdopt
    },
    // 取消
    handleCancel () {
      this.visible = false
    },
    handleSubmit () {
      let that = this
      that.visible = false
      setTimeout(function(){
        that.spinning = true
        const params = {
          contractId: that.$router.currentRoute.params.id,
          opinion: that.opinion,
          isAdopt: that.isAdopt
        }
        //原流程
        softwareContractApproval(params).then((res) => {
          that.$router.go(-1)// 返回上一页
        }).catch(error => {
          console.error(error)
        }).finally(() => {
          that.spinning = false
        })
      },500)
    },
    getPDF () {
      util.handleWindowPrint('#pdfDom', '软件合同')
    },
    isEmpty(o){
      if(typeof o === 'string'){
        o = o.trim()
      }
      return o === undefined || o === '' || o === null
    }
  }
}
</script>

<style scoped>
  .approval-checkbox-wrapper{
    background-color: #fafad2;
    padding: 10px 30px;
  }

  .clearfix:after{
    display: block;
    content: '';
    clear: both;
    height: 0;
  }
  .clearfix{
    zoom: 1;
  }
  .contract-wrap{
    padding:20px;
    background-color: #fff;
  }
  .contract-header{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content:space-between;
    align-items:center;
  }
  .log-wrap img{
    width: 56px;
    height: 56px;
  }
  .top-right-page{
    text-align: right;
  }
  .contract-header{
    margin-bottom: 16px;
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
  .main-top{
    position: relative;
    margin-bottom: 20px;
  }
  .contract-title-num{
    position: absolute;
    right: 8px;
    top: 50%;
    margin-top: -38px;
    padding: 12px 16px;
    border: 1px solid #999;
  }
  .title-num-item{
    color: #000;
    font-size: 18px;
    line-height: 2;
  }
  .title-num-item span:first-child{
    margin-right: 12px;
  }
  .main-content-wrap{
    font-size: 16px;
    color: #000;
  }
  .content-p{
    line-height: 2;
  }
  .productTab{
    margin: 6px auto;
  }
  .span-paddings{
    margin: 0 6px;
  }
  .p-text-index{
    padding-left: 34px;
  }
  .span-underline{
    padding: 6px 10px;
    border-bottom: 1px solid #000;
  }
  .card{
    width: 500px;
    padding: 16px;
    border: 1px solid #999;
    margin: 10px 16px 10px 112px;
  }
  .card-tit{
    color: #000;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .card-wrap{
    width: 100%;
    padding: 16px;
  }
  .card-wrap .card{
    width: 44%;
    float: left;
    margin: 0;
  }
  .card-wrap .card~.card{
    margin-left: 3%;
  }
  .card-wrap .card p{
    margin-bottom: 0;
  }
  .margin-b{
    margin-bottom: 24px;
  }

  #pdfDom >>> .red-flag{
    color: red !important;
  }
</style>
