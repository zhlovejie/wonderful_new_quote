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
      <iframe v-show="visibleIframe" :src="xdocUrl" width="100%" height="600" frameborder="0"></iframe>
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
      visibleIframe: false
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
      that.visibleIframe = false
      that.xdocUrl = ''
      if (!xdocUrl) {
        that.$message.info('文件路径不正确')
        return
      }

      let fileType = (url, type) => {
        let m = {
          doc: ['.doc', '.docx', '.xls', '.xlsx'],
          img: ['.png', '.jpg', '.jpeg', '.gif'],
          pdf: ['.pdf', '.txt']
        }
        return !!m[type].find(v => String(url).endsWith(v))
      }

      if (fileType(xdocUrl, 'img') || fileType(xdocUrl, 'pdf')) {
        that.xdocUrl = String(xdocUrl)
        that.visible = true
        that.spinning = true
        that.visibleIframe = true
        setTimeout(() => {
          that.spinning = false
        }, 2000)
      } else if (fileType(xdocUrl, 'doc')) {
        //方式一 微软在线预览 http://view.officeapps.live.com/op/view.aspx?src=
        //方式二 国内xdocin在线预览  http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc=
        //优先使用 方式一 功能更强大
        let baseUrl = 'http://view.officeapps.live.com/op/view.aspx?src='
        //let baseUrl = 'http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc='
        this.xdocUrl = baseUrl + encodeURIComponent(String(xdocUrl))
        this.visible = true
        this.spinning = true
        that.visibleIframe = true
        setTimeout(() => {
          this.spinning = false
        }, 2000)
      } else {
        that.xdocUrl = String(xdocUrl)
        that.visibleIframe = false
        that.visible = true
        that.spinning = true
        that.$message.info('不支持预览的文件格式')
        setTimeout(() => {
          that.spinning = false
          that.handleCancel()
        }, 2000)
      }
    }
  }
}
</script>

<style scoped>
</style>