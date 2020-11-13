<template>
  <div class="fast-path-wrapper">
    <a-row :gutter="24">
      <a-col :span="4" v-for="item in dataSource" :key="item.key">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{item.title}}</span>
          </template>
          <div class="fast-path-item " @click="doAction('view',item)">
            {{item.title.slice(0,4)}}
            <span class="fast-path-item-option" title="删除" @click.stop="doAction('del',item)">
              <a-icon type="minus" />
            </span>
          </div>
        </a-tooltip>
      </a-col>
      <a-col :span="4">
        <div class="fast-path-item fast-path-item-add" title="添加快速通道" @click="doAction('add',null)">
          <a-icon type="plus" />
        </div>
      </a-col>
    </a-row>
    <FastPath ref="fastPath" @change="fastPathChange"/>
  </div>
</template>
<script>
import FastPath from './FastPath'
export default {
  name:'FastPathView',
  components:{
    FastPath
  },
  data(){
    return {
      dataSource:[]
    }
  },
  watch:{
    dataSource(newVal){
      this.$ls.set('FAST_PATH_ROUTERS',[...newVal])
    }
  },
  created(){
    this.init()
  },
  methods:{
    init(){
      this.dataSource = this.$ls.get('FAST_PATH_ROUTERS',[])
    },
    doAction(type,item){
      if(type === 'add'){
        let _vals = this.dataSource.map(v => v.key)
        this.$refs.fastPath.query(_vals)
        return
      }
      if(type === 'del'){
        this.dataSource = this.dataSource.filter(_item => _item.key !== item.key)
        return
      }
      if(type === 'view'){
        //console.log(`${item.title} - 跳转路由 - ${item.routeName}`)
        this.$router.push({ name: item.routeName })
        return
      }
    },
    fastPathChange(items){
      this.dataSource = [...(items || [])]
    }
  }
}
</script>

<style scoped>
.fast-path-wrapper{
  margin-top: -10px;
}
.fast-path-wrapper .fast-path-item{
  transition: all .2s linear;
  position: relative;
  display: inline-block;
  font-size: 14px;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  background: #ebe9ff;
  padding: 10px;
  border: 1px solid #9b92ff;
  margin-top: 10px;
  cursor: pointer;
}
.fast-path-wrapper .fast-path-item:hover{
  transform: scale(1.1);
}

.fast-path-wrapper .fast-path-item-add{
  background-color: #efefef;
  border: 1px dashed #aaa;
  font-size: 36px;
  color: #aaa;
  cursor: pointer;
}

.fast-path-wrapper .fast-path-item .fast-path-item-option{
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: red;
  top: -5px;
  right: -5px;
  cursor: pointer;
  color: #fff;
}
</style>