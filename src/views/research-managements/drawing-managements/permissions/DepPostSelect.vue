<template>
  <!--部门岗位级联 -->
  <div class="dep-user-select-wrapper">
    <a-form-item>
      <a-select 
        :disabled="disabled"
        style="width:150px;margin-right:10px;"
        placeholder="部门"
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
        placeholder="岗位" 
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
  watch:{
    userInfo(newVal,oldVal){
      if(newVal.depId && newVal.postId){
        this.$emit('change',newVal.depId,newVal.postId)
      }
    }
  },
  methods:{
    async init(){
      let that = this
      await that.initDepList()
      if(that.depId){
        await that.initPostList(that.depId)
      }
      
      that.userInfo = {
        depId:that.depId || undefined,
        postId: that.postId || undefined
      }
    },
    initDepList(){//部门  id,departmentName
      return departmentList().then(res => this.depList = res.data) 
    },
    initPostList(depId){ //岗位 id,stationName
      this.userInfo = {...this.userInfo,postId:undefined}
      if(!depId){
        this.postList = []
        return
      }
      return getStationList({ id: depId }).then(res => this.postList = res.data)
    },
    depChangeHandler(depId){
      this.postList = []
      this.initPostList(depId)
      this.userInfo = {...this.userInfo,depId}
    },
    postChangeHandler(postId){
      this.userInfo = {...this.userInfo,postId}
    }
  }
}
</script>

<style scoped>
.dep-user-select-wrapper{
  display: flex;
}
</style>