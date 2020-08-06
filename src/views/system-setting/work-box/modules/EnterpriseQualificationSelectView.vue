<template>
  <div class="product-config-wrapper" style="width:100%;">
      <table class="custom-table custom-table-border" v-if="dataSource.length > 0">
        <tr>
          <td>序号</td>
          <td>名称</td>
          <td>图片</td>
          <td>选项</td>
        </tr>
        <tr v-for="(item,idx) in dataSource" :key="item.key">
          <td style="width:150px;">{{idx + 1}}</td>
          <td>
            {{item.qualificationName}}
          </td>
          <td>
            <img :src="item.qualificationPicture" style="height:70px;" alt="资质图片">
          </td>
          <td>
            <a href="javascript:void(0);" @click="doAction('del',item.key)">删除</a>
          </td>
        </tr>
      </table>
  </div>
</template>

<script>
let uuid = () => Math.random().toString(32).slice(-10)
export default {
  name:'EnterpriseQualificationSelectView',
  props:{
    qualificationList:{
      type:Array,
      default:() => []
    }
  },
  data(){
    return {
      dataSource:[]
    }
  },
  created(){
    this.dataSource = this.qualificationList.map(item =>{
      return Object.assign({},item,{key:uuid()})
    })
  },
  watch:{
    qualificationList(newVal){
      if(!Array.isArray(newVal)){
        return
      }
      this.dataSource = newVal.map(item =>{
        return Object.assign({},item,{key:uuid()})
      })
    }
  },
  methods:{
    doAction(type,key){
      if(type === 'del'){
        this.dataSource = this.dataSource.filter(item => item.key !== key)
        this.$emit('change', [...this.dataSource])
      }
    }
  }
}
</script>