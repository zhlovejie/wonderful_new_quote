<template>
  <div class="contract-wrap">
    <div class="contract-header">
      <div class="log-wrap">
        <img src="@/assets/icon_contract.jpg" alt="合同图标" />
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
            <span> {{ placeholder }}</span>
            <span> 地址:{{ placeholder }}</span>
          </div>
          <div>
            <span>需方(乙方)：</span>
            <span> {{ placeholder }}</span>
            <span> 地址:{{ placeholder }}</span>
          </div>
        </div>
        <div class="contract-title-num">
          <div class="title-num-item">
            <span>合同编号 :</span>
            <span>{{ placeholder }}</span>
          </div>
          <div class="title-num-item">
            <span>签订时间 :</span>
            <span>{{ placeholder }}</span>
          </div>
          <div class="title-num-item">
            <span>签订地址 :</span>
            <span>{{ placeholder }}</span>
          </div>
        </div>
      </div>

      <div class="main-content-wrap">
        <div class="content-p">
          甲、乙双方经过友好协商，依据《中华人民共和国民法典》，本着相互信任，真诚合作的原则，就乙方向甲方提供货物达成以下协议，双方共同遵守。
        </div>
        <div class="content-p">一、合同标的、价格：</div>
        <a-table class="productTab" :columns="columns" :dataSource="data" :pagination="false" bordered>
          <template slot="footer">
            合计：（人民币）<span class="span-paddings">{{ placeholder }}</span
            ><span class="span-paddings">￥{{ placeholder }}</span
            >。
          </template>
        </a-table>

        <p></p>

        <div class="content-p">二、付款方式</div>
        <div class="content-p p-text-index">
          2.1.货款结算方式：现款现货/账期结算
        </div>
        <div class="content-p p-text-index">
          <div>2.2支付期限：一次性支付/分期支付</div>
          <div style="margin-left:20px;">
            <div>全款应付金额:xxx &nbsp;&nbsp;付款周期:xxx</div>
            <div>预付款应付金额:xxx &nbsp;&nbsp;付款周期:xxx</div>
            <div>进度款应付金额:xxx &nbsp;&nbsp;付款周期:xxx</div>
            <div>提货款应付金额:xxx &nbsp;&nbsp;付款周期:xxx</div>
            <div>验收款应付金额:xxx &nbsp;&nbsp;付款周期:xxx</div>
            <div>质保金应付金额:xxx &nbsp;&nbsp;付款周期:xxx</div>
          </div>
          <div>经双方约定，货款结算方式为固定账期结算，详见双方签订的战略合作协议条款。</div>
        </div>

        <div class="content-p">三、技术标准约定</div>
        <div class="content-p p-text-index">
          <div>1.XX名称XX(货物编号)</div>
          <div>XXXXXXXXXXXXXXXXXXXXXXXXX</div>
          <div>2.XX名称XX(货物编号)</div>
          <div>XXXXXXXXXXXXXXXXXXXXXXXXX</div>
          <div>3.XX名称XX(货物编号)</div>
          <div>XXXXXXXXXXXXXXXXXXXXXXXXX</div>
        </div>

        <div class="content-p">四、产品交付</div>
        <div class="content-p p-text-index">
          <div>详细地址： 江苏省徐州市铜山区张集轻工业产业园江苏万德福公共设施科技股份有限公司</div>
          <div>联系人姓名： XXX</div>
          <div>联系人电话： XXX</div>
        </div>
        <div class="content-p">五、运输方式及到达（港）站和费用承担</div>
        <div class="content-p p-text-index">
          <div>5.1 运输方式： 上门提货/代办运输</div>
          <div>5.2 如甲方自提货物，乙方负责将货物装入甲方委派车辆，如装货过程中，出现一切损失，将由乙方全部承担。</div>
          <div>
            5.3
            乙方为甲方代办托运时，运输费用由甲方承担，乙方负责运输货物的装卸相关事宜。乙方货物从仓库配送出库后，在运输途中发生的一切安全、短少、变更路线等问题，由乙方负责。
          </div>
        </div>

        <div class="content-p">六、质保期限及要求</div>
        <div class="content-p p-text-index">
          6.1产品质保期
        </div>
        <a-table class="productTab" :columns="columnsPoints" :dataSource="dataPoints" :pagination="false" bordered>
        </a-table>

        <p></p>
        <div class="content-p p-text-index">
          6.2
          如产品在使用过程中出现故障问题，乙方应在接到甲方通知后两日内指定专业人员去甲方指定的项目地维修并保障产品正常运行。由此产生的差旅费、交通费和住宿费由乙方负担。
        </div>

        <div class="content-p">七、收货验收</div>
        <div class="content-p p-text-index">
          7.1乙方提供的合同产品均应在甲方指定的地点由甲乙双方按照相应的标准进行验收。
        </div>
        <div class="content-p p-text-index">
          7.2交付的货物应附装箱清单、质量合格证等资料；在开箱检验中，甲方和乙方应就货物的规格、数量、包装、产品资料等进行检验，检验发现的任何短缺、损坏或其它与合同约定不符的情形，甲方可拒收，并可向乙方提出更换、补充。退换、补充的产品需在甲方要求的期限内完成。
        </div>
        <div class="content-p p-text-index">
          7.3货到现场后七日内完成验收，如有特殊情况，双方可协商延长验货期。
        </div>
        <div class="content-p p-text-index">
          7.4开箱检验的结果不能对抗在产品验收中及质量保证期内发现的质量问题，不能免除或影响乙方依照合同约定对甲方负有的包括产品质量在内的责任。
        </div>

        <div class="content-p">八、违约责任</div>
        <div class="content-p p-text-index">
          8.1如甲方逾期支付货款，每逾期一日则按照未付金额的 1% 支付违约金，但违约金总额不得超过合同总价款的 3%
          。因乙方产品质量问题和延期交货等原因导致甲方逾期付款的甲方不承担任何违约责任。
        </div>
        <div class="content-p p-text-index">
          8.2如乙方逾期交货，每逾期一日则按照合同总价款的XX%支付违约金并赔偿因此给甲方造成的一切损失。（直接损失和间接损失）
        </div>
        <div class="content-p p-text-index">
          8.3如因乙方交付的货物质量不符合约定，导致甲方所造成的一切直接和间接损失均由乙方负责。
        </div>
        <div class="content-p p-text-index">
          8.4甲方为了维护权利而支出的律师费、银行保单保函费、诉讼费等由乙方承担。
        </div>
        <div class="content-p p-text-index">
          8.5乙方不履行发票提供责任的，应按发票对应的税额向买方支付违约金，如因乙方提供的发票给甲方造成税务责任的，乙方应承担赔偿责任。
        </div>

        <div class="content-p">九、鉴定事项约定</div>
        <div class="content-p p-text-index">
          9.1因乙方提供的产品质量问题导致甲方设备损坏或对第三方造成损害，双方一致同意由甲方委托有资质的鉴定机构进行鉴定并一致承诺以此鉴定机构的结论作为最终结论。
        </div>
        <div class="content-p p-text-index">
          9.2如经鉴定为合格的，由乙方承担鉴定费用。
        </div>
        <div class="content-p p-text-index">
          9.3如经鉴定为不合格的，由甲方承担鉴定费用。同时甲方有权解除本合同并追究乙方的违约责任。
        </div>

        <div class="content-p">十、争议解决</div>
        <div class="content-p p-text-index">
          10.1本合同在履行过程中发生的争执，由双方当事人协商解决，也可由当地工商行政管理部门调解；协商或调解不成，向
          甲方 所在地人民法院提起诉讼。
        </div>

        <div class="content-p">十一、签订方式</div>
        <div class="content-p p-text-index">
          11.1此协议通过 微信/邮箱 （甲方邮箱账号/微信号 、乙方邮箱账号/微信号
          ）传输的方式签订，乙方签字盖章后将合同通过快递的方式邮寄给甲方合同自双方签字盖章确认后生效，合同的附件享有同等法律效力。
        </div>
        <div class="content-p p-text-index">
          11.2此协议通过 书面签订 形式签订，合同自双方签字盖章后生效，合同的附件享有同等法律效力。本合同一式 贰
          份，甲乙方双方各 壹 份，由于保管不当而引起的纠纷由当事人负全部责任。
        </div>

        <div class="content-p">十二、约定</div>
        <div class="content-p p-text-index">
          12.1双方通过指定的微信号、邮箱相互传递的经协商一致认可的合同资料，具有同等法律效力，双方应依约履行。
        </div>

        <div class="content-p">十三、其他约定</div>
        <div class="content-p p-text-index">
          13.1xxxxxxxxxxxxxxxxxxx
        </div>

        <div class="content-p">（以下无正文）</div>

        <div class="card-wrap clearfix">
          <div class="card">
            <p class="card-tit">供方（甲方）</p>
            <p>
              供方单位（盖章）：<span class="span-paddings">{{ placeholder }}</span
              >（植入公章,图片展示）
            </p>
            <p>
              供方代表签字：<span class="span-paddings">{{ placeholder }}</span
              >（植入签字，图片展示）
            </p>
            <p>地址：江苏省徐州市铜山区张集工业园</p>
            <p>电话/传真：0516-66699966（传真）</p>
            <p>邮政编码：221000</p>
            <p>银行账户名称：江苏万德福公共设施科技有限公司</p>
            <p>银行账号： 472871189287</p>
            <p>开户行：中国银行徐州铜山支行营业部</p>
            <p>
              微信号：<span class="span-paddings">{{ placeholder }}</span>
            </p>
            <p>
              电子邮箱：<span class="span-paddings">{{ placeholder }}</span>
            </p>
          </div>
          <div class="card">
            <p class="card-tit">需方（乙方）</p>
            <p>
              需方单位（盖章）：<span class="span-paddings">{{ placeholder }}</span
              >（盖章）
            </p>
            <p>
              需方代表签字：<span class="span-paddings">{{ placeholder }}</span>
            </p>
            <p>
              地址：<span class="span-paddings">{{ placeholder }}</span>
            </p>
            <p>
              电话/传真：<span class="span-paddings">{{ placeholder }}</span>
            </p>
            <p>
              邮政编码：<span class="span-paddings">{{ placeholder }}</span>
            </p>
            <p>
              银行账户名称：<span class="span-paddings">{{ placeholder }}</span>
            </p>
            <p>
              银行账号： <span class="span-paddings">{{ placeholder }}</span>
            </p>
            <p>
              开户行：<span class="span-paddings">{{ placeholder }}</span>
            </p>
            <p>
              微信号：<span class="span-paddings">{{ placeholder }}</span>
            </p>
            <p>
              电子邮箱：<span class="span-paddings">{{ placeholder }}</span>
            </p>
            <p>开票类型：<span class="span-paddings">普票、增票(勾选)</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let columns = [
  {
    align: 'center',
    title: '序号',
    dataIndex: 'order'
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'materialName'
  },
  {
    align: 'center',
    title: '品牌',
    dataIndex: 'model'
  },
  {
    align: 'center',
    title: '型号',
    dataIndex: 'productType'
  },
  {
    align: 'center',
    title: '单位',
    dataIndex: 'unit'
  },
  {
    align: 'center',
    title: '数量',
    dataIndex: 'purchaseNum'
  },
  {
    align: 'center',
    title: '单价(元)',
    dataIndex: 'newPrice'
  },
  {
    align: 'center',
    title: '税率%',
    dataIndex: 'materialRate'
  },
  {
    align: 'center',
    title: '小计(元)',
    dataIndex: 'taxAmount'
  }
]

