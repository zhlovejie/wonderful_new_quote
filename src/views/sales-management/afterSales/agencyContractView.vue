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
        <a :href="detail.accessory" target="_blank" class="ant-btn ant-btn-primary fl-r">导出成PDF</a>
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
                <span>
                  <span class="span-underline"> {{ detail.customerName }} </span></span
                >
              </div>
            </div>
            <div class="contract-title-num">
              <div class="title-num-item">
                <span>合同编号 :</span>
                <span>{{ detail.contractNum }}</span>
              </div>
              <div class="title-num-item">
                <span>签订时间 :</span>
                <span :style="{ color: detail.signingDate !== moment().format('YYYY-MM-DD') ? 'red' : '' }">{{
                  detail.signingDate
                }}</span>
              </div>
            </div>
          </div>
          <div class="main-content-wrap">
            <div class="content-p">
            甲乙双方依照平等自愿、互利互惠原则，就甲方委托乙方进行产品售后服务事宜达成如下协议：
            </div>

            <div class="content-p">第一条：</div>
            <div class="content-p p-text-index">
              乙方承揽甲方产品售后日常维护以及辅助安装调试服务，所在<span class="span-underline">{{ detail.areaName }}</span>区域内的所有甲方产品，共需要维修费用人民币<span class="span-underline">{{ detail.maintenanceCost }}</span>元/年，合同期内如果甲方新增其它服务项目，服务费用按双方另行约定的标准进行计算。

            </div>
               <div class="content-p">第二条：服务具体要求</div>
            <div class="content-p p-text-index">
              2.1定期对产品进行巡查，不低于每天一次巡查。<br>
              2.2定期对产品进行清理保洁，不低于每周一次清理保洁。<br>
              2.3定期按照维保需求对产品进行维护保养，所需耗材乙方自理。<br>
                2.4乙方应尽快解决售后问题，维护甲方品牌形象。<br>
                2.5因特殊情况需要乙方紧急处理的售后问题，乙方应全力配合。<br>
            </div>
               <div class="content-p">第三条：合同有效期</div>
            <div class="content-p p-text-index">
          自 <span class="span-underline">{{ detail.effectiveStart }}</span>  至 <span class="span-underline">{{ detail.effectiveEnd }}</span>    。
            </div>
               <div class="content-p">第四条：结算方式</div>
            <div class="content-p p-text-index">
             4.1自合同签订之日起<span class="span-underline">{{ detail.startPayment }}</span> 日内，
             甲方向乙方指定账户内分<span class="span-underline">{{ detail.paymentCount }}</span> 次，
             每次支付人民币<span class="span-underline">{{ detail.paymentAmount }}</span>元，合计年服务费人民币<span class="span-underline">{{ detail.yearCost }}</span> 元。<br> 
              4.2售后服务费以汇款的方式打入乙方的公司账户内。（双方约定付款方式仅以公对公的方式）
            </div>
               <div class="content-p">第五条：双方权利义务</div>
            <div class="content-p p-text-index">
          5.1乙方应积极完成合同约定的售后服务内容，维护甲方权益。
              5.2甲方应按时向乙方支付相应的服务费用。
            5.3双方应忠实履行合同义务，为对方保守商业秘密。
            </div>

   <div class="content-p">第六条：违约责任</div>
            <div class="content-p p-text-index">
            6.1任何一方违反或擅自变更本协议的约定，应当承担由此给对方造成的经济损失和相关责任。<br>
6.2因执行本合同发生的一切争议，双方应首先友好协商解决。经协商不能解决，可向甲方所在地的人民法院提起诉讼。
            </div>

   <div class="content-p">第七条：其他事项</div>
            <div class="content-p p-text-index">
            7.1未经对方书面同意，甲乙任何一方不得将本合同部分或全部权利和义务转让给第三方，一切转让行为均为无效行为。<br>
