<template>
  <a-modal
    title="合同照片"
    :width="940"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <div style="width:80%;height:80%;margin: 16px auto;">
      <img style="width:100%;height:100%" :src="photoUrl" />
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'PhotoView',
  data () {
    return {
      visible: false,
      photoUrl: ''
    }
  },
  methods: {
    show (photoUrl) {
      this.visible = true
      this.photoUrl = photoUrl
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
