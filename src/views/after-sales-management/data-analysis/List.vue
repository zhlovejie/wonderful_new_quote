<template>
  <div style="padding:20px;background-color:#fff;">
     <a-tabs :activeKey="activeKey" @change="handlerTabChange">
       <a-tab-pane v-for="tab in tabList" :key="tab.key" :tab="tab.label" />
     </a-tabs>
     <component :is="current" ></component>
  </div>
</template>

<script>
import DeviceArchivesWarrantyAnalyse from './DeviceArchivesWarrantyAnalyse'
import DeviceArchivesWarrantyStatistics from './DeviceArchivesWarrantyStatistics'
import MaintenanceTaskAcceptanceTaskAcceptance from './MaintenanceTaskAcceptanceTaskAcceptance'
import ReimburseCostStatistics from './ReimburseCostStatistics'
import ReimburseUserCostStatistics from './ReimburseUserCostStatistics'
import AccessoriesCollectionDetailCollectionAnalysis from './AccessoriesCollectionDetailCollectionAnalysis'
import AccessoriesManagementGuaranteeArrears from './AccessoriesManagementGuaranteeArrears'
export default {
  name: 'after-sales-management_data-analysis',
  components:{
    DeviceArchivesWarrantyAnalyse,
    DeviceArchivesWarrantyStatistics,
    MaintenanceTaskAcceptanceTaskAcceptance,
    ReimburseCostStatistics,
    AccessoriesCollectionDetailCollectionAnalysis,
    ReimburseUserCostStatistics,
    AccessoriesManagementGuaranteeArrears
  },
  data() {
    return {
      activeKey:1,
      tabList:[
        {
          key:1,
          label:'过保分析',
          componentName:'DeviceArchivesWarrantyAnalyse'
        },
        {
          key:2,
          label:'过保统计',
          componentName:'DeviceArchivesWarrantyStatistics'
        },
        {
          key:3,
          label:'客户验收分析',
          componentName:'MaintenanceTaskAcceptanceTaskAcceptance'
        },
        {
          key:4,
          label:'售后成本统计',
          componentName:'ReimburseCostStatistics'
        },
        {
          key:5,
          label:'售后人员成本统计',
          componentName:'ReimburseUserCostStatistics'
        },
        {
          key:6,
          label:'配件收款分析',
          componentName:'AccessoriesCollectionDetailCollectionAnalysis'
        },
        {
          key:7,
          label:'销售担保欠款',
          componentName:'AccessoriesManagementGuaranteeArrears'
        }
      ],
      current:'DeviceArchivesWarrantyAnalyse'
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'after-sales-management_data-analysis') {

        }
      },
      immediate: true,
    },
  },

  methods: {
    handlerTabChange(key){
      this.activeKey = key
      let tab = this.tabList.find(item => item.key === key)
      if(tab){
        this.current = tab.componentName
      }
    }
  }
}
</script>

<style scoped>

</style>
