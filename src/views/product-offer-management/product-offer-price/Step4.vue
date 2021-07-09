<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >
    <OptionsSelect
      key="optChoice"
      ref="optChoice"
      modelTitle="选配配置"
      :filterKeys="filterKeys"
      @change="nodes => optChoiceItems = nodes"
    />
    <p style="text-align:center;margin-top:20px;">
      <a-button
        type="primary"
        @click="stepAction('prev')"
      >上一步</a-button>
      <a-button
        type="primary"
        :disabled="btnNextDisabled"
        @click="stepAction('next')"
        style="margin-left:10px;"
      >下一步</a-button>
    </p>
  </a-card>
</template>
<script>
import {
  priceQuotedZktDetail,
  priceQuotedItemConfigSubList,
  priceQuotedItemConfigTreeList
} from '@/api/productOfferManagement'

import OptionsSelect from '@/views/product-offer-management/control-system-options/OptionsSelect'
export default {
  components: { OptionsSelect },
  inject:['addForm'],
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      treeData: [],
      detail: {},
      optStandItems: [], // 标配
      optChoiceItems: [], // 选配
      filterKeys: []
    }
  },
  watch:{
    'addForm.currentStep':{
      handler(val, oldVal){
        if(this.addForm.isAdd && val === 3 && val > oldVal){
          this.query('add')
        }
      },
      deep:true
    }
  },
  computed:{
    btnNextDisabled(){
      return this.optChoiceItems.length === 0
    }
  },
  created() {
    // this.query('add')
  },
  methods: {
    async query(type) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true
      that.optStandItems = []
      that.optChoiceItems = []
      that.filterKeys = []

      let {optionsList,treeData} = that.addForm
      if(!optionsList){
        return
      }
      that.$refs.optChoice.query(
        type,
        that.optChoiceItems,
        {
          optionsList:that.$_.cloneDeep(optionsList),
          treeData:that.$_.cloneDeep(treeData),
        }
      )
      that.setFilterKeys()
    },
    setFilterKeys(){
      const that = this
      try{
        if(that.addForm.form.step3){
          that.filterKeys = [...that.addForm.form.step3.filterKeys]
        }
      }catch(err){
        console.log(err)
      }
    },
    addConfigType(nodes, configType = 0) {
      const that = this
      const f = n => {
        n.configType = configType
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      }
      return nodes.map(n => f(n))
    },
    addNodesKey(nodes) {
      const that = this
      const f = n => {
        n.key = n.itemConfigId
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      }
      return nodes.map(n => f(n))
    },
    stepAction(type) {
      const that = this
      if (type === 'next') {
        const data = {
          items: that.addConfigType(that.optChoiceItems, 1)
        }
        that.$emit('change', 'step4', 'next', data)
      } else if (type === 'prev') {
        that.$emit('change', 'step4', 'prev', null)
      }
    }
  }
}
</script>

<style scoped>
</style>

