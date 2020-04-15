<template>
  <div class="contract-wrap">
    <div class="contract-header">
      <div class="log-wrap">
        <img src="@/assets/icon_contract.jpg" alt="合同图标">
      </div>
      <div class="top-right-page">
        <div class="top-right-item">{{ enterpriseName }}</div>
        <div class="top-right-item">{{ enterpriseNameEnglish }}</div>
      </div>
    </div>
    <div class="contract-main">
      <div class="main-top">
        <div class="contract-title-part">
          <h2>{{ contractTitle }}</h2>
          <div>
            <span>供方(甲方)：</span>
            <span> {{ supplier }}</span>
          </div>
          <div>
            <span>需方(乙方)：</span>
            <span> {{ demander }}</span>
          </div>
        </div>
        <div class="contract-title-num">
          <div class="title-num-item">
            <span>合同编号 :</span>
            <span>{{ contractNumber }}</span>
          </div>
          <div class="title-num-item">
            <span>签订时间 :</span>
            <span>{{ signingDate }}</span>
          </div>
        </div>
      </div>
      <div class="main-content-wrap">
        <div class="content-p">一、标的、数量、货款及交（提）货日期：</div>
        <a-table
          class="productTab"
          :columns="columns"
          rowKey="id"
          :dataSource="data"
          :pagination="false"
          bordered
        >
        </a-table>
        <div style="padding: 16px;border: 1px solid #ddd;">
          合计：（人民币）<span class="span-paddings">{{ totalMonery }}</span><span class="span-paddings">￥({{ totalMoneryNum }})元</span>。此价格不含运费。
        </div>
        <div class="content-p"> 二、质量及检验标准：依照万德福公司相关产品检验标准执行。</div>
        <div class="content-p">三、需方产品特殊要求说明：<span class="span-paddings">{{ specialRequirements }}</span></div>
        <div class="content-p"> 四、质保期限及要求：主框架 <span class="span-paddings">{{ guaranteePeriodMain }}</span>年、电器件 <span class="span-paddings">{{ electricDevice }}</span>年、表面涂层<span class="span-paddings">{{ surfaceCoating }}</span>年</div>
        <div class="content-p"> 五、标的物所有权自乙方付清全额货款之日起转移，若乙方未履行全部支付义务，标的物所有权为甲方所有。产品损毁、灭失风险在未交付前由甲方承担，交付后由乙方承担。</div>
        <div class="content-p"> 六、交货时间：<span class="span-paddings">{{ deliveryDate }}</span>甲方按期通知乙方提货，乙方需在五个工作日内结清货款并提货。自提货通知发起一个月后，如乙方不能及时提货，每日应按照合同金额的3‰付甲方仓储费，提货前补齐全部款项。</div>
        <div class="content-p"> 七、交货地点及联系人：</div>
        <div class="content-p p-text-index"> 详细地址（省市区县乡镇街道）：<span class="span-paddings">{{ detiaAddress }}</span></div>
        <div class="content-p p-text-index"> 联系人姓名：<span class="span-paddings">{{ contactName }}</span> </div>
        <div class="content-p p-text-index"> 联系人电话号码：<span class="span-paddings">{{ contactPhone }}</span> </div>
        <div class="content-p"> 八、运输方式及到达（港）站和费用承担：</div>
        <div class="content-p p-text-index"> 运费类型：<span class="span-paddings">{{ freightType }}</span></div>
        <div class="content-p p-text-index"> 运输方式：<span class="span-paddings">{{ transportMode }}</span> 。乙方自提货物，甲方负责将货物装入乙方委派车辆。</div>
        <div class="content-p p-text-index">代办托运说明</div>
        <div class="content-p p-text-index">甲方为乙方代办托运时，运输费用由乙方承担，甲方负责运输货物的装卸相关事宜。甲方货物从仓库配送出库后，在运输途中发生的一切安全、短少、变更路线等问题，由甲方帮助乙方协调承运方，协商解决。凡因人力不可抗拒因素，如自然灾害、合理损耗等非甲方造成的损失或货物延迟，甲方概不负责．</div>
        <div class="content-p"> 九、结算方式及时间：</div>
        <div class="content-p p-text-index"> 1、质保金应付金额：<span class="span-paddings">{{ qualityGuaranteeDeposit }}</span>。付款周期：<span class="span-paddings">{{ qgdPaymenCycle }}</span></div>
        <div class="content-p p-text-index">  2、预付款应付金金额：<span class="span-paddings">{{ AdvancePaymentPayable }}</span>。付款周期：<span class="span-paddings">{{ appPaymenCycle }}</span></div>
        <div class="content-p p-text-index">  3、进度款应付金金额:<span class="span-paddings">{{ ProgressPaymentPayable }}</span>。付款周期：<span class="span-paddings">{{ pppPaymenCycle }}</span></div>
        <div class="content-p p-text-index">  4、提货款应付金金额：<span class="span-paddings">{{ withdrawalAmount }}</span>。付款周期：<span class="span-paddings">{{ waPaymenCycle }}</span></div>
        <div class="content-p p-text-index">    5、验收款应付金金额：<span class="span-paddings">{{ AcceptancePaymentPayable }}</span>。付款周期：<span class="span-paddings">{{ acceptPaymenCycle }}</span></div>
        <div>注：交货时间按预付款到账时间顺延。（按照签订协议时间和交货时间的周期顺延）</div>
        <div class="content-p"> 十、违约责任： 按《中华人民共和国合同法》追究责任。</div>
        <div class="content-p">  十一、合同争议的解决方式：本合同在履行过程中发生的争执，由双方当事人协商解决，也可由当地工商行政管理部门调解；协商或调解不成，按下列第 <span class="span-underline">{{ waysOfResolution }}</span>种方式解决。</div>
        <div class="content-p p-text-index">（一）、提交仲裁委员会仲裁；<span class="span-paddings">（二）、向 {{ partyAb }} 方所在地人民法院提起诉讼</span></div>
        <div class="content-p">十二、</div>
        <div class="content-p p-text-index"> 1、此协议通过邮件形式签订（甲方邮箱账号：<span class="span-paddings">{{ partAemail }}</span>乙方邮箱账号： {{ partBemail }} ），合同自双方签字盖章并回复确认后方可生效，合同的附件享有同等法律效力。</div>
        <div class="content-p p-text-index">   2、此协议通过书面签订形式签订，合同自双方签字盖章后生效，合同的附件享有同等法律效力。本合同一式<span class="span-paddings">{{ contractTotalNumber }}</span>份，甲乙双方各<span class="span-paddings">{{ contractABNumber }}</span>份，由于保管不当而引起的纠纷由当事人负全部责任。</div>
        <div class="content-p">十三、其他约定事项：以上产品为甲方拥有自主知识产权的专利产品，乙方不得购买、销售假冒或仿冒合同产品，不得以任何形式伪造、仿造甲方产品。如有上述行为应视为违约，应承担法律责任。甲方有权单方面终止与乙方的一切商业合作关系，并要求乙方按合同金额的100%赔偿违约金，甲方有权从货物预付款或保证金中扣除违约金，不足部分由乙方补足，甲方保留依法追究乙方侵权责任的权利。</div>
        <div class="content-p">十四、双方约定通过微信号、邮箱相互传递资料，作为合同的一部分，履行法律效力。</div>
        <div class="card-wrap clearfix">
          <div class="card">
            <p class="card-tit">供方（甲方）</p>
            <p>供方单位（盖章）：<span class="span-paddings">{{ supplier }}</span>（植入公章,图片展示）</p>
            <p> 供方代表签字：<span class="span-paddings">{{ partABehalf }}</span>（植入签字，图片展示）</p>
            <p>地址：江苏省徐州市铜山区张集工业园</p>
            <p>电话/传真：0516-66699966（传真）</p>
            <p>邮政编码：221000</p>
            <p>银行账户名称：江苏万德福公共设施科技有限公司</p>
            <p>银行账号： 472871189287</p>
            <p>开户行：中国银行徐州铜山支行营业部</p>
            <p>微信号：<span class="span-paddings">{{ partABehalfWeChat }}</span></p>
            <p>电子邮箱：<span class="span-paddings">{{ partABehalfEmail }}</span></p>
          </div>
          <div class="card">
            <p class="card-tit">需方（乙方）</p>
            <p>需方单位（盖章）：<span class="span-paddings">{{ demander }}</span>（盖章）</p>
            <p> 需方代表签字：<span class="span-paddings">{{ partBBehalf }}</span></p>
            <p>地址：<span class="span-paddings">{{ partBAddress }}</span></p>
            <p>电话/传真：<span class="span-paddings">{{ partBPhone }}</span></p>
            <p>邮政编码：<span class="span-paddings">{{ partBPostalCode }}</span></p>
            <p>银行账户名称：<span class="span-paddings">{{ partBBankName }}</span></p>
            <p>银行账号： <span class="span-paddings">{{ partBBankNumber }}</span></p>
            <p>开户行：<span class="span-paddings">{{ partBBankDeposit }}</span></p>
            <p>微信号：<span class="span-paddings">{{ partBBehalfWeChat }}</span></p>
            <p>电子邮箱：<span class="span-paddings">{{ partBBehalfEmail }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { } from '@/api/contractListManagement.js'
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    attrs: {}
  }
  if (index === 4) {
    obj.attrs.colSpan = 0
  }
  return obj
}
const data = [{
  key: '1',
  underlyingName: '******',
  productCategory: '******',
  brand: '******',
  productModel: '******',
  productName: '******', // 图片路径
  productColor: '******',
  unit: '******',
  number: '******',
  unitPrice: '******',
  Amount: '******',
  taxRate: '******',
  amountIncludingTax: '******',
  deliveryDate: '******'
}, {
  key: '2',
  underlyingName: '******',
  productCategory: '******',
  brand: '******',
  productModel: '******',
  productName: '******', // 图片路径
  productColor: '******',
  unit: '******',
  number: '******',
  unitPrice: '******',
  Amount: '******',
  taxRate: '******',
  amountIncludingTax: '******',
  deliveryDate: '******'
}, {
  key: '3',
  underlyingName: '******',
  productCategory: '******',
  brand: '******',
  productModel: '******',
  productName: '******', // 图片路径
  productColor: '******',
  unit: '******',
  number: '******',
  unitPrice: '******',
  Amount: '******',
  taxRate: '******',
  amountIncludingTax: '******',
  deliveryDate: '******'
}]
export default {
  name: 'TripartiteContractTemplate',
  components: {},
  props: {},
  data () {
    const columns = [{
      align: 'center',
      title: '标的名称',
      dataIndex: 'underlyingName',
      key: 'underlyingName',
      customRender: renderContent
    }, {
      align: 'center',
      title: '产品类别',
      dataIndex: 'productCategory ',
      key: 'productCategory',
      customRender: renderContent
    }, {
      align: 'center',
      title: '商标',
      dataIndex: 'brand',
      key: 'brand',
      customRender: renderContent
    }, {
      align:'center',
      title: '产品代码',
      dataIndex: 'productModel',
      key: 'productModel',
      customRender: renderContent
    },
    {
      align: 'center',
      title: '图片',
      dataIndex: 'productName',
      key: 'productName',
      customRender: renderContent
    },
    {
      align: 'center',
      title: '颜色',
      dataIndex: 'productColor',
      key: 'productColor',
      customRender: renderContent
    },
    {
      align: 'center',
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      customRender: renderContent
    },
    {
      align: 'center',
      title: '数量',
      dataIndex: 'number',
      key: 'number',
      customRender: renderContent
    },
    {
      align: 'center',
      title: '单价（元）',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      customRender: renderContent
    },
    {
      align: 'center',
      title: '金额（元）',
      dataIndex: 'Amount',
      key: 'Amount',
      customRender: renderContent
    },
    {
      align: 'center',
      title: '税率',
      dataIndex: ' taxRate',
      key: 'taxRate',
      customRender: renderContent
    },
    {
      align: 'center',
      title: '含税金额（元）',
      dataIndex: 'amountIncludingTax',
      key: 'amountIncludingTax',
      customRender: renderContent
    }, {
      align: 'center',
      title: '交货日期',
      dataIndex: ' deliveryDate',
      key: 'deliveryDate',
      customRender: renderContent
    }]
    return {
      data,
      columns,
      enterpriseName: '江苏万德福公共设施科技有限公司',
      enterpriseNameEnglish: 'JiangSu Wonderful Infrastructure Manufacturing co.,Ltd',
      contractNumber: '************', // 合同编号
      signingDate: '************', // 签订日期
      contractTitle: '三方合同',
      supplier: '江苏万德福公共设施科技有限公司', // 供方（甲方）
      demander: '************', // 需方（乙方）
      totalMonery: '************',
      totalMoneryNum: '************',
      specialRequirements: '************', // 需方产品特殊要求说明
      guaranteePeriodMain: '****', // 主框架质保期
      electricDevice: '****', // 电器件质保期
      surfaceCoating: '****', // 表面涂层质保期
      deliveryDate: '************',
      detiaAddress: '************',
      contactName: '************',
      contactPhone: '************',
      freightType: '************',
      transportMode: '************',
      qualityGuaranteeDeposit: '************', // 质保金应付金额
      qgdPaymenCycle: '************', // 质保付款周期
      AdvancePaymentPayable: '************', // 预付款应付金额
      appPaymenCycle: '************', // 预付款付款周期
      ProgressPaymentPayable: '************', // 进度款应付金额
      pppPaymenCycle: '************', // 进度款付款周期
      withdrawalAmount: '************', // 提货款应付金额
      waPaymenCycle: '************', // 提货款周期
      AcceptancePaymentPayable: '************', // 验收款应付金额
      acceptPaymenCycle: '************', // 验收款周期
      waysOfResolution: '****', // 合同争议解决方式
      partyAb: '****', // 甲乙方所在地
      partAemail: '************', // 甲方邮箱账号
      partBemail: '************', // 乙方邮箱账号
      contractTotalNumber: '****', // 合同一式几份
      contractABNumber: '****', // 甲乙双方各几份
      partABehalf: '************', // 甲方代表
      partBBehalf: '************', // 乙方代表
      partABehalfWeChat: '************', // 甲方代表微信号
      partABehalfEmail: '************', // 甲方代表邮箱号
      partBAddress: '************',
      partBPhone: '************',
      partBPostalCode: '************',
      partBBankName: '************',
      partBBankNumber: '************',
      partBBankDeposit: '************',
      partBBehalfWeChat: '************',
      partBBehalfEmail: '************'
    }
  },
  computed: {

  },
  watch: {

  },
  cerated () {

  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
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
    margin: 6px auto 0;
  }
  .span-paddings{
    margin: 0 6px;
  }
  .p-text-index{
    text-indent: 34px;
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
</style>