let data = [
  {
    key: 1,
    order: '1',
    materialName: '***',
    model: '***',
    productType: '***',
    unit: '***',
    purchaseNum: '***',
    newPrice: '***',
    materialRate: '***',
    taxAmount: '***'
  },
  {
    key: 2,
    order: '2',
    materialName: '***',
    model: '***',
    productType: '***',
    unit: '***',
    purchaseNum: '***',
    newPrice: '***',
    materialRate: '***',
    taxAmount: '***'
  },
  {
    key: 3,
    order: '3',
    materialName: '***',
    model: '***',
    productType: '***',
    unit: '***',
    purchaseNum: '***',
    newPrice: '***',
    materialRate: '***',
    taxAmount: '***'
  }
]

let columnsPoints = [
  {
    align: 'center',
    title: '序号',
    dataIndex: 'order'
  },
  {
    align: 'center',
    title: '货物编号',
    dataIndex: 'a'
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'b'
  },
  {
    align: 'center',
    title: '质保期限(天)',
    dataIndex: 'c'
  },
  {
    align: 'center',
    title: '交货日期',
    dataIndex: 'd'
  }
]

let dataPoints = [
  {
    key: 1,
    order: '1',
    a: '***',
    b: '***',
    c: '***',
    d: '***'
  },
  {
    key: 2,
    order: '2',
    a: '***',
    b: '***',
    c: '***',
    d: '***'
  },
  {
    key: 3,
    order: '3',
    a: '***',
    b: '***',
    c: '***',
    d: '***'
  }
]

export default {
  name: 'purchaseContractTemplate',
  data() {
    return {
      data: data,
      columns: columns,
      columnsPoints: columnsPoints,
      dataPoints: dataPoints,
      enterpriseName: '江苏万德福公共设施科技有限公司',
      enterpriseNameEnglish: 'JiangSu Wonderful Infrastructure Manufacturing co.,Ltd',
      contractTitle: '采购合同',
      supplier: '江苏万德福公共设施科技有限公司', // 供方（甲方）
      placeholder: '***'
    }
  }
}
</script>

<style lang="less" scoped>
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
  margin: 6px auto 0;
}
.span-paddings {
  margin: 0 6px;
}
.p-text-index {
  text-indent: 34px;
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
</style>
