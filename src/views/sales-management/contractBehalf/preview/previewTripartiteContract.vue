<template>
  <a-spin :spinning="spinning">
    <div>
      <div class="top-ation clearfix margin-b">
        <a-button class="fl-r" type="primary" v-if="isPassBtn" @click="okPass()" :loading="loading" icon="check"
          >通过</a-button
        >
        <a-button
          class="fl-r"
          type="primary"
          v-if="isPassBtn"
          @click="isPass({ isAdopt: 1 })"
          :loading="loading"
          icon="close"
          >不通过</a-button
        >
        <a-button class="fl-r" type="primary" @click="goBackConstractList" icon="backward">返回</a-button>
        <!-- <a-button class="fl-r" type="primary" @click="getPDF()" >导出成PDF</a-button> -->
        <a :href="wordUrl" target="_blank" class="ant-btn ant-btn-primary fl-r">导出成PDF</a>
      </div>
      <div class="approval-checkbox-wrapper" v-if="isSalesManager && approvalNodeData.length > 0">
        <span style="margin-right: 8px">审批节点：</span>
        <a-checkbox-group :options="approvalNodeData" @change="onChange" />
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
                <span>{{ supplier }}</span>
              </div>
              <div>
                <span>需方(乙方)：</span>
                <span>{{ demandUnit }}</span>
              </div>
            </div>
            <div class="contract-title-num">
              <div class="title-num-item">
                <span>合同编号 :</span>
                <span>{{ contractNum }}</span>
              </div>
              <div class="title-num-item">
                <span>签订时间 :</span>
                <span v-if="nowDate != createTime" style="color: red" class="print-color-style">{{ createTime }}</span>
                <span v-else>{{ createTime }}</span>
              </div>
            </div>
          </div>
          <div class="main-content-wrap">
            <div class="content-p">一、标的、数量、货款及交（提）货日期：</div>
            <a-table
              class="productTab"
              :columns="columns"
              :dataSource="data"
              :pagination="false"
              :loading="productLoading"
              bordered
            >
              <template slot="productImage" slot-scope="text, record">
                <img style="height: 50px; lenght: 40px" :src="text" />
              </template>
              <template slot="trademark" slot-scope="text, record">
                <span>德澜仕</span>
              </template>

              <template slot="price" slot-scope="text, record">
                <span v-if="record.showRedFlag == 0">{{ text }}</span>
                <span v-else style="color: red" class="print-color-style">{{ text }}</span>
              </template>

              <template slot="productType" slot-scope="text">
                <span>{{ text === 0 ? '常规产品' : '非常规产品' }}</span>
              </template>
              <template slot="unitAmount" slot-scope="text">
                <span>{{ text | moneyFormatNumber }}</span>
              </template>
              <template slot="freightUnitAmount" slot-scope="text">
                <span>{{ text | moneyFormatNumber }}</span>
              </template>
              <template slot="freightUnitPrice" slot-scope="text">
                <span>{{ text | moneyFormatNumber }}</span>
              </template>
              <template slot="productLowCPriceUnitAmount" slot-scope="text, record">
                <span style="color: red">{{ record.productLowCPriceUnitAmount }}</span>
              </template>
              <template slot="productLowCPriceAllAmount" slot-scope="text, record">
                <span style="color: red">{{ record.productLowCPriceAllAmount }}</span>
              </template>
              <template slot="footer" slot-scope="text">
                <div v-if="queryOne_freightType === 1">
                  运费：&nbsp;{{
                    Math.ceil(queryOne_freightCharge * 1.13) | moneyFormatNumber
                  }}&nbsp;&nbsp;包含&nbsp;&nbsp;(&nbsp;运费：{{
                    queryOne_freightCharge | moneyFormatNumber
                  }}&nbsp;&nbsp;运费税率：&nbsp;13%&nbsp; )
                </div>
                <div>
                  合计：（人民币）
                  <span class="span-paddings">{{ chineseTotalAmount }}</span>
                  <span class="span-paddings">￥{{ totalAmount | NumberFormat(2) }}</span>
                  。此价格{{ unIsTax ? '含税' : '不含税' }}、{{ freightType === 1 ? '含运费' : '不含运费' }}。
                  <template v-if="saleContractLowCPriceAllAmount > 0">
                    <span style="color: red"> 合同低于C价总差额: </span>
                    <span style="color: red">{{ saleContractLowCPriceAllAmount }}</span>
                  </template>
                </div>
              </template>
            </a-table>
            <div class="content-p">二、质量及检验标准：依照万德福公司相关产品检验标准执行。</div>
            <div class="content-p">
              三、需方产品特殊要求说明：
              <span class="span-paddings">{{ requirementSpecification }}</span>
            </div>
            <div class="content-p">
              <template v-if="bucketType === 1">
                四、质保期限及要求：主框架
                <span class="span-paddings">{{ qualityFrame }}</span
                >年、电器件 <span class="span-paddings">{{ qualityElectronics }}</span
                >年、表面涂层 <span class="span-paddings">{{ qualityLayer }}</span
                >年
              </template>
              <template v-else>
                四、质保期限及要求：<span class="span-paddings">{{ qualityLimit }}</span
                >年
              </template>
            </div>
            <div class="content-p">
              五、标的物所有权自乙方付清全额货款之日起转移，若乙方未履行全部支付义务，标的物所有权为甲方所有。产品损毁、灭失风险在未交付前由甲方承担，交付后由乙方承担。
            </div>
            <div class="content-p">
              六、交货时间：
              <span class="span-paddings">{{ deliveryDate }}</span
              >甲方按期通知乙方提货，乙方需在五个工作日内结清货款并提货。自提货通知发起一个月后，如乙方不能及时提货，每日应按照合同金额的3‰付甲方仓储费，提货前补齐全部款项。
            </div>
            <div class="content-p">七、交货地点及联系人：</div>
            <div class="content-p p-text-index">详细地址（省市区县乡镇街道）：{{ detailDeliveryAddress }}</div>
            <!-- <div class="content-p p-text-index" v-for="(val,index) in contactList" :key="index">
              第 {{index + 1 | numberCircle}} 组联系人 -
              <span v-html="val"></span>
            </div> -->
            <!-- <div class="content-p p-text-index"> 详细地址（省市区县乡镇街道）：<span class="span-paddings">{{ deliveryAddress }}</span></div>
          <div class="content-p p-text-index"> 联系人姓名：<span class="span-paddings">{{ deliveryName }}</span> </div>
            <div class="content-p p-text-index"> 联系人电话号码：<span class="span-paddings">{{ mobile }}</span> </div>-->
            <div class="content-p">八、运输方式及到达（港）站和费用承担：</div>
            <div class="content-p p-text-index">
              运费类型：
              <span class="span-paddings">{{ freightType === 1 ? '含运费' : '不含运费' }}</span>
            </div>
            <div class="content-p p-text-index">
              运输方式：{{ transportType === 2 ? '自提。 乙方自提货物，甲方负责将货物装入乙方委派车辆。' : '代办运输' }}
            </div>
            <div v-if="transportType === 1" class="content-p p-text-index">代办托运说明</div>
            <div v-if="transportType === 1" class="content-p p-text-index">
              甲方为乙方代办托运时，运输费用由乙方承担，甲方负责运输货物的装卸相关事宜。甲方货物从仓库配送出库后，在运输途中发生的一切安全、短少、变更路线等问题，由甲方帮助乙方协调承运方，协商解决。凡因人力不可抗拒因素，如自然灾害、合理损耗等非甲方造成的损失或货物延迟，甲方概不负责。
            </div>
            <div v-if="transportType === 1" class="content-p p-text-index">
              乙方收到货物应先进行验货，确认无误后再签名签收。如因乙方在不验货的情况下直接签收货物，所产生的一切责任及经济纠纷全部由乙方负责，甲方不承担任何责任。
            </div>
            <div class="content-p p-text-index">备注信息：{{ otherInfo }}</div>

            <div class="content-p">
              九．甲方仅负责指导安装设备，设备的具体安装操作工作需乙方派专人进行.在设备和系统的维护及维修过程中，乙方需派专人对接。
            </div>
            <div class="content-p">十、结算方式及时间：（多选）</div>
            <div v-if="!isFull">
              <div
                :key="item.settleName"
                v-for="item in purchaseContractSettlementDetailVoList"
                class="content-p p-text-index"
              >
                {{ item.settleName }}应付金额： <span class="span-paddings">{{ item.money | moneyFormatNumber }}</span
                >。付款周期：
                <span class="span-paddings">{{ item.paymentDateStr }}</span>
                <span class="span-paddings">备注:{{ item.remarks || '无' }}</span>
              </div>
            </div>
            <div v-if="isFull">
              <div class="content-p p-text-index">全款结算方式及时间</div>
              <div :key="item.settleName" v-for="item in fullList" class="content-p p-text-index">
                {{ item.settleName }}应付金额： <span class="span-paddings">{{ item.money | moneyFormatNumber }}</span
                >。付款周期：
                <span class="span-paddings">{{ item.paymentDateStr }}</span>
              </div>
            </div>
            <div v-if="increaseTotalPayment > 0" class="content-p p-text-index">
              增加总货款金额：
              <span class="span-paddings">{{ increaseTotalPayment | moneyFormatNumber }}</span>
            </div>
            <div>注：交货时间按预付款到账时间顺延。（按照签订协议时间和交货时间的周期顺延）</div>
            <div class="content-p">十一、违约责任： 按《中华人民共和国合同法》追究责任。</div>
            <div class="content-p">
              十二、合同争议的解决方式：本合同在履行过程中发生的争执，由双方当事人协商解决，也可由当地工商行政管理部门调解；协商或调解不成，按下列第
              <span class="span-underline" v-if="contractDispute === 1">一</span
              ><span class="span-underline" v-else>二</span>种方式解决。
            </div>
            <div class="content-p p-text-index">（一）、提交仲裁委员会仲裁；</div>
            <div class="content-p p-text-index">
              （二）、向 <span style="margin: 0 12px; text-decoration: underline">甲</span> 方所在地人民法院提起诉讼
            </div>
            <div class="content-p p-text-index">
              （二）、向<span style="margin: 0 12px; text-decoration: underline">乙</span>方所在地人民法院提起诉讼
            </div>
            <!-- <div class="content-p">
              十二、合同争议的解决方式：本合同在履行过程中发生的争执，由双方当事人协商解决，也可由当地工商行政管理部门调解；协商或调解不成，按下列第
              <span class="span-underline">{{ contractDispute }}</span
              >种方式解决。
            </div>
            <div class="content-p p-text-index">（一）、提交仲裁委员会仲裁；</div>
            <div class="content-p p-text-index" v-if="contractDisputeName !== null">
              （二）、向
              <span style="margin: 0 12px; text-decoration: underline">{{ contractDisputeName }}</span>
              方所在地人民法院提起诉讼
            </div> -->

            <div class="content-p">十三、</div>

            <div class="content-p p-text-index" v-if="signForm === 1">
              1、此协议通过邮件形式签订（甲方邮箱账号：
              <span class="span-paddings">{{ partAemail }}</span>
              乙方邮箱账号： {{ partBemail }} ），合同自双方签字盖章并回复确认后方可生效，合同的附件享有同等法律效力。
            </div>
            <div class="content-p p-text-index" v-if="signForm === 2">
              2、此协议通过书面签订形式签订，合同自双方签字盖章后生效，合同的附件享有同等法律效力。本合同一式
              <span class="span-paddings">{{ contractTotalNumber }}</span
              >份，甲乙双方各 <span class="span-paddings">{{ contractABNumber }}</span
              >份，由于保管不当而引起的纠纷由当事人负全部责任。
            </div>
            <div v-if="signForm === 3" class="content-p p-text-index">
              1、此协议通过微信形式签订（甲方微信账号：
              <span class="span-paddings">{{ partAemail }}</span>
              乙方微信账号： {{ partBemail }} ），合同自双方签字盖章并回复确认后方可生效，合同的附件享有同等法律效力。
            </div>

            <div class="content-p">
              十四、其他约定事项：以上产品为甲方拥有自主知识产权的专利产品，乙方不得购买、销售假冒或仿冒合同产品，不得以任何形式伪造、仿造甲方产品。如有上述行为应视为违约，应承担法律责任。甲方有权单方面终止与乙方的一切商业合作关系，并要求乙方按合同金额的100%赔偿违约金，甲方有权从货物预付款或保证金中扣除违约金，不足部分由乙方补足，甲方保留依法追究乙方侵权责任的权利。
            </div>

            <div class="content-p">十五、双方约定通过微信号、邮箱相互传递资料，作为合同的一部分，履行法律效力。</div>
            <div>十六、附加条款：{{ additionalTreaty }}</div>

            <div class="card-wrap clearfix">
              <div class="card">
                <p class="card-tit">供方（甲方）</p>
                <p style="position: relative">
                  供方单位（盖章）：
                  <span class="span-paddings">{{ supplier }}</span>
                  <img
                    v-if="approvalStatus === 2 && isNeedFreshChaper === 0"
                    style="position: absolute; width: 140px; left: 35%; top: -50%"
                    :src="commonSeal"
                    alt="公章"
                  />
                </p>
                <!-- <p style="position: relative;line-height: 50px"> 供方代表签字：<img style="height: 50px;height: 50px;" :src="saleUserSeal" alt="销售人员章"></p> -->

                <p>
                  供方代表签字：
                  <img style="height: 50px; width: auto; vertical-align: middle" :src="saleUserSeal" alt="销售人员章" />
                </p>
                <p>地址：江苏省徐州市铜山区张集工业园</p>
                <p>电话/传真：0516-66699966（传真）</p>
                <p>邮政编码：221000</p>
                <p>银行账户名称：江苏万德福公共设施科技有限公司</p>
                <p>银行账号： 472871189287</p>
                <p>开户行：中国银行徐州铜山支行营业部</p>
                <p>
                  微信号：
                  <span class="span-paddings">{{ partABehalfWeChat }}</span>
                </p>
                <p>
                  电子邮箱：
                  <span class="span-paddings">{{ partABehalfEmail }}</span>
                </p>
              </div>
              <div class="card">
                <p class="card-tit">需方（乙方）</p>
                <p>需方单位（盖章）：</p>
                <p>需方代表签字：</p>
                <p>
                  地址：
                  <span class="span-paddings">{{ partBAddress }}</span>
                </p>
                <p>
                  电话/传真：
                  <span class="span-paddings">{{ partBPhone }}</span>
                </p>
                <p>
                  邮政编码：
                  <span class="span-paddings">{{ partBPostalCode }}</span>
                </p>
                <p>
                  银行账户名称：
                  <span class="span-paddings">{{ partBBankName }}</span>
                </p>
                <p>
                  银行账号：
                  <span class="span-paddings">{{ partBBankNumber }}</span>
                </p>
                <p>
                  单位全称：
                  <span class="span-paddings">{{ unitFullName }}</span>
                </p>
                <p>
                  开户行：
                  <span class="span-paddings">{{ partBBankDeposit }}</span>
                </p>
                <p>
                  税号：
                  <span class="span-paddings">{{ dutyParagraph }}</span>
                </p>
                <p>
                  微信号：
                  <span class="span-paddings">{{ partBBehalfWeChat }}</span>
                </p>
                <p>
                  电子邮箱：
                  <span class="span-paddings">{{ partBBehalfEmail }}</span>
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
        <a-textarea :autosize="{ minRows: 2, maxRows: 6 }" v-model="opinion" />
      </a-modal>
    </div>
  </a-spin>
