<template>
  <div class="adjust-apply-list-wrapper">
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="基本信息" key="0"> <Step1 ref="step1" /> </a-tab-pane>
        <a-tab-pane tab="报价记录（询价记录）" key="1"> <Step2 ref="step2" /> </a-tab-pane>
        <a-tab-pane tab="采购记录（交易额）" key="2"> <Step3 ref="step3" /></a-tab-pane>
        <a-tab-pane tab="收料记录（准时率）" key="3"><Step4 ref="step4" /></a-tab-pane>
        <a-tab-pane tab="质检记录（合格率）" key="4"><Step5 ref="step5" /></a-tab-pane>
        <a-tab-pane tab="付款记录" key="6"><Step6 ref="step6" /></a-tab-pane>
        <a-button @click="goback" slot="tabBarExtraContent"> 返回 </a-button>
      </a-tabs>
    </div>

    <!-- <AddForm ref="addForm" @finish="searchAction()" /> -->
  </div>
</template>
<script>
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import Step4 from './step4'
import Step5 from './step5'
import Step6 from './step6'
// import ApproveInfo from '@/components/CustomerList/ApproveInfo'

export default {
  name: 'NoticeList',
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Step6,
    // AddForm: AddForm,
    // ApproveInfo: ApproveInfo,
  },
  provide() {
    return {
      normalAddForm: this,
    }
  },
  data() {
    return {
      visible: false,
      activeKey: 0,
      record: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'Supplierdetails' && this.$route.params.id !== undefined) {
          let that = this
          that.record = this.$route.params.record
          that.init()
        } else {
          this.$router.go(-1)
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.$refs.step1.query(this.record)
      })
    },
    goback() {
      this.$router.go(-1)
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (tagKey === '0') {
        this.$refs.step1.query(this.record)
      }
      if (tagKey === '1') {
        this.$nextTick(() => {
          this.$refs.step2.init(this.record)
        })
      }
      if (tagKey === '2') {
        this.$nextTick(() => {
          this.$refs.step3.init(this.record)
        })
      }
      if (tagKey === '3') {
        this.$nextTick(() => {
          this.$refs.step4.init(this.record)
        })
      }
      if (tagKey === '4') {
        this.$nextTick(() => {
          this.$refs.step5.init(this.record)
        })
      }
      if (tagKey === '5') {
        this.$nextTick(() => {
          this.$refs.step6.init(this.record)
        })
      }
    },
  },
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.topName {
  top: 230px !important;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
