<template>
  <a-modal
    :title="$attrs.title || '预览图片'"
    :width="800"
    :visible="previewVisible"
    :footer="null"
    @cancel="() => previewVisible = false"
  >
    <div class="img-list">
      <a-row :gutter="16">
        <a-col :span="24" v-for="(url,idx) in imgUrlList" :key="idx">
          <a alt="图片" class="img-item" :href="url" target="_blank" >{{ getFileName(url) }}</a>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
export default {
  name:'fileViewList',

  data(){
    return {
      previewVisible:false,
      imgUrlList:[]
    }
  },
  methods:{
    show(imgUrlList){
      this.previewVisible = true
      this.imgUrlList = [...imgUrlList || []]
    },
    getFileName(url){
      let arr = String(url).split('/')
      return arr[arr.length - 1]
    }
  }
}
</script>

<style scoped>
.img-item{
  width: auto;
  max-width: 200px;
  box-shadow: 0 0 6px 3px #ddd;
  border-radius: 3px;
  padding: 5px;
}
</style>
