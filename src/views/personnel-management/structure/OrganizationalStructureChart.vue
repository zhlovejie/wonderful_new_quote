<template>
  <div class="organization-wrapper">
    <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
      <a-tab-pane tab="部门架构图" key="0"/>
      <a-tab-pane tab="岗位架构图" key="1"/>
    </a-tabs>
    <div class="orgchart-container-list">
      <org-chart v-for="(item,index) in datasource" :key="index" :datasource="item" @node-click="selectNode">
        <template slot-scope="{ nodeData }">
          <a-popover :title="nodeData.name" trigger="hover">
            <template slot="content">
              <p>所属级别：{{nodeData.level}}</p>
            </template>
            <span :style="{color:getLevelColor(nodeData.level)}" @click="selectNode(nodeData)">{{ nodeData.name }}</span>
          </a-popover>
        </template>
      </org-chart>
    </div>
  </div>
</template>

<script>
import OrgChart from '@/components/Organization/OrganizationChartContainer'
import {
  getDepStructure,
  getStationStructure
} from '@/api/personnelManagement'
export default {
  name:"organization",
  components:{
    OrgChart
  },
  data(){
    return {
      activeKey:0,
      datasource:[]
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
  methods:{
    selectNode (nodeData) {
      console.log(nodeData)
    },
    tabChange(key){
      this.activeKey = parseInt(key)
      this.fillData()
    },
    fillData(){
      let that = this
      let _api = that.activeKey === 0 ? getDepStructure : getStationStructure
      _api().then(res =>{
        that.datasource = res.data
      })
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
  }

</style>