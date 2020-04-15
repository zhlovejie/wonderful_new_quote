<template>
  <a-modal
    title="验收报告"
    :width="940"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <div style="width:80%;height:80%;margin: 16px auto;">
      <img style="width:100%;height:100%" :src="reportUrl" />
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'Preview',
  data () {
    return {
      visible: false,
      reportUrl: ''
    }
  },
  methods: {
    show (reportUrl) {
      this.visible = true
      this.reportUrl = reportUrl
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
