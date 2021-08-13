<template>
  <div class="adjust-apply-list-wrapper">
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="基本信息" key="0"> <Step1 ref="step1" /> </a-tab-pane>
        <a-tab-pane tab="物料采购要求" key="1"><Step2 ref="step2" /> </a-tab-pane>
        <a-tab-pane tab="物料采购记录" key="2"> <Step3 ref="step3" /></a-tab-pane>
        <a-tab-pane tab="物料采购信息" key="3"> </a-tab-pane>
        <a-tab-pane tab="物料供应商" key="4"> </a-tab-pane>

        <a-button @click="goback" slot="tabBarExtraContent"> 返回 </a-button>
      </a-tabs>
    </div>
  </div>
</template>
<script>
// import Step1 from './step1'
import Step1 from './material1'
import Step2 from './material2'
import Step3 from './material3'
// import Step4 from './step4'
// import Step5 from './step5'
// import Step6 from './step6'

export default {
  name: 'NoticeList',
  components: {
    // Step1,
    Step1,
    Step2,
    Step3,
    // Step4,
    // Step5,
    // Step6,
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
        if (to.name === 'material-rule-details' && this.$route.params.id !== undefined) {
          let that = this
          that.record = this.$route.params
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
        this.$refs.step1.query('view', this.record)
      })
    },
    goback() {
      this.$router.go(-1)
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (tagKey === '0') {
        this.$refs.step1.query('view', this.record)
      }
      if (tagKey === '1') {
        this.$nextTick(() => {
          this.$refs.step2.query(this.record)
        })
      }
      if (tagKey === '2') {
        this.$nextTick(() => {
          this.$refs.step3.init(this.record)
        })
      }
      if (tagKey === '3') {
        this.$nextTick(() => {
          // this.$refs.step4.init(this.record)
        })
      }
      if (tagKey === '4') {
        this.$nextTick(() => {
          // this.$refs.step5.init(this.record)
        })
      }
      if (tagKey === '5') {
        this.$nextTick(() => {
          // this.$refs.step6.init(this.record)
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