7.2本协议经甲乙双方协商订立，未尽事宜由双方另行补充，本协议自双方签字盖章之日起生效。<br>
7.3本合同一式两份。甲乙双方各一份，两份合同具有同等法律效力<br>
            </div>
           
              <div class="card-wrap" style="overflow: hidden">
                <div class="card">
                  <p class="card-tit">甲方</p>
                   <p style="position: relative">
                    甲方（盖章）：
                    <imgand
                      v-if="detail.setCommonSeal"
                               style="position: absolute; width: 140px; left: 8%; top: -136%"
                      :src="detail.setCommonSeal"
                      alt="公章"
                    />
                  </p>
                      <p>
                    签名：
                    <img
                      v-if="detail.saleUserSeal"
                      style="height: 50px; width: auto; vertical-align: middle"
                      :src="detail.saleUserSeal"
                      alt="销售人员章"
                    />
                  </p>
                   <p>
                    日期<span class="span-paddings">{{ detail.signingDate }}</span>
                  </p>
                </div>
                <div class="card">
                  <p class="card-tit">乙方</p>
                  <p>
                      甲方（盖章）：<span class="span-paddings">{{ detail.customerName }}</span>
                  </p>
                  <p>
                   签名：
                  </p>
                  <p>
                    日期：
                  </p>
                  
                </div>
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
import { afterdetail, afteraddOrapprove } from '@/api/agencyContract'
import util from '@/components/_util/util'

import moment from 'moment'

export default {
  name: 'agencyContractView',
  components: {},
  props: {},
  data() {
    return {
      isPassBtn: false, // 通过不通过按钮的是否显示
      opinion: '', // 审批意见
      visible: false, // 审批弹出层是否可见
      loading: false,
      spinning: false,
      dialogTitle: '审批操作',
      enterpriseName: '江苏万德福公共设施科技有限公司',
      enterpriseNameEnglish: 'JiangSu Wonderful Infrastructure Manufacturing co.,Ltd',
      contractTitle: '售后服务外包协议',
      supplier: '江苏万德福公共设施科技有限公司', // 供方（甲方）
      detail: {},
      placeholder: '***',
      wordUrl: '',
      productCategoryList: [],
    }
  },
  computed: {},
  watch: {
    $route(to, from) {
      if (to.name === 'afterSalesView') {
        console.log('agencyContractView $route called...')
        this.init()
      }
    },
  },
  cerated() {},
  mounted() {
    this.init()
  },
  methods: {
    moment,
    async init() {
      let that = this
      that.spinning = true

      let routeParam = this.$router.currentRoute.params
      this.isPassBtn = routeParam.action === 'approval' ? true : false
      afterdetail({ id: routeParam.id })
        .then((res) => {
          let data = res.data
          if (data.products) {
            let arr = data.products.split(';')
            data.productsName = arr.length === 2 ? data.products.split(';')[1] : data.products
          }

          data.effectiveStart = moment(data.effectiveStart).format('YYYY年MM月DD日')
          data.effectiveEnd = moment(data.effectiveEnd).format('YYYY年MM月DD日')
          data.signingDate = data.signingDate.substr(0, 10)
          that.detail = data
        })
        .finally(() => {
          that.spinning = false
        })
    },
    // 返回
    goBackConstractList() {
      // 点击返回，返回合同列表页
      let that = this
      that.$nextTick(() => {
        let _from = that.$route.params.from || 'afterSalesList'
        that.$router.push({ name: _from })
      })
    },
    // 通过
    okPass() {
      this.spinning = true
      let that = this
      const params = {
        //contractId: that.$router.currentRoute.params.id,
        approveId: that.$router.currentRoute.params.id,
        isAdopt: 0,
        opinion: '',
      }
      //原流程
      afteraddOrapprove(params)
        .then((res) => {
          that.spinning = false
          //that.$router.go(-1)// 返回上一页
          if (+res.code === 200) {
            that.$router.go(-1) // 返回上一页
          } else {
            that.$message.info(res.msg)
          }
          // this.$router.push({name:'distributionContractList'})
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          that.spinning = false
        })
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
          approveId: that.$router.currentRoute.params.id,
          opinion: that.opinion,
          isAdopt: that.isAdopt,
        }
        //原流程
        afteraddOrapprove(params)
          .then((res) => {
            if (+res.code === 200) {
              that.$router.go(-1) // 返回上一页
            } else {
              that.$message.info(res.msg)
            }
          })
          .catch((error) => {
            console.error(error)
          })
          .finally(() => {
            that.spinning = false
          })
      }, 500)
    },
    getPDF() {
      util.handleWindowPrint('#pdfDom', '售后服务外包协议')
    },
    isEmpty(o) {
      if (typeof o === 'string') {
        o = o.trim()
      }
      return o === undefined || o === '' || o === null
    },
  },
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
  justify-content: space-around;
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
