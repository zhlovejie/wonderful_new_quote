<template>
  <!--部门岗位级联 -->
  <div class="dep-post-select-wrapper">
    <a-form-item>
      <a-select 
        :disabled="disabled"
        style="width:150px;margin-right:10px;"
        placeholder="选择部门"
        @change="depChangeHandler"
        v-model="userInfo.depId"
      >
        <a-select-option 
        v-for="item in depList" 
        :key="item.id" 
        :value="item.id" 
        >{{item.departmentName}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-select
        :disabled="disabled"
        style="width:150px;"
        placeholder="选择岗位" 
        @change="postChangeHandler" 
        v-model="userInfo.postId"
      >
        <a-select-option
          v-for="item in postList"
          :key="item.id"
          :value="item.id"
        >{{item.stationName}}</a-select-option>
      </a-select>
    </a-form-item>
  </div>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'

export default {
  name:'',
  props:{
    depId:{
      type:[Number,String],
      default:undefined
    },
    postId:{
      type:[Number,String],
      default:undefined
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      depList:[],
      postList:[],
      userInfo:{}
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    async init(){
      let that = this
      await that.initDepList()
      await that.initPostList(that.depId)

      that.userInfo = {
        depId:that.depId || undefined,
        postId: that.postId || undefined
      }
    },
    initDepList(){//部门  id,departmentName
      return departmentList().then(res => this.depList = res.data) 
    },
    initPostList(depId){ //岗位 id,trueName
      if(!depId){
        this.postList = []
        this.userInfo.postId = undefined
        return
      }
      this.userInfo.postId = undefined
      return getStationList({ id: depId }).then(res => (this.postList = res.data))
    },
    depChangeHandler(depId){
      this.postList = []
      this.initPostList(depId)
    },
    postChangeHandler(userId){
      this.$emit('change',{
        depId:this.depId,
        postId:this.postId
      })
    }
  }
}
</script>

<style scoped>
.dep-post-select-wrapper{
  display: flex;
}
</style>