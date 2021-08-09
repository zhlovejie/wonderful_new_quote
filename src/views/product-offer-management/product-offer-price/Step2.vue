<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >
    <a-checkbox-group
      v-model="selectKeys"
      :options="optionsCheckbox"
      @change="optionsChange"
    />
    <OptionsSelect title="标准配置" style="margin-top:20px;" v-model="standData" actionType="price" :filterKeys="standDataFilterKyes" />
    <OptionsSelect title="选择配置" v-model="choiceData" actionType="price" :filterKeys="choiceDataFilterKyes" />
    <p style="text-align:center;margin-top:20px;">
      <a-button type="primary" @click="stepAction('prev')">上一步</a-button>
      <a-button type="primary" @click="stepAction('next')" style="margin-left:10px;">下一步</a-button>
    </p>
  </a-card>
</template>

<script>

import {
  priceQuotedZktDetail,
  priceQuotedZktPageList,
  priceQuotedZktListAll
} from '@/api/productOfferManagement'
import OptionsSelect from '@/views/product-offer-management/control-system-options/OptionsSelect'
export default {
  inject:['addForm'],
  components:{OptionsSelect},
  data() {
    return {
      // 表头
      selectKeys: [],
      dataSource:[],
      standData:{
        keys:[],
        treeData:[]
      },
      choiceData:{
        keys:[],
        treeData:[]
      },
      optionsCheckbox:[]
    }
  },
  created(){
    this.search()
  },
  computed:{
    standDataFilterKyes(){
      return [...this.choiceData.keys]
    },
    choiceDataFilterKyes(){
      return [...this.standData.keys]
    }
  },
  methods: {
    search(params = {}) {
      const that = this
      return priceQuotedZktListAll()
        .then(res => {
          that.dataSource = res.data.map(item => {
            item.itemConfigId = item.id
            return item
          })
          that.optionsCheckbox = that.dataSource.map(item => {
            return { label: item.configName, value: item.itemConfigId , disabled:false}
          })

        })
    },
    optionsChange(keys){
      const that = this
      let optionsCheckbox = [...that.optionsCheckbox]
      if(keys.length === 1){
        optionsCheckbox = optionsCheckbox.map(opt => {
            opt.disabled = opt.value !== keys[0]
            return opt
        })
        that.optionsCheckbox = optionsCheckbox
      }else{
        optionsCheckbox = optionsCheckbox.map(opt => {
            opt.disabled = false
            return opt
        })
        that.optionsCheckbox = optionsCheckbox
      }

      that.standData = {
        keys:[],
        treeData:[]
      }
      that.choiceData = {
        keys:[],
        treeData:[]
      }
      if(keys.length > 0){
        let item = that.dataSource.find(item => item.itemConfigId === keys[0])
        that.initDetail(item.itemConfigId)
      }
    },
    async initDetail(id) {
      const that = this

        that.spinning = true
        await priceQuotedZktDetail({id}).then(res => {
          that.spinning = false
          let result = res.data
          let nodes = that.checkedAndRequired2ConfigValue(result.childrenList)
          let optStandItems = nodes.filter(item => +item.configType === 0)
          let optChoiceItems = nodes.filter(item => +item.configType === 1)

          that.standData = {
            keys:optStandItems.map(node => node.itemConfigId),
            treeData:optStandItems
          }
          that.choiceData = {
            keys:optChoiceItems.map(node => node.itemConfigId),
            treeData:optChoiceItems
          }
        }).catch(err => {
          that.spinning = false
          that.$message.error(err)
        })
    },
    checkedAndRequired2ConfigValue(nodes) {
      const that = this
      const f = n => {
        if (n.isRequired === 0 && n.isChecked === 0) {
          n.configValue = 1
        } else if (n.isRequired === 0 && n.isChecked === 1) {
          n.configValue = 2
        } else if (n.isRequired === 1 && n.isChecked === 0) {
          n.configValue = 3
        } else if (n.isRequired === 1 && n.isChecked === 1) {
          n.configValue = 4
        }
        if(n.itemConfigType === 1){
          n.__checked = true
        }
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
        let items = that.dataSource.filter(item => that.selectKeys.includes(item.itemConfigId))
        that.$emit('change','step2','next',{
          controlItem:items.length > 0 ? items[0] : null,
          standData:that.standData.treeData,
          choiceData:that.choiceData.treeData
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

