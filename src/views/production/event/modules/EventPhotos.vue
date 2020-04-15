<template>
  <a-modal
    title="故障图片"
    :width="1000"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
  >
    <template v-for="photo in photos">
      <img style="width: 100%;" :src="photo"/>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'EventPhotos',
  data () {
    return {
      visible: false,
      photos: []
    }
  },
  methods: {
    show (photos) {
      this.photos = photos.split(',')
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
