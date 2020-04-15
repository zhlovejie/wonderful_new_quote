<template>
  <script :id="randomId" type="text/plain"></script>
</template>

<script>
export default {
  name: 'Ue',
  data () {
    return {
      editor: null,
      randomId: 'editor_' + (Math.random() * 10)
    }
  },
  props: {
    defaultMsg: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: {}
    }
  },
  mounted () {
    const _this = this
    this.editor = UE.getEditor(this.randomId, this.config) // 初始化UE
    this.editor.addListener('ready', function () {
      _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
    })
  },
  methods: {
    getUEContent () { // 获取内容方法
      return this.editor.getContent()
    },
    getUEContentTxt () { // 获取内容方法
      return this.editor.getContentTxt()
    },
    destroyed () {
      this.editor.destroy()
    }
  }
}
</script>

<style scoped>

</style>
