<template>
  <a-modal 
    :width="800"
    :visible="previewVisible" 
    :footer="null" 
    @cancel="() => previewVisible = false"
  >
    <img alt="图片" style="width: auto;max-width:750px" :src="imgUrl" />
  </a-modal>
</template>

<script>
export default {
  name:'imgView',
  data(){
    return {
      previewVisible:false,
      imgUrl:''
    }
  },
  methods:{
    show(url){
      this.previewVisible = true
      this.imgUrl = url
    }
  }
}
</script>