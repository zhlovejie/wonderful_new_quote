<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
    >
      <a-form-model-item
        label="产品类型"
        prop="productTypeConfigId"
      >
        <a-input
          placeholder="选择产品类型"
          v-model="form.productTypeConfigName"
          style="width: 280px"
          read-only="read-only"
          @click="openModel('productTypeSelect')"
        />
      </a-form-model-item>
    </a-form-model>
    <OptionsSelect
      key="optStand"
      ref="optStand"
      modelTitle="标准配置"
      @change="nodes => optStandItems = nodes"
      @optChange="keys => filterKeys = keys"
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
    <ProductTypeSelect
      ref="productTypeSelect"
      @change="productTypeSelectHandler"
    />
  </a-card>
</template>
<script>

import OptionsSelect from '@/views/product-offer-management/control-system-options/OptionsSelect'
import ProductTypeSelect from './ProductTypeSelect'
export default {
  components: { OptionsSelect,ProductTypeSelect},
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
      form:{},
      rules:{
        productTypeConfigId:[
          {required: true, message: '请选择产品类型'}
        ]
      }
    }
  },
  computed:{
    btnNextDisabled(){
      return this.optStandItems.length === 0
    }
  },
  created() {
    if(this.addForm.isAdd){
      this.$nextTick(() => this.query('add'))
    }
  },
  methods: {
    query(type) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true
      that.optStandItems = []
      that.optChoiceItems = []
      that.filterKeys = []

      let {optionsList,treeData} = that.addForm
      that.$refs.optStand.query(
        type,
        that.optStandItems,
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
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const data = {
              items: that.addConfigType(that.optStandItems, 0),
              filterKeys: that.filterKeys
            }
            that.$emit('change', 'step3', 'next', data)
          } else {
            console.log('error submit!!');
            return false;
          }
        });


      } else if (type === 'prev') {
        that.$emit('change', 'step3', 'prev', null)
      }
    },
    openModel(refName){
      this.$refs[refName].query()
    },
    productTypeSelectHandler(record){
      const that = this
      let {id:productTypeConfigId,typeName:productTypeConfigName} = record
      that.form = {...this.form,productTypeConfigId,productTypeConfigName}
      that.addForm.form = {
        ...that.addForm.form,
        productTypeConfigId,
        productTypeConfigName
      }
    }
  }
}
</script>

<style scoped>
</style>

