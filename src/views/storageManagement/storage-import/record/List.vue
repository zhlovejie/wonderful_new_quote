<template>
  <div style="padding:20px;background-color:#fff;">
     <a-tabs :activeKey="activeKey" @change="handlerTabChange">
       <a-tab-pane v-for="tab in tabList" :key="tab.key" :tab="tab.label" />
     </a-tabs>
     <component :is="current" ></component>
  </div>
</template>

<script>
import ImportList from './ImportList'
import ImportList2 from './ImportList2'

export default {
  name: 'stock_management_import_record',
  components:{
    ImportList,
    ImportList2
  },
  data() {
    return {
      activeKey:1,
      tabList:[
        {
          key:1,
          label:'待入库单',
          componentName:'ImportList2'
        },
        {
          key:2,
          label:'已入库',
          componentName:'ImportList'
        },
      ],
      current:'ImportList'
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'stock_management_import_record') {
          handlerTabChange(1)
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
