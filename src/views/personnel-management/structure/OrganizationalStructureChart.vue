<template>
  <div class="organization-wrapper">
    <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
      <a-tab-pane tab="部门架构图" key="0"/>
      <a-tab-pane tab="岗位架构图" key="1"/>
    </a-tabs>
    <a-spin :spinning="spinning">
    <div class="orgchart-container-list">
      <org-chart v-for="(item,index) in datasource" :key="index" :datasource="item">
        <template slot-scope="{ nodeData }">
          <a-popover :title="formatNodeData(nodeData)" trigger="hover">
            <template slot="content">
              <p>所属级别：{{nodeData.level}}</p>
            </template>
            <span class="node-item-txt" :style="{color:getLevelColor(nodeData.level)}" @click="selectNode(nodeData)">{{ nodeData.name }}</span>
          </a-popover>
        </template>
      </org-chart>
    </div>
    <div class="dep-user-count-wrapper" v-if="+activeKey === 0">
      <h3>各部门人数</h3>
      <div v-html="formatDepUserCount" />
    </div>
    </a-spin>
  </div>
</template>

<script>
import OrgChart from '@/components/Organization/OrganizationChartContainer'
import {
  getDepStructure,
  getStationStructure,
  getDepStructureWithUserCount
} from '@/api/personnelManagement'
export default {
  name:"organization",
  components:{
    OrgChart
  },
  data(){
    return {
      activeKey:0,
      datasource:[],
      depUserCountList:[],
      spinning:false
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'organizational-structure'){
          this.fillData()
        }
      },
      immediate:true
    }
  },
  computed:{
    formatDepUserCount(){
      let wrapHtml = ''
      let arr = []
      this.depUserCountList.map((dep,idx) =>{
        //debugger
        if(idx !== 0 && idx % 6 === 0){
          arr.push(`<ul>${wrapHtml}</ul>`)
          wrapHtml = ''
        }
        wrapHtml += `<li>${dep.departmentName}（${dep.userCount}人）</li>`
      })
      if(wrapHtml.length > 0){
        arr.push(`<ul>${wrapHtml}</ul>`)
        wrapHtml = ''
      }

      return arr.join('')
    }
  },
  methods:{
    selectNode (nodeData) {
      console.log(nodeData)
    },
    tabChange(key){
      this.activeKey = parseInt(key)
      this.datasource = []
      this.depUserCountList = []
      this.fillData()
    },
    fillData(){
      let that = this
      let _api = that.activeKey === 0 ? getDepStructure : getStationStructure

      that.spinning = true
      _api().then(res =>{
        that.spinning = false
        that.datasource = res.data
      }).catch(err =>{
        that.spinning = false
        that.$message.error(err.message)
      })

      if(that.activeKey === 0){
        getDepStructureWithUserCount().then(res =>{
          console.log(res)
          that.depUserCountList = res.data
        })
      }
    },
    formatNodeData(nodeData){
      return +this.activeKey === 0 ? nodeData.name : `${nodeData.name}（${nodeData.userCount}人）`
    },
    getLevelColor(level){
      //debugger
      let defaultColor = '#444'
      let m = {
        'A':'#4ecb73',
        'B':'#36cbcb',
        'C':'#3aa1ff',
        'D':'#cf181d',
        'E':'#fef1ad',
        'F':'#d2b8d5',
        'G':'#79a9da',
        'H':'#f2a644',
      }

      let m1 = {
        '1':'#4ecb73',
        '2':'#36cbcb',
        '3':'#3aa1ff',
        '4':'#cf181d',
        '5':'#fef1ad',
        '6':'#d2b8d5',
        '7':'#79a9da',
        '8':'#f2a644',
      }
      return m1[level] || m[level] || defaultColor
    }
  }
}
</script>

<style scoped>
  .orgchart-container-list {
    display: flex;
    overflow: auto;
    background-color: #fff;
  }
  .orgchart-container-list >>> .orgchart-container{
    overflow: initial;
  }
  .orgchart-container-list >>> .node{
    line-height: 1.25;
    min-height: 150px;
    overflow: hidden;
  }

  .orgchart-container-list >>> .node .node-item-txt{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 180px;
    min-height: 150px;
    max-height: 220px;
    overflow: hidden;
  }

  .dep-user-count-wrapper{
    background-color: #fff;
    overflow: hidden;
    padding: 20px;
  }

  .dep-user-count-wrapper >>> ul{
    min-width:200px;
    float: left;
    border-left: 1px dashed #ccc;
    margin: 20px 0;
  }
  .dep-user-count-wrapper >>> div{
    display: inline-block;
    overflow: hidden;
    border: 1px solid #ccc;
  }
  .dep-user-count-wrapper >>> ul:first-child{
    border: none;
  }
  .dep-user-count-wrapper >>> ul li{
    list-style-type: none;
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
  }

</style>