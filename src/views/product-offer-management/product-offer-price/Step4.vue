<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >
    <OptionsSelect title="选择配置" v-model="choiceData" actionType="add" :filterKeys="choiceDataFilterKyes" />
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

import OptionsSelect from '@/views/product-offer-management/control-system-options/OptionsSelect'
export default {
  components: { OptionsSelect },
  inject:['addForm'],
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      choiceData:{
        keys:[],
        treeData:[]
      },
      choiceDataFilterKyes:[],
      detail: {},

    }
  },
  watch:{
    'addForm.currentStep':{
      handler(val, oldVal){
        if(this.addForm.isPrice && val === 3 && val > oldVal){
          this.query('add')
        }
      },
      deep:true
    }
  },
  computed:{
    btnNextDisabled(){
      return this.choiceData.treeData.length === 0
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

      {
        let {items} = that.addForm.form.step3
        that.choiceDataFilterKyes = items.map(item => item.itemConfigId)
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

    stepAction(type) {
      const that = this
      if (type === 'next') {
        const data = {
          items: that.addConfigType(that.choiceData.treeData, 1)
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

