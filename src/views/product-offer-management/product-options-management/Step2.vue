<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >
    <a-checkbox-group
      v-model="selectKeys"
      :options="optionsCheckbox"
    />

    <p style="text-align:center;margin-top:20px;">
      <a-button type="primary" @click="stepAction('prev')">上一步</a-button>
      <a-button type="primary" @click="stepAction('next')" style="margin-left:10px;">下一步</a-button>
    </p>
  </a-card>
</template>

<script>
import {
  priceQuotedZktPageList,
  priceQuotedZktListAll
} from '@/api/productOfferManagement'

export default {
  inject:['addForm'],
  data() {
    return {
      // 表头
      selectKeys: [],
      dataSource:[],
    }
  },
  created(){
    this.search()
  },
  computed:{
    optionsCheckbox(){
      return this.dataSource.map(item => {
        return { label: item.configName, value: item.itemConfigId}
      })
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
        })
    },
    stepAction(type){
      const that = this
      if(type === 'next'){
        let items = that.dataSource.filter(item => that.selectKeys.includes(item.itemConfigId))
        that.$emit('change','step2','next',[...items])
      }else if(type === 'prev'){
        that.$emit('change','step2','prev',null)
      }
    },
    async fill(data){
      const that = this
      await that.search()
      let {step2} = that.addForm.form
      that.dataSource = that.dataSource.map(item => {
        let target = step2.find(n => n.itemConfigId === item.itemConfigId)
        if(target){
          item.__id = target.id //修改时候的需要的ID
        }
        return item
      })
      that.selectKeys = step2.map(item => item.itemConfigId)
    }
  }
}
</script>

<style scoped>
</style>

