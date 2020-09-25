<template>
  <!--部门人员级联 -->
  <div class="dep-user-select-wrapper">
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
        placeholder="选择人员" 
        @change="userChangeHandler" 
        v-model="userInfo.userId"
      >
        <a-select-option
          v-for="item in userList"
          :key="item.id"
          :value="item.id"
        >{{item.trueName}}</a-select-option>
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
    userId:{
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
      userList:[],
      userInfo:{}
    }
  },
  mounted(){
    this.init()
  },
  watch:{
    depId(val){
      this.userInfo = {
        ...this.userInfo,
        depId:val || undefined,
      }
      this.init()
    },
    userId(val){
      this.userInfo = {
        ...this.userInfo,
        userId:val || undefined,
      }
      this.init()
    },
    userInfo(newVal,oldVal){
      if(newVal.depId && newVal.userId){
        let targetDep = this.depList.find(item => item.id === newVal.depId)
        let targetUser = this.userList.find(item => item.id === newVal.userId)
        this.$emit('change',newVal.depId,newVal.userId,targetDep,targetUser)
      }
    }
  },
  methods:{
    async init(){
      let that = this
      await that.initDepList()
      await that.initUserList(that.depId)

      that.userInfo = {
        depId:that.depId || undefined,
        userId: that.userId || undefined
      }
    },
    initDepList(){//部门  id,departmentName
      return departmentList().then(res => this.depList = res.data) 
    },
    initUserList(depId){ //人员 id,trueName
      this.userInfo = {...this.userInfo,userId:undefined}
      if(!depId){
        this.userList = []
        return
      }
      return getUserByDep({ departmentId: depId }).then(res => this.userList = res.data)
    },
    depChangeHandler(depId){
      this.userList = []
      this.initUserList(depId)
      this.userInfo = {...this.userInfo,depId}
    },
    userChangeHandler(userId){
      this.userInfo = {...this.userInfo,userId}
    }
  }
}
</script>

<style scoped>
.dep-user-select-wrapper{
  display: flex;
}
</style>