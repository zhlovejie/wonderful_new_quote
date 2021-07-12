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
      filterKeys: [],
      optionsList: [],
      treeData: []
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
      that.optionsList = optionsList
      that.treeData = treeData

      if(type === 'edit'){
        let {items} = this.addForm.form.step4
        that.optChoiceItems = that.addNodesKey(items)
      }

      that.$nextTick(() => {
        that.$refs.optChoice.query(type, that.optChoiceItems, {
          optionsList: that.optionsList,
          treeData: that.treeData
        })
        that.setFilterKeys()
      })
    },
    setFilterKeys(){
      const that = this
      try{
        that.filterKeys = [...that.addForm.form.step3.filterKeys]
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
    fetchOptions() {
      const that = this
      return priceQuotedItemConfigSubList(that.queryParam)
        .then(res => {
          that.optionsList = res.data.filter(item => item.parentConfigId === 0 && item.itemConfigType !== 9)
        })
        .catch(err => {
          that.$message.error(err)
          that.optionsList = []
        })
    },
    fetchTree() {
      const that = this
      return priceQuotedItemConfigTreeList()
        .then(res => {
          const root = {
            id: 0,
            key: 0,
            configName: '配置项',
            isLeaf: false,
            parentConfigId: null,
            childrenList: res.data.map(item => that.formatTreeData(item))
          }
          that.treeData = root
        })
        .catch(err => {
          that.$message.error(`调用接口[priceQuotedItemConfigTreeList]时发生错误，错误信息:${err}`)
        })
    },
    formatTreeData(item) {
      const that = this
      const obj = {}
      obj.id = undefined
      obj.configName = item.configName
      obj.parentConfigId = item.parentConfigId || 0
      obj.serialNumber = item.serialNumber
      obj.itemConfigType = item.itemConfigType
      obj.itemConfigId = item.id
      obj.key = item.id

      if (obj.itemConfigType === 1) {
        obj.__checked = false
        obj.configValue = undefined
        obj.isChecked = -1
        obj.isRequired = -1
      }

      if (Array.isArray(item.quotedItemConfigTreeVOList) && item.quotedItemConfigTreeVOList.length > 0) {
        obj.childrenList = item.quotedItemConfigTreeVOList.map(v => that.formatTreeData(v))
      }
      return obj
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
    },
    fill(data){
      const that = this
      that.query('edit')
    }
  }
}
</script>

<style scoped>
</style>