</template>

<script>
import { contractDetail, PurchaseContract } from '@/api/contractListManagement.js'
import util from '@/components/_util/util'
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    attrs: {},
  }
  if (index === 4) {
    obj.attrs.colSpan = 0
  }
  return obj
}
export default {
  name: 'PreviewTripartiteContract',
  components: {},
  props: {},
  data() {
    return {
      data: [],
      instanceId: undefined,
      saleContractLowCPriceAllAmount: 0,
      enterpriseName: '江苏万德福公共设施科技有限公司',
      enterpriseNameEnglish: 'JiangSu Wonderful Infrastructure Manufacturing co.,Ltd',
      contractNum: '', // 合同编号
      createTime: '', // 签订日期
      contractTitle: '代签购货合同',
      supplier: '江苏万德福公共设施科技有限公司', // 供方（甲方）
      demandUnit: '', // 需方（乙方）
      chineseTotalAmount: '零',
      totalAmount: 0,
      requirementSpecification: '无', // 需方产品特殊要求说明
      qualityFrame: 3, // 主框架质保期
      qualityElectronics: 1, // 电器件质保期
      qualityLayer: 3, // 表面涂层质保期
      deliveryDate: '',
      deliveryAddress: '',
      deliveryName: '',
      mobile: '',
      freightType: '', // 运费类型
      transportType: '',
      qualityGuaranteeDeposit: 12000, // 质保金应付金额
      qgdPaymenCycle: '2019-06-21', // 质保付款周期
      AdvancePaymentPayable: 5000, // 预付款应付金额
      appPaymenCycle: '2019-06-25', // 预付款付款周期
      ProgressPaymentPayable: 600000, // 进度款应付金额
      pppPaymenCycle: '2019-06-30', // 进度款付款周期
      withdrawalAmount: 34000, // 提货款应付金额
      waPaymenCycle: '2019-07-02', // 提货款周期
      AcceptancePaymentPayable: 900, // 验收款应付金额
      acceptPaymenCycle: '2019-07-07', // 验收款周期
      waysOfResolution: '二', // 合同争议解决方式
      partyAb: '甲', // 甲乙方所在地
      partAemail: '', // 甲方邮箱账号
      partBemail: '', // 乙方邮箱账号
      contractTotalNumber: '肆', // 合同一式几份
      contractABNumber: '贰', // 甲乙双方各几份
      partABehalf: '张张', // 甲方代表
      partBBehalf: '小小', // 乙方代表
      partABehalfWeChat: '9341592', // 甲方代表微信号
      partABehalfEmail: '934159243@qq.com', // 甲方代表邮箱号
      partBAddress: '',
      partBPhone: '',
      partBPostalCode: '',
      partBBankName: '',
      partBBankNumber: '',
      partBBankDeposit: '',
      partBBehalfWeChat: '',
      partBBehalfEmail: '',
      isFull: false, // 是否全款
      fullPayDate: '', // 全款付款日期
      purchaseContractSettlementDetailVoList: [],
      fullList: [],
      unitFullName: '',
      dutyParagraph: '',
      isPassBtn: false, // 通过不通过按钮的是否显示
      opinion: '', // 审批意见
      visible: false, // 审批弹出层是否可见
      loading: false,
      dialogTitle: '审批操作',
      contractDispute: '一', // 仲裁所在地  0提交仲裁委员会仲裁1向甲方所在地人民法院提起诉讼2向乙方所在地人民法院提起诉讼
      contractDisputeName: null,
      additionalTreaty: '无', // 附加条款
      approvalStatus: 0, // 合同审批状态
      commonSeal: '', // 公章Src地址
      saleUserSeal: '', // 供方代表销售人员章

      signForm: 1, // 合同签订方式 1 邮件签订2 书面签订
      increaseTotalPayment: 0, //质保期限及要求 增加总金额

      requirementSpecification: '',
      demandUnit: '',
      qualityFrame: '',
      qualityElectronics: '',
      qualityLayer: '',
      deliveryAddress: '',
      deliveryName: '',
      mobile: '',
      transportType: '',
      convention: '',
      unconvention: '',
      productLoading: false, //加载产品的loading...
      isSalesManager: false, //用户是否销售经理
      approvalNodeData: [], //审批节点数据 销售经理使用(多选框)
      checkedValues: [], //已选择的节点数据
      nowDate: '',
      otherInfo: null, //八、运输方式及到达（港）站和费用承担  额外信息
      spinning: false,
      wordUrl: '',
      unIsTax: false, //是否含税
      isNeedFreshChaper: 0, //默认不是鲜章
      queryOne_freightType: 1,
      queryOne_freightCharge: 0,
      bucketType: 1, // 1智能桶合同 2 常规桶合同
      qualityLimit: 1, //常规桶 质保期
      detailDeliveryAddress: '', //新地址

      getLookDetail_isTax: 1,
      getLookDetail_freightType: 1,
      getLookDetail_freightDivType: 2,
    }
  },
  computed: {
    contactList() {
      return this.makeContact({ addressStr: this.deliveryAddress, nameStr: this.deliveryName, mobilStr: this.mobile })
    },
    columns() {
      let baseColumns = [
        {
          title: '标的名称',
          dataIndex: 'targetName',
        },
        {
          title: '产品类别',
          dataIndex: 'productType',
          scopedSlots: { customRender: 'productType' },
        },
        {
          title: '商标',
          scopedSlots: { customRender: 'trademark' },
        },
        {
          title: '产品型号',
          dataIndex: 'productName',
        },
        {
          title: '图片',
          dataIndex: 'productPic',
          scopedSlots: { customRender: 'productImage' },
        },
        {
          title: '单位',
          dataIndex: 'company',
        },
        {
          title: '数量',
          dataIndex: 'count',
        },
      ]
      /**不含税，不含运费 */
      let case1 = baseColumns.concat([
        {
          title: '单价(元)',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '金额(元)',
          dataIndex: 'unitAmount',
          scopedSlots: { customRender: 'unitAmount' },
        },
      ])
      /**含税，不含运费 */
      let case2 = baseColumns.concat([
        {
          title: '含税单价(元)',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '含税金额(元)',
          dataIndex: 'unitAmount',
          scopedSlots: { customRender: 'unitAmount' },
        },
      ])
      /**不含税，含运费，单价 */
      let case3 = baseColumns.concat([
        {
          title: '单价(元)',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '含运费单价(元)',
          dataIndex: 'freightUnitPrice',
          scopedSlots: { customRender: 'freightUnitPrice' },
        },
        {
          title: '含运费金额(元)',
          dataIndex: 'freightUnitAmount',
          scopedSlots: { customRender: 'freightUnitAmount' },
        },
      ])
      /**不含税，含运费，金额 */
      let case4 = baseColumns.concat([
        {
          title: '单价(元)',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '金额(元)',
          dataIndex: 'unitAmount',
          scopedSlots: { customRender: 'unitAmount' },
        },
        {
          title: '含运费金额(元)',
          dataIndex: 'freightUnitAmount',
          scopedSlots: { customRender: 'freightUnitAmount' },
        },
      ])
      /**含税，含运费，单价 */
      let case5 = baseColumns.concat([
        {
          title: '含税单价(元)',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '含税含运费单价(元)',
          dataIndex: 'freightUnitPrice',
          scopedSlots: { customRender: 'freightUnitPrice' },
        },
        {
          title: '含税含运费金额(元)',
          dataIndex: 'freightUnitAmount',
          scopedSlots: { customRender: 'freightUnitAmount' },
        },
      ])
      /**含税，含运费，金额 */
      let case6 = baseColumns.concat([
        {
          title: '含税单价(元)',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '含税金额(元)',
          dataIndex: 'unitAmount',
          scopedSlots: { customRender: 'unitAmount' },
        },
        // {
        //   title: '含税含运费金额(元)',
        //   dataIndex: 'freightUnitAmount',
        //   scopedSlots: { customRender: 'freightUnitAmount' },
        // },
      ])
      let targetColumns = []
      //this.freightDivType  1单价 2金额
      //是否含运费
      let hasFreight = this.getLookDetail_freightType === 1 ? true : false
      //是否单价
      let hasFreightDivOne = this.getLookDetail_freightDivType === 2 ? true : false
      //是否含税
      let hasTax = this.getLookDetail_isTax === 1 ? true : false

      if (hasTax) {
        targetColumns = hasFreight ? (hasFreightDivOne ? case5 : case6) : case2
      } else {
        targetColumns = hasFreight ? (hasFreightDivOne ? case3 : case4) : case1
      }
      let productL = this.saleContractLowCPriceAllAmount > 0 ? true : false
      if (productL) {
        targetColumns.push(
          {
            align: 'center',
            title: '低于C价差额',
            dataIndex: 'productLowCPriceUnitAmount',
            scopedSlots: { customRender: 'productLowCPriceUnitAmount' },
          },
          {
            align: 'center',
            title: '低于C价总差额',
            dataIndex: 'productLowCPriceAllAmount',
            scopedSlots: { customRender: 'productLowCPriceAllAmount' },
          }
        )
      }
      //targetColumns.push({title: '交货日期',dataIndex: 'dateTime'})
      return targetColumns
    },
  },
  watch: {
    $route(to, from) {
      console.log(to)
      if (to.name === 'previewTripartiteContract') {
        this.init()
      }
    },
  },
  cerated() {},
  mounted() {
    this.init()
    // 获取当前时间
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    this.nowDate = year + '年' + month + '月' + strDate + '日'
  },
  methods: {
    async init() {
      let that = this
      const queryOneData = this.$router.currentRoute.params.queryOneData
      if (!queryOneData) return
      const id = queryOneData.id
      console.log('预览合同的查询queryOneData', queryOneData)
      if (this.$router.currentRoute.params.action === 'approval') {
        this.isPassBtn = true
      }
      if (this.$router.currentRoute.params.action === 'edit') {
        this.isPassBtn = false
      }
      this.getInfor()
    },

    // 获取合同的详细信息
    getInfor() {
      let that = this
      let queryOneData = this.$router.currentRoute.params.queryOneData
      // 获取合同预览信息
      contractDetail({
        purchaseContractId: this.$router.currentRoute.params.queryOneData.id,
      })
        .then((res) => {
          console.log(res.data)
          let react = res.data.purchaseContractDetailVo

          let purchase = res.data.purchaseContractInfoDetailVo

          // console.log('预览合同需要的接口mobileTerminal', res)
          this.instanceId = react.instanceId
          this.contractNum = react.contractNum
          this.demandUnit = react.customerName
          this.createTime = react.signingDate
          this.data = res.data.purchaseContractProductDetailVoList
          this.chineseTotalAmount = res.data.chineseTotalAmount
          this.totalAmount = parseFloat(res.data.totalAmount)
          this.qualityFrame = react.frameWarranty //主框架
          this.qualityElectronics = react.electricWarranty // 电器
          this.qualityLayer = react.coatingWarranty // 涂层
          this.deliveryDate = react.deliveryDate // 交货日期
          this.deliveryAddress = react.detailDeliveryAddress // 地址
          this.freightType = react.freightType ///运费类型
          this.transportType = react.transportMode //运输方式
          this.purchaseContractSettlementDetailVoList = res.data.purchaseContractSettlementDetailVoList // 结算方式
          this.partAemail = purchase.ourEmail //甲方邮箱账号
          this.partBemail = purchase.customerEmail // 乙方邮箱
          this.requirementSpecification = purchase.requirementSpecification //需方产品特殊说明
          this.isFull = react.fullPayment //全款
          this.fullList = res.data.purchaseContractSettlementDetailVoList //全款结算方式
          this.partBAddress = react.detailDeliveryAddress //乙方地址
          this.partBPhone = react.customerPhone // 乙方手机号
          this.partBPostalCode = react.customerPostcode //邮编
          this.unitFullName = react.customerFullName // 单位全称
          this.partBBankDeposit = react.customerBankName // 开户行
          this.partBBankNumber = react.customerBankAccount //银行账号
          this.partBBankName = react.customerBankName // 银行账号名称
          this.dutyParagraph = react.customerTfn //税号
          this.partBBehalfWeChat = react.customerWxNum
          this.partBBehalfEmail = react.customerEmail
          this.contractDispute = purchase.solveDispute //争议方式
          // this.increaseTotalPayment = res.data.increaseTotalPayment
          this.unIsTax = react.isTax === 1 ? true : false
          this.isNeedFreshChaper = purchase.needSignet
          this.otherInfo = react.deliveryOther
          this.saleContractLowCPriceAllAmount = res.data.saleContractLowCPriceAllAmount

          this.bucketType = react.bucketType || 1
          this.qualityLimit = react.qualityWarranty || 1
          this.detailDeliveryAddress = react.detailDeliveryAddress || ''

          this.getLookDetail_isTax = react.isTax
          this.getLookDetail_freightType = react.freightType
          this.getLookDetail_freightDivType = react.freightAllotType

          // if (res.data.contractDisputeName) {
          //   this.contractDisputeName = res.data.contractDisputeName
          // }
          this.additionalTreaty = purchase.additionalTreaty
          this.approvalStatus = react.status
          this.commonSeal = react.commonSeal
          this.saleUserSeal = react.saleUserSeal
          this.partABehalf = react.userName
          this.signForm = parseInt(purchase.signType)
          this.wordUrl = react.detailUrl

          this.queryOne_freightType = react.freightType
          this.queryOne_freightCharge = react.freight

          if (this.queryOne_freightType === 1) {
            let _columns = [...this.columns]
            let _item = _columns.find((item) => item.dataIndex === 'raitMoney')
            if (_item) {
              _item.title = this.queryOne_freightType === 1 ? '含税含运费金额(元)' : '含税金额(元)'
              this.columns = _columns
            }
          }
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
          this.$message.error('网络异常，尝试重新操作')
          // this.$router.push({ name: 'distributionContractList'})
          this.$router.go(-1)
        })
    },
    // 返回
    goBackConstractList() {
      let that = this
      that.$destroy('previewTripartiteContract')
      that.$nextTick(() => {
        let _from = that.$route.params.from || 'contractBehalfList'
        //that.$router.push({ name: _from })
        that.$router.push({ name: _from ,params:{...(that.$route.params || {})}})
      })
    },
    // 通过
    okPass() {
      let that = this
      const params = {
        approveId: this.$router.currentRoute.params.queryOneData.id,
        isAdopt: 0,
        opinion: '',
      }
      that.spinning = true
      //   //原流程
      PurchaseContract(params)
        .then((res) => {
          that.spinning = false
          that.$router.go(-1) // 返回上一页
          // this.$router.push({name:'distributionContractList'})
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          that.loading = false
          that.spinning = false
        })
      // }
    },
    // 不通过
    isPass(e) {
      this.visible = true
      console.log('点击的到底是通过还是不通过', e)
      this.isAdopt = e.isAdopt
    },
    // 取消
    handleCancel() {
      this.visible = false
    },
    handleSubmit() {
      let that = this
      that.visible = false

      setTimeout(function () {
        that.spinning = true
        const params = {
          approveId: that.$router.currentRoute.params.queryOneData.id,
          opinion: that.opinion,
          isAdopt: that.isAdopt,
        }
        //   //原流程
        PurchaseContract(params)
          .then((res) => {
            console.log('通过或者不通过点击确定调取接口的结果', res)
            that.visible = false
            that.$router.go(-1) // 返回上一页
          })
          .catch((error) => {
            console.error(error)
          })
          .finally(() => {
            that.loading = false
            that.spinning = false
          })
      }, 500)
    },
    getPDF() {
      util.handleWindowPrint('#pdfDom', '销售合同')
    },
    onChange(checkedValues) {
      console.log('checked = ', checkedValues)
      this.checkedValues = checkedValues
    },
    makeContact(contactOpt = {}) {
      //联系人数据源
      let _addressStr = contactOpt.addressStr || ''
      let _nameStr = contactOpt.nameStr || ''
      let _mobilStr = contactOpt.mobilStr || ''

      let addressArr = _addressStr.split(';')
      let nameArr = _nameStr.split(';')
      let mobileArr = _mobilStr.split(';')
      let maxLen = Math.max(addressArr.length, nameArr.length, mobileArr.length)
      let minLen = Math.min(maxLen, 3)
      if (addressArr.length < minLen) {
        let arr = new Array(minLen)
        addressArr.map((val, index) => (arr[index] = val))
        addressArr = arr
      }
      if (nameArr.length < minLen) {
        let arr = new Array(minLen)
        nameArr.map((val, index) => (arr[index] = val))
        nameArr = arr
      }
      if (mobileArr.length < minLen) {
        let arr = new Array(minLen)
        mobileArr.map((val, index) => (arr[index] = val))
        mobileArr = arr
      }
      let contacts = []
      addressArr.map((val, index) => {
        contacts.push({
          name: nameArr[index] ? nameArr[index] : '',
          telphone: mobileArr[index] ? mobileArr[index] : '',
          address: addressArr[index] ? addressArr[index] : '',
        })
      })
      //过滤
      let filterContact = contacts.filter((c) => c.name !== '' && c.telphone !== '' && c.address !== '')
      //格式化
      let result = filterContact.map((c) => {
        let nameHTML = `<span style="margin:0 5px;">姓名：${c.name}</span>`
        let telphoneHTML = `<span style="margin:0 5px;">电话：${c.telphone}</span>`
        let addressHTML = `<span style="margin:0 5px;">详细地址：${c.address}</span>`
        return `${nameHTML} ${telphoneHTML} ${addressHTML}`
      })
      return result
    },
  },
}
</script>

<style lang="less" scoped>
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
  width: 100%;
  padding: 16px;
}
.card-wrap .card {
  width: 44%;
  float: left;
  margin: 0;
}
.card-wrap .card ~ .card {
  margin-left: 3%;
}
.card-wrap .card p {
  margin-bottom: 0;
}
.margin-b {
  margin-bottom: 24px;
}
</style>
