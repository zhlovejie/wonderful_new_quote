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
        <a-col :span="8" v-for="(url,idx) in imgUrlList" :key="idx">
          <img alt="图片" class="img-item" :src="url" @click="imgClick(url)" />
        </a-col>
      </a-row>
    </div>
    <ImgView ref="imgView" />
  </a-modal>
</template>

<script>
import ImgView from '@/components/CustomerList/ImgView'
export default {
  name:'imgViewList',
  components:{ImgView},
  data(){
    return {
      previewVisible:false,
      imgUrlList:[]
    }
  },
  methods:{
    imgClick(url){
      this.$refs.imgView.show(url)
    },
    show(imgUrlList){
      this.previewVisible = true
      this.imgUrlList = [...imgUrlList || []]
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
