<template>
  <a-spin :spinning="spinning">
    <div>
      <div class="top-ation clearfix margin-b">
        <a-button class="fl-r" type="primary" @click="goBackConstractList" icon="backward">返回</a-button>
        <a v-download="detail.contractUrl" class="ant-btn ant-btn-primary fl-r">导出成PDF</a>
      </div>

      <div class="contract-wrap" id="pdfDom">
        <div class="contract-header">
          <div class="log-wrap">
            <img src="@/assets/icon_contract.jpg" style="width:48px;height:56px;" alt="合同图标" />
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
                <span>供方(甲方)地址：</span>
                <span>江苏省徐州市铜山区张集轻工业产业园</span>
              </div>
              <div>
                <span>需方(乙方)：</span>
                <span> {{ detail.secondPartyInfo.cfullName }}</span>
              </div>
              <div>
                <span>需方(乙方)地址：</span>
                <span> {{ detail.secondPartyInfo.address }}</span>
              </div>
            </div>
            <div class="contract-title-num">
              <div class="title-num-item">
                <span>合同签订时间 :</span>
                <span>{{ detail.signDate }}</span>
              </div>
              <div class="title-num-item">
                <span>合同签订地 :</span>
                <span>江苏省徐州市</span>
              </div>
              <div class="title-num-item">
                <span>合同编号 :</span>
                <span>{{ detail.contractNum }}</span>
              </div>
            </div>
          </div>
          <div class="main-content-wrap">
            <div class="content-p">
              甲、乙双方经过友好协商，依据《中华人民共和国民法典》，本着相互信任，真诚合作的原则，就乙方向甲方提供货物达成以下协议，双方共同遵守。
            </div>
            <div class="content-p">一、合同标的、价格：</div>
            <a-table
              class="productTab"
              :columns="productColumns"
              :dataSource="detail.orderList || []"
              :pagination="false"
              bordered
            >
              <div slot="order" slot-scope="text, record, index">
                {{ index + 1 }}
              </div>
              <div slot="materialName" slot-scope="text, record, index">
                <span>{{ `${record.materialName}(${record.materialCode})` }}</span>
              </div>
              <div slot="materialRate" slot-scope="text, record, index">
                <span>{{ detail.materialRate }}%</span>
              </div>

              <template slot="footer" slot-scope="currentPageData">
                <span>合计：（人民币）{{ calInfo.totalUpper }} </span>
                <span style="margin:0 10px;">({{ calInfo.total | moneyFormatNumber }})</span>
                <span>此价格含税、含运费。</span>
              </template>
            </a-table>

            <div class="content-p">二、付款方式</div>
            <div class="content-p p-text-index">
              2.1.货款结算方式：现款现货/账期结算
            </div>
            <div class="content-p p-text-index">
              <div>2.2支付期限：一次性支付/分期支付</div>
              <div style="margin-left:20px;">
                <div>
                  全&nbsp;&nbsp;款应付金额:
                  <span class="span-underline">{{ calInfo.total | moneyFormatNumber }}</span>
                  &nbsp;&nbsp; 付款周期:<span class="span-underline">{{ detail.paymentCycle }}天</span>
                </div>
                <div v-for="item in detail.settlementList">
                  {{ { 1: '预付款', 2: '提货款', 3: '验收款', 4: '质保金' }[item.moneyType] }}应付金额:
                  <span class="span-underline">{{ item.percentageMoeny | moneyFormatNumber }}</span>
                  &nbsp;&nbsp;付款周期:<span class="span-underline">{{ item.paymentDate }}</span>
                </div>
              </div>
              <div>经双方约定，货款结算方式为固定账期结算，详见双方签订的战略合作协议条款。</div>
            </div>

            <div class="content-p">三、技术标准约定</div>
            <div class="content-p p-text-index">
              <div v-for="(item, idx) in detail.orderList" :key="idx">
                <div>{{ idx + 1 }}.{{ item.materialName }}({{ item.materialCode }})</div>
                <div>对应检验标准字段(目前尚未实现)</div>
              </div>
            </div>

            <div class="content-p">四、产品交付</div>
            <div class="content-p p-text-index">
              <div>详细地址： 江苏省徐州市铜山区张集轻工业产业园江苏万德福公共设施科技股份有限公司</div>
              <div>联系人姓名： {{ detail.purchaseUserName }}</div>
              <div>联系人电话： {{ detail.purchasePhone }}</div>
            </div>

            <div class="content-p">五、运输方式及到达（港）站和费用承担</div>
            <div class="content-p p-text-index">
              <div>
                5.1 运输方式：<span class="span-underline">
                  {{ { 0: '代办运输', 1: '自提' }[detail.transportType] }}</span
                >
              </div>
              <div>
                5.2 如甲方自提货物，乙方负责将货物装入甲方委派车辆，如装货过程中，出现一切损失，将由乙方全部承担。
              </div>
              <div>
                5.3
                乙方为甲方代办托运时，运输费用由甲方承担，乙方负责运输货物的装卸相关事宜。乙方货物从仓库配送出库后，在运输途中发生的一切安全、短少、变更路线等问题，由乙方负责。
              </div>
            </div>

            <div class="content-p">六、质保期限及要求</div>
            <div class="content-p p-text-index">
              6.1产品质保期
            </div>
            <a-table
              class="productTab"
              :columns="pointColumns"
              :dataSource="detail.orderList || []"
              :pagination="false"
              bordered
            >
              <div slot="order" slot-scope="text, record, index">
                {{ index + 1 }}
              </div>
              <div slot="materialName" slot-scope="text, record, index">
                <span>{{ `${record.materialName}(${record.materialCode})` }}</span>
              </div>
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
              8.1如甲方逾期支付货款，每逾期一日则按照未付金额的
              <span class="span-underline">{{ detail.otherAppoint.unpaidFalsify }}% </span>
              支付违约金，但违约金总额不得超过合同总价款的
              <span class="span-underline">{{ detail.otherAppoint.fullAmount }}%</span>
              。因乙方产品质量问题和延期交货等原因导致甲方逾期付款的甲方不承担任何违约责任。
            </div>
            <div class="content-p p-text-index">
              8.2如乙方逾期交货，每逾期一日则按照合同总价款的
              <span class="span-underline">{{ detail.otherAppoint.breachContract }}%</span>
              支付违约金并赔偿因此给甲方造成的一切损失。（直接损失和间接损失）
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
              <span class="span-underline">{{ { 1: '甲', 2: '乙' }[detail.otherAppoint.disputeSolveType] }}方 </span>
              所在地人民法院提起诉讼。
            </div>

            <div class="content-p">十一、签订方式</div>
            <div class="content-p p-text-index">
              11.1此协议通过 微信/邮箱
              <span class="span-underline">
                （甲方邮箱账号({{ detail.otherAppoint.nailEmail }})/微信号({{ detail.otherAppoint.nailWeChat }})
                、乙方邮箱账号({{ detail.otherAppoint.secondEmail }})/微信号({{ detail.otherAppoint.secondWeChat }})
                ）</span
              >
              传输的方式签订，乙方签字盖章后将合同通过快递的方式邮寄给甲方合同自双方签字盖章确认后生效，合同的附件享有同等法律效力。
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
            <div class="content-p p-text-index">13.1 {{ detail.otherAppointStr }}</div>

            <div class="content-p">（以下无正文）</div>

            <div class="card-wrap clearfix">
              <div class="card">
                <p class="card-tit">供方（甲方）</p>
                <p style="position: relative;">
                  供方单位（盖章）：
                  <img
                    v-if="+detail.freshChapterType === 0"
                    style="position: absolute;width: 140px;left: 35%;top: -50%;"
                    :src="detail.commonSeal"
                    alt="公章"
                  />
                </p>
                <p>
                  供方代表签字：
                  <img
                    style="height: 50px;width: auto;vertical-align: middle;"
                    :src="detail.purchaseUserSeal"
                    alt="采购人员章"
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
                <!-- <p>需方单位（盖章）：</p> -->
                <p>需方代表签字：</p>
                <p>
                  地址：
                  <span class="span-paddings">{{ detail.secondPartyInfo.address }}</span>
                </p>
                <p>
                  电话/传真：
                  <span class="span-paddings">{{ detail.secondPartyInfo.phone }}</span>
                </p>
                <p>
                  邮政编码：
                  <span class="span-paddings">{{ detail.secondPartyInfo.postalCode }}</span>
                </p>
                <p>
                  银行账户名称：
                  <span class="span-paddings">{{ detail.secondPartyInfo.cardName }}</span>
                </p>
                <p>
                  银行账户：
                  <span class="span-paddings">{{ detail.secondPartyInfo.cardNumber }}</span>
                </p>
                <p>
                  开户行：
                  <span class="span-paddings">{{ detail.secondPartyInfo.bankName }}</span>
                </p>
                <p>
                  税号：
                  <span class="span-paddings">{{ detail.secondPartyInfo.taxpayerNumber }}</span>
                </p>
                <p>
                  微信号：
                  <span class="span-paddings">{{ detail.secondPartyInfo.weChat }}</span>
                </p>
                <p>
                  电子邮箱：
                  <span class="span-paddings">{{ detail.secondPartyInfo.supplierEmail }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
//数字转大写接口
import { turnTheCapital } from '@/api/contractListManagement'
import { purchaseContractDetail } from '@/api/procurementModuleManagement'
import util from '@/components/_util/util'

import moment from 'moment'

/**
 * TODO
 * 1.详情接口 需要返回 saleUserSeal - (供方代表签字-销售人员章)
 * 2.详情接口 需要返回 commonSeal - 供方单位（盖章）
 * 3.新增合同 接口成功后需要返回 合同ID
 */
const productColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 80
  },
  {
    title: '名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '品牌',
    dataIndex: 'model'
  },
  {
    title: '型号',
    dataIndex: 'specification'
  },
  {
    title: '单位',
    dataIndex: 'subUnit'
  },
  {
    title: '数量',
    dataIndex: 'purchaseNum'
  },
  {
    title: '单价',
    dataIndex: 'newPrice'
  },
  {
    title: '税率',
    dataIndex: 'materialRate',
    scopedSlots: { customRender: 'materialRate' }
  },
  {
    title: '小计',
    dataIndex: 'amountText'
  }
]

const pointColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 80
  },
  {
    title: '货物编号',
    dataIndex: 'requestApplyNum'
  },
  {
    title: '名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '质保期限(天)',
    dataIndex: 'shelfLife'
  },
  {
    title: '交货日期',
    dataIndex: 'preDeliveryCycle'
  }
]

export default {
  name: 'previewContract',
  components: {},
  props: {
    contractId: {
      type: [Number, String],
      default: () => null
    },
    from: {
      type: [String],
      default: () => 'procurement-module-management-purchase-contract'
    }
  },
  data() {
    return {
      loading: false,
      productColumns,
      pointColumns,
      enterpriseName: '江苏万德福公共设施科技有限公司',
      enterpriseNameEnglish: 'JiangSu Wonderful Infrastructure Manufacturing co.,Ltd',
      contractTitle: '采购合同',
      supplier: '江苏万德福公共设施科技有限公司', // 供方（甲方）
      detail: {
        orderList: [],
        settlementList: [],
        secondPartyInfo: {},
        otherAppoint: {}
      },
      calInfo: {}
    }
  },
  computed: {
    isCurrentDay() {
      let m1 = String(this.createTime)
      let m2 = moment().format('YYYY-MM-DD')
      return m1 === m2
    },
    billingTypeSTR() {
      return parseInt(this.billingType) === 1 ? '增票' : '普票'
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        if (to.name === 'procurement-module-management-purchase-contract-preview') {
          console.log('previewContract $route called...')
          this.init()
        }
      }
    }
  },
  methods: {
    async init() {
      let that = this
      that.spinning = true
      purchaseContractDetail({ id: that.contractId })
        .then(res => res.data)
        .then(result_detail => {
          if (result_detail) {
            result_detail.orderList = that.$_.cloneDeep(result_detail.contractOrderDetailVos || [])
            result_detail.settlementList = that.$_.cloneDeep(result_detail.contractSettlementDetailVos || [])
            result_detail.secondPartyInfo = that.$_.cloneDeep(result_detail.contractSecondPartyInfoDetailVo || [])
            result_detail.otherAppoint = that.$_.cloneDeep(result_detail.contractOtherAppointDetailVo || [])

            delete result_detail.contractOrderDetailVos
            delete result_detail.contractSettlementDetailVos
            delete result_detail.contractSecondPartyInfoDetailVo
            delete result_detail.contractOtherAppointDetailVo

            result_detail.orderList = result_detail.orderList.map(o => {
              let obj = { ...o }
              obj.key = that._uuid()
              obj.amountText = that.$root._f('moneyFormatNumber')(obj.amount)
              obj.preDeliveryCycle = moment(obj.requestTime)
                .add('days', obj.deliveryCycle)
                .format('YYYY-MM-DD')
              obj.preShelfLife = moment(obj.requestTime)
                .add('days', obj.shelfLife)
                .format('YYYY-MM-DD')
              return obj
            })

            that.detail = { ...result_detail }

            that.$nextTick(async () => {
              await that.calc()
              let settlementList = [...that.detail.settlementList]
              settlementList = settlementList.map(item => {
                item.percentageMoeny = that.$root._f('moneyFormatNumber')(
                  (that.calInfo.total * (item.percentage || 0)) / 100
                )
                return item
              })
              that.detail = {
                ...that.detail,
                settlementList
              }
            })
          }
        })
        .catch(err => {
          that.$message.info(err.message)
        })
        .finally(() => {
          that.spinning = false
        })
    },
    // 返回
    goBackConstractList() {
      // 点击返回，返回合同列表页
      this.$router.push({ name: this.from })
    },
    getPDF() {
      util.handleWindowPrint('#pdfDom', '采购合同')
    },
    async calc() {
      const that = this
      let { taxType, freightType, freightRate, materialRate, freightFullAmount, orderList } = that.detail

      let _freightRate = freightRate || 0
      let _materialRate = materialRate || 0
      let _freightFullAmount = freightFullAmount || 0
      const hasTax = +taxType === 1
      const hasFreight = +freightType === 1

      let new_freightRate = hasFreight ? _freightRate : 0
      let new_materialRate = hasTax ? _materialRate : 0

      let materialAmount = 0
      orderList.map(o => {
        materialAmount += o.amount || 0
        return o
      })

      let calInfo = {
        freightFullAmount: _freightFullAmount,
        freightFullAmountWithTax: _freightFullAmount + _freightFullAmount * (new_freightRate / 100),
        freightTaxAmount: _freightFullAmount * (new_freightRate / 100),
        materialFullAmount: materialAmount,
        materialFullAmountWithTax: materialAmount + materialAmount * (new_materialRate / 100),
        materialTaxAmount: materialAmount * (new_materialRate / 100),
        hasTax,
        hasFreight,
        freightRate: _freightRate,
        new_freightRate,
        materialRate: _materialRate,
        new_materialRate
      }
      let total = calInfo.freightFullAmountWithTax + calInfo.materialFullAmountWithTax
      let totalUpper = await turnTheCapital({ money: total }).then(res => res.data)
      calInfo = {
        ...calInfo,
        total,
        totalUpper
      }
      that.calInfo = calInfo
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

#pdfDom >>> .red-flag {
  color: red !important;
}
</style>
