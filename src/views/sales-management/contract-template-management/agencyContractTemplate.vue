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
            <span> 江苏万德福公共设施科技有限公司</span>
          </div>
          <div>
            <span>需方(乙方)：</span>
            <span> {{ placeholder }}</span>
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
        </div>
      </div>

      <div class="main-content-wrap">
        <div class="content-p">一、代理产品范围、期限及区域：</div>
        <div class="content-p p-text-index">1.1甲方授权乙方产品 {{ placeholder }}</div>
        <div class="content-p p-text-index">
          1.2 本协议有效期 {{ placeholder }}年 {{ placeholder }} 月 {{ placeholder }}　日 至 {{ placeholder }}　年
          {{ placeholder }}　月 {{ placeholder }} 日在甲方指定的 {{ placeholder }}省{{ placeholder }}市{{
            placeholder
          }}区 （以下称销售区域）行政区域内销售甲方产品，成为甲方产品在上述区域内的代理商。
        </div>

        <div class="content-p">二、销售任务、代理保证金及返点</div>
        <div class="content-p p-text-index">
          2.1 乙方要保证在有效期内完成任务 {{ placeholder }} 万元（不包含配件销售）。
        </div>
        <div class="content-p p-text-index">
          2.2 合同签订3个工作日内乙方向甲方缴纳 {{ placeholder }} 万元区域代理保证金。
        </div>
        <div class="content-p p-text-index">2.3 任务完成后甲方给予乙方完成额 3% 比例的返点奖励。</div>
        <!-- 规则：(保证金：有、无。勾选。选择有，则显示2.2。选择无，不显示此条款。-->
        <!-- 返点：有、无。勾选。选择有，则显示2.3。3%固定。选择无，不显示此条款。) -->

        <div class="content-p">三、甲乙双方的关系</div>
        <div class="content-p p-text-index">
          3.1
          尽管有上述授权，但甲方仍保留权利。乙方公司内必须有一名销售万德福的专职业务负责人与甲方负责该区域业务人员保持沟通。
        </div>
        <div class="content-p p-text-index">
          3.2
          甲方和乙方之间仅限于甲方产品经销代理的关系，为互相独立的合同缔约方。因此，乙方不得以或试图以甲方或其任何关联公司或附属公司的合伙人、代表、代理人或特许商的身份开展业务，或以明示或暗示的方式作如此表述。在任何情况下，乙方不得因本协议书而被视为与甲方或其任何关联公司和附属公司有上述关系。乙方应以本人身份进行产品销售，并且为自身利益与顾客签订购销合同，同时应自行独立承担其在该等购销合同项下的义务和责任。乙方不得代表甲方签订任何合同性文件或作出任何承诺、声明、保证或陈述。乙方违反前述规定所签订的合同性文件和作出的任何承诺、声明、保证或陈述对甲方在任何情况下均不具有约束力。
        </div>

        <div class="content-p">四、分销区域、渠道和产品</div>
        <div class="content-p p-text-index">4.1 乙方承诺在本协议书有效期内努力发展分销渠道。</div>
        <div class="content-p p-text-index">
          4.2
          乙方同意如果乙方在销售区域内的分销渠道没有被充分地覆盖及发展，甲方将给予提醒，如在指定时间内未有改善或未采取实质性改进方案，甲方有权将部分地区移出其销售范围。
        </div>
        <div class="content-p p-text-index">
          4.3
          除非有甲方的预先书面同意，乙方不得从任何第三方购买甲方的产品，不得向注册地址或者主要经营地址位于销售区域以外的任何单位或个人销售甲方的产品，或向任何国家或者地区出口甲方的产品。一经确认，甲方有权要求乙方限期改正，并按照甲方指令采取补救措施，甲方亦有权即时书面通知乙方解除本协议书。经甲方同意后允许乙方往甲方其他代理区域内销售的，该销售业绩算为产品到货地代理区域业绩。如其他区域经销商经乙方同意后往乙方区域发货的，该业绩应挂为乙方名下。
        </div>

        <div class="content-p">五、甲方的责任和义务</div>
        <div class="content-p p-text-index">5.1 甲方应确保提供给乙方的产品为合格产品。</div>
        <div class="content-p p-text-index">
          5.2 甲方应及时按照乙方的要求供货。甲方在乙方付清货款后，及时与乙方沟通确定发货时间。
        </div>
        <div class="content-p p-text-index">5.3 甲方安排专业人员与乙方及时沟通联系，保证信息的流通及反馈。</div>
        <div class="content-p p-text-index">
          5.4
          在协议签订后，甲方如若接到任何由乙方区域内的客户打来电话、网络咨询等方式咨询所代理产品，甲方将客户信息转交乙方，代理权限内产品由乙方全权负责与客户的沟通及业务洽谈
        </div>
        <div class="content-p p-text-index">
          5.5
          为确保代理商的合法利益不受损害，甲方在未经乙方同意的状况下，不得在乙方代理的区域内另设其他的代理商或经销商。
        </div>

        <div class="content-p">
          六、乙方的责任和义务/div>
          <div class="content-p p-text-index">
            6.1 乙方有义务及时了解和把控代理区域大项目具体情况，并及时反馈给甲方，和甲方一起对项目进行把控和运作。
          </div>
          <div class="content-p p-text-index">
            6.2
            乙方和乙方区域内的经销商，应保持良好的合作关系。销售过程期间乙方经销商的销售信息（例如竞标等）乙方应给与保护。
          </div>
          <div class="content-p p-text-index">
            6.3
            乙方不得经营销售假冒或仿冒甲方产品的侵权商品，或其它假冒伪劣商品，一经发现，甲方首先应扣除乙方全额保证金，中止合约并采取法律行动，追究乙方的责任。
          </div>
          <div class="content-p p-text-index">6.4 乙方应在发货前把所有货款全部支付完毕。</div>

          <div class="content-p">七、供应价格</div>
          <div class="content-p p-text-index">7.1 乙方享受甲方产品代理价格。</div>
          <div class="content-p p-text-index">7.2 乙方供应渠道的价格可由甲方指导乙方共同制定。</div>

          <div class="content-p">八、流动资金与付款</div>
          <div class="content-p p-text-index">8.1 乙方承诺对销售甲方的产品投入足够的流动资金。</div>
          <div class="content-p p-text-index">
            8.2 乙方订购甲方产品须以人民币付款。乙方承诺按照甲方付款政策的规定按时支付货款。
          </div>
          <div class="content-p p-text-index">
            8.3
            如果乙方不按上述甲方付款政策按时还款，甲方有权作出相应的措施，包括拒绝按照乙方的任何订单交货，不再接受乙方的任何订单，直至乙方将所有欠款足额付清为止。超过付款期10日仍未付款，乙方须承担总欠款额每月百分之二
            的滞纳金。
          </div>

          <div class="content-p">九、市场支持及业务指导</div>
          <div class="content-p p-text-index">
            9.1
            乙方负责产品在乙方销售区域内的所有广告及促销活动，甲方应无偿向乙方提供产品可印刷电子档文件、网络宣传平台用电子档文件，以及新产品培训手册电子档文件。
          </div>
          <div class="content-p p-text-index">
            9.2 甲方同意向乙方销售人员提供培训，以提高乙方的市场竞争力及服务水平。
          </div>

          <div class="content-p">十、交货</div>
          <div class="content-p p-text-index">
            10.1 甲方将协助乙方联系物流把产品运输到乙方指定的地点，交付乙方。一切运输及其它费用均由乙方承担。
          </div>
          <div class="content-p p-text-index">
            10.2
            甲方为乙方代办托运，在运输过程中发生货物毁损或缺失情况时，甲方有义务协助乙方与承运方进行交涉并妥善处理。
          </div>

          <div class="content-p">十一、协议书保密及完整性</div>
          <div class="content-p p-text-index">
            11.1 乙方在此同意为甲方的所有资料（包括本协议书以及相关文件）严格保守秘密。　
          </div>
          <div class="content-p p-text-index">11.2 本协议书及本协议书之附件构成双方有关本协议书的全部协议。</div>

          <div class="content-p">十二、期限及终止</div>
          <div class="content-p p-text-index">12.1 如乙方要继续履行合同需在合同到期前一个月与甲方续签合同。</div>
          <div class="content-p p-text-index">
            12.2 当任何一方发生破产、无偿债能力、或在其他情况下按照法律规定须终止营业时，本协议书须提前终止或取消。
          </div>
          <div class="content-p p-text-index">
            12.3
            当一方违反本协议书，并且在收到守约方书面的违约通知之后三十天内未能作出补救，则守约方可以书面通知违约方，立即提前终止本协议书。
          </div>
          <div class="content-p p-text-index">
            12.4 不论是期满不续期或提前终止本协议书，乙方均应立即将相关的资料交付甲方，并立即与甲方结清货款及费用。
          </div>

          <div class="content-p">十三、违约责任</div>
          <!-- (若无保证金，不显示13.1条) -->
          <div class="content-p p-text-index">
            13.1
            当乙方在本协议期限内没有完成区域代理内业绩时，甲方则按任务完成差额比例扣除合同比例保证金，（例如：任务500万元，完成额200万元，完成率40%，保证金为5万元，则应扣除5万元乘以完成率40%，即扣除2万元保证金。）
            协议终止时双方无债务及法律纠纷，甲方将剩余保证金退还乙方。如正常完成区域代理业绩，协议终止时双方无债务及法律纠纷，甲方则全额退还乙方所交纳的保证金。
          </div>
          <div class="content-p p-text-index">
            13.2
            协议期间，甲方在没有得到乙方同意的情况下直接供货给乙方代理区域内的经销商，甲方需承担相应的违约责任及违约赔偿(赔偿金额为实际发货金额)。如乙方区域内经销商有项目在前，并此项目和乙方没有直接冲突，乙方应予以保护且积极支持发货，如不同意，则视为乙方违约，甲方可直接供货，该业绩应挂为乙方名下。
          </div>
          <div class="content-p p-text-index">
            13.3
            除本协议已有约定外，一方违反本协议书约定，守约方有权要求违约方立即采取补救措施，并赔偿守约方由此而产生的一切损失，包括但不限于合理的律师费、差旅费、公证费。
          </div>

          <div class="content-p">十四、知识产权</div>
          <div class="content-p p-text-index">
            14.1
            本协议书的订立和履行不视为甲方同意和许可乙方使用甲方和甲方关联公司所拥有的任何专利，商标、商号、标志或者特有产品装潢。
          </div>
          <div class="content-p p-text-index">
            14.2
            如根据甲方的判断，乙方所使用的专利、商标或商号（不论是否使用中文）会对甲方或甲方关联公司的专利、商标和商号产生不利影响，或者与之类似，容易产生混淆不清，则一经甲方书面通知，乙方应立即停止使用该等专利商标或商号。
          </div>
          <div class="content-p p-text-index">
            14.3
            乙方应就任何第三方在乙方代理区域内侵犯甲方或甲方关联公司的专利、商标、商号专用权或其它知识产权的行为及时通知甲方，甲方协助乙方共同维权，乙方向第三方发出书面警告和甲方共同诉讼维权。
          </div>

          <div class="content-p">十五、转让</div>
          <div class="content-p p-text-index">
            15.1
            经另一方事先书面同意，并就债权债务达成明确的书面协议，任何一方不得将本协议书规定下的该方任何权利及义务作出转让。
          </div>
          <div class="content-p">十六、争议解决方式</div>
          <div class="content-p p-text-index">
            16.1 所有由本协议产生的争议，双方应当友好协商解决。协商解决不成的，双方均同意将前述争议提交 甲方所在地
            人民法院裁决和管辖。诉讼费用由败诉方承担，除非诉讼裁决另有裁定。
          </div>

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
                单位全称：<span class="span-paddings">{{ placeholder }}</span>
              </p>
              <p>
                开户行：<span class="span-paddings">{{ placeholder }}</span>
              </p>
              <p>
                账号： <span class="span-paddings">{{ placeholder }}</span>
              </p>
              <p>
                税号： <span class="span-paddings">{{ placeholder }}</span>
              </p>
              <p>开票类型：<span class="span-paddings">普票、增票(勾选)</span></p>
              <p>
                微信号：<span class="span-paddings">{{ placeholder }}</span>
              </p>
              <p>
                电子邮箱：<span class="span-paddings">{{ placeholder }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'softwareContractTemplate',
  data() {
    return {
      enterpriseName: '江苏万德福公共设施科技有限公司',
      enterpriseNameEnglish: 'JiangSu Wonderful Infrastructure Manufacturing co.,Ltd',
      contractTitle: '代理合同',
      supplier: '江苏万德福公共设施科技有限公司', // 供方（甲方）
      placeholder: '***',
    }
  },
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
  /**text-indent: 34px; */
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
</style>
