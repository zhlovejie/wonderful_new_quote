<template>
  <div class="adjust-apply-list-wrapper">
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" @change="tabChange">
        <a-tab-pane tab="物料采购要求" key="1"><Step2 ref="step2" /> </a-tab-pane>
        <a-tab-pane tab="物料采购记录" key="2"> <Step3 ref="step3" /></a-tab-pane>
        <a-tab-pane tab="物料采购信息" key="3"><Step4 ref="step4" /> </a-tab-pane>
        <a-tab-pane tab="物料供应商" key="4"><Step5 ref="step5" /> </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import Step2 from './material2'
import Step3 from './material3'
import Step4 from './material4'
import Step5 from './material5'

export default {
  name: 'NoticeList',
  components: {
    Step2,
    Step3,
    Step4,
    Step5,
  },
  inject: ['normalAddForm'],
  //   provide() {
  //     return {
  //       normalAddForm: this,
  //     }
  //   },
  data() {
    return {
      visible: false,
      activeKey: 1,
      record: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
    }
  },
  computed: {},

  methods: {
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      //   if (tagKey === '0') {
      //     this.$refs.step1.query('view', this.record)
      //   }
      if (tagKey === '1') {
        this.$nextTick(() => {
          this.$refs.step2.query(this.normalAddForm.record)
        })
      }
      if (tagKey === '2') {
        this.$nextTick(() => {
          this.$refs.step3.init(this.normalAddForm.record)
        })
      }
      if (tagKey === '3') {
        this.$nextTick(() => {
          this.$refs.step4.init(this.normalAddForm.record)
        })
      }
      if (tagKey === '4') {
        this.$nextTick(() => {
          this.$refs.step5.init(this.normalAddForm.record)
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

