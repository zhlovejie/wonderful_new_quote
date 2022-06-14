<template>
  <a-card :bordered="false">
    <a-tabs
          :activeKey="activeKey"
          :defaultActiveKey="activeKey"
          @change="tabChange"
        >
          <a-tab-pane tab="待报价需求单" :key="1" />
          <a-tab-pane tab="我的" :key="2" />
          <a-tab-pane tab="待审批" :key="3" />
          <a-tab-pane tab="已审批" :key="4" />
        </a-tabs>

        <template v-if="[1].includes(activeKey)">
          <ListTypeOne ref="ref_table" :tagKey="activeKey"/>
        </template>
        <template v-if="[2,3,4].includes(activeKey)">
          <ListTypeTwo ref="ref_table" :tagKey="activeKey"/>
        </template>
  </a-card>
</template>

<script>
import DepartmentSelect from '@/components/CustomerList/DepartmentSelect'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import ListTypeOne from './modules/ListTypeOne'
import ListTypeTwo from './modules/ListTypeTwo'

export default {
  name:'outsourcing-offer',
  components:{
    DepartmentSelect,
    CommonDictionarySelect,
    ListTypeOne,
    ListTypeTwo
  },
  data(){
    return {
      queryParam: {},
      activeKey: 1,
    }
  },
  computed:{

  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'outsourcing-offer') {
          this.search()
        }
      },
      immediate: true
    }
  },
  methods:{
    search(opt){
      const that = this
      that.$nextTick(() => {
        let _ref = this.$refs['ref_table']
        _ref && _ref.search && _ref.search()
      })
    },
    tabChange(tagKey){
      this.activeKey = +tagKey
      this.search()
    }
  }
}
</script>

<style scoped>

</style>

