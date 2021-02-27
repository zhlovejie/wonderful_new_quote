<template>
  <a-modal title="查看" :width="750" :visible="visible" @ok="handleOk" @cancel="handleCancel" :maskClosable="false">
    <a-spin :spinning="spinning">
      <div class="severance-agreement-wrapper">
        <h2 class="title">
          离职协议
          <a-button class="action-button" type="primary" icon="download" @click="downFileAction">下载</a-button>
        </h2>
        <a-row>
          <a-col :span="24">
            <p>甲方：江苏万德福公共设施科技有限公司</p>
            <p>
              乙方：<span class="under-line">{{ userName }}</span
              >(身份证号：<span class="under-line">{{ identityCard }}</span
              >)
            </p>
            <p class="txt-indent2">
              乙方因个人原因于<span class="under-line">{{ createdTime }}</span
              >主动向甲方提出离职申请，甲方经研究后批准乙方离职请求。甲方考虑乙方在离职期间的工作表现以及乙方目前的生活状况，甲方决定给予乙方离职后生活补贴：人民币<span
                class="under-line"
                >{{ bigCompensation }}</span
              >（小写<span class="under-line">{{ compensation | moneyFormatNumber }}</span
              >元）
            </p>
            <p>此补偿金分三次支付：</p>
            <p>
              在<span class="under-line">{{ firstDate }}</span
              >前支付<span class="under-line">{{ firstAmount | moneyFormatNumber }}</span
              >元
            </p>
            <p>
              在<span class="under-line">{{ secondDate }}</span
              >前支付<span class="under-line">{{ secondAmount | moneyFormatNumber }}</span
              >元
            </p>
            <p>
              在<span class="under-line">{{ thirdDate }}</span
              >前支付<span class="under-line">{{ thirdAmount | moneyFormatNumber }}</span
              >元
            </p>

            <p>
              乙方承诺：<br />
              1.
              离职后不向任何第三方透露万德福公司的相关信息，将万德福所有业务如实交接并形成书面交接记录，离职后如接到相关客户需求转交公司处理接洽，不再参与万德福任何业务对接，与万德福公司无任何劳务及补偿纠纷。
              <br />
              2.若违反上述承诺，经万德福公司确认属实的，公司有权向离职人提出补贴金额五倍的违约金，并追究其相应的法律责任。
            </p>
            <p class="txt-indent2"></p>
            <p>
              <a-row>
                <a-col :span="6">乙方签字：</a-col>
                <a-col :span="6"></a-col>
                <a-col :span="6">甲方签字：</a-col>
                <a-col :span="6"></a-col>
              </a-row>
            </p>
            <p>
              <a-row>
                <a-col :span="6">乙方签字：</a-col>
                <a-col :span="6"></a-col>
                <a-col :span="6">甲方签字：</a-col>
                <a-col :span="6"></a-col>
              </a-row>
            </p>
            <p class="txt-r">江苏万德福公共设施科技有限公司</p>
            <p class="txt-r">_________年____月____日</p>
          </a-col>
        </a-row>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { getLeaveOfficeAgreement } from '@/api/personnelManagement'
export default {
  name: 'ViewForm',
  data() {
    return {
      visible: false,
      spinning: false,
      actionType: 'view',
      record: {},
      userName: '',
      identityCard: '',
      firstDate: '',
      firstAmount: 0,
      secondDate: '',
      secondAmount: 0,
      thirdDate: '',
      thirdAmount: 0,
      compensation: '0',
      bigCompensation: '零',
      createdTime: '',
    }
  },
  methods: {
    moment: moment,
    query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.visible = true

      //填充数据
      getLeaveOfficeAgreement({ id: that.record.id }).then((res) => {
        console.log(res)
        let data = res.data
        that.userName = data.userName
        that.identityCard = data.identityCard
        that.firstDate = that.moment(data.firstDate).format('YYYY年MM月DD日')
        that.firstAmount = data.firstAmount
        that.secondDate = that.moment(data.secondDate).format('YYYY年MM月DD日')
        that.secondAmount = data.secondAmount
        that.thirdDate = that.moment(data.thirdDate).format('YYYY年MM月DD日')
        that.thirdAmount = data.thirdAmount
        that.compensation = data.compensation
        that.bigCompensation = data.bigCompensation
        that.createdTime = that.moment(data.createdTime).format('YYYY年MM月DD日')
        // data.firstDate = that.moment(data.firstDate)
        // data.secondDate = that.moment(data.secondDate)
        // data.thirdDate = that.moment(data.thirdDate)

        //that.$nextTick(() => that.form.setFieldsValue(data))
      })
    },
    handleOk() {
      this.handleCancel()
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    downFileAction() {
      let that = this
      if (that.record.wordUrl) {
        let eleA = document.createElement('a')
        eleA.href = that.record.wordUrl
        eleA.target = '_blank'
        eleA.style = 'display:none;'
        document.body.appendChild(eleA)
        eleA.click()
        document.body.removeChild(eleA)
        //window.location.href = that.record.wordUrl
      } else {
        that.$message.info('请稍等！正在生成离职协议单。')
        return
      }
    },
    // downFileAction() {
    //   let that = this
    //   if (that.record.wordUrl) {
    //     window.location.href = that.record.wordUrl
    //   } else {
    //     that.$message.info('下载地址有误')
    //   }
    // },
  },
}
</script>

<style scoped>
.title {
  position: relative;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
}
.title .action-button {
  position: absolute;
  right: 0;
}
.txt-indent2 {
  text-indent: 2em;
}
.txt-r {
  text-align: right;
}
.under-line {
  padding: 0 7px;
  border-bottom: 1px solid #444;
}
</style>