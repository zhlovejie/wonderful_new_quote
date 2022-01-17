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
        <a-col :span="24" >
          <ol>
            <li v-for="(url,idx) in imgUrlList" :key="idx" class="img-item">
              <a alt="图片" :href="url" target="_blank" >{{ getFileName(url) }}</a>
            </li>
          </ol>
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
  width: 100%;
  word-break: break-all;
  margin-bottom: 10px;
}
.img-item >>> img{
  width: auto;
}
</style>
