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
            <span @click="selectNode(nodeData)">{{ nodeData.name }}</span>
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