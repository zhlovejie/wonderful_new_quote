<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >
    <OptionsSelect ref="optStand" modelTitle="标准配置" @change="nodes => optStandItems = nodes" @optChange="keys => filterKeys = keys" />
    <OptionsSelect ref="optChoice" modelTitle="选择配置" :filterKeys="filterKeys" @change="nodes => optChoiceItems = nodes" />

    <p style="text-align:center;margin-top:20px;">
      <a-button type="primary"  @click="stepAction('prev')">上一步</a-button>
      <a-button type="primary"  @click="stepAction('next')" style="margin-left:10px;">下一步</a-button>
    </p>
  </a-card>
</template>

<script>
import {
  priceQuotedZktPageList
} from '@/api/productOfferManagement'
import OptionsSelect from '@/views/product-offer-management/control-system-options/OptionsSelect'
export default {
  components:{OptionsSelect},
  inject:['addForm'],
  data() {
    return {
      optStandItems:[],
      optChoiceItems:[],
      filterKeys:[]
    }
  },
  created(){

  },
  methods: {
    query(type='add'){
      const that = this
      let {optionsList,treeData} = that.addForm
      that.$refs.optStand.query(
        type,
        that.optStandItems,
        {
          optionsList:that.$_.cloneDeep(optionsList),
          treeData:that.$_.cloneDeep(treeData),
        }
      )

      that.$refs.optChoice.query(
        type,
        that.optChoiceItems,
        {
          optionsList:that.$_.cloneDeep(optionsList),
          treeData:that.$_.cloneDeep(treeData),
        }
      )

      that.filterKeys = that.optStandItems.map(opt => opt.itemConfigId)
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
    stepAction(type){
      const that = this
      if(type === 'next'){
        let {optStandItems,optChoiceItems} = that
        that.$emit('change','step2','next',{
          optStandItems:that.addConfigType(optStandItems,0),
          optChoiceItems:that.addConfigType(optChoiceItems,1)
        })
      }else if(type === 'prev'){
        that.$emit('change','step2','prev',null)
      }
    }
  }
}
</script>

<style scoped>
</style>

