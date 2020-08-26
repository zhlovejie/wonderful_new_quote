<template>
  <a-modal
    title="预览"
    :width="860"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <a-spin :spinning="spinning">
      <iframe :src="xdocUrl" width="100%" height="600" frameborder="0"></iframe>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: 'XdocView',
  data() {
    return {
      visible: false,
      spinning: false,
      xdocUrl: '',
    }
  },
  methods: {
    handleOk() {
      this.handleCancel()
    },
    handleCancel() {
      this.visible = false
    },
    query(xdocUrl) {
      let that = this
      that.xdocUrl = ''
      if (!xdocUrl) {
        that.$message.info('文件路径不正确')
        return
      }
      let isImage = false
      let suffixName = ''
      try {
        suffixName = xdocUrl.slice(xdocUrl.lastIndexOf('.'))
      } catch (err) {
        suffixName = ''
      }
      if (suffixName === '.jpg' || suffixName === '.jpeg' || suffixName === '.png' || suffixName === '.gif') {
        isImage = true
      }

      if (isImage) {
        that.xdocUrl = xdocUrl
        that.visible = true
        that.spinning = true
        setTimeout(() => {
          that.spinning = false
        }, 2000)
      } else {
        //方式一 微软在线预览 http://view.officeapps.live.com/op/view.aspx?src=
        //方式二 国内xdocin在线预览  http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc=
        //优先使用 方式一 功能更强大
        let baseUrl = 'http://view.officeapps.live.com/op/view.aspx?src='
        //let baseUrl = 'http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc='
        this.xdocUrl = baseUrl + encodeURIComponent(xdocUrl)
        this.visible = true
        this.spinning = true
        setTimeout(() => {
          this.spinning = false
        }, 2000)
      }
    },
  },
}
</script>

<style scoped>
</style>