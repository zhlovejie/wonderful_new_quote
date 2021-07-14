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
        label="产品名称"
        prop="productName"
      >
        <a-input
          placeholder="产品名称"
          v-model="form.productName"
          allowClear
          style="width: 280px"
        />
      </a-form-model-item>
      <a-form-model-item
        label="产品类型"
        prop="productTypeConfigId"
      >
        <a-input
          placeholder="选择产品类型"
          v-model="form.productTypeConfigName"
          style="width: 280px"
          readonly="readonly"
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
  components: { OptionsSelect ,ProductTypeSelect},
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
      treeData: [],
      productTypeConfigId:1,

      form:{},
      rules:{
        productName:[
          {required: true, message: '请输入产品名称', trigger: 'blur'}
        ],
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
      that.optionsList = that.addForm.optionsList
      that.treeData = that.addForm.treeData

      if(type === 'edit'){
        let {items} = that.addForm.form.step3
        that.optStandItems = that.addNodesKey(items)
      }
      that.$nextTick(() => {
        that.$refs.optStand.query(type, that.optStandItems, { optionsList: that.optionsList, treeData: that.treeData })
        that.filterKeys = that.optStandItems.map(opt => opt.itemConfigId)
      })
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

    openModel(refName){
      this.$refs[refName].query()
    },
    productTypeSelectHandler(record){
      this.form = {...this.form,productTypeConfigId:record.id,productTypeConfigName:record.typeName}
    },
    stepAction(type) {
      const that = this
      if (type === 'next') {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const data = {
              items: that.addConfigType(that.optStandItems, 0),
              filterKeys: that.filterKeys,
              productTypeConfigId:that.productTypeConfigId
            }
            that.$emit('change', 'step3', 'next', data)

            // 产品名称和产品类型
            that.addForm.form = {
              ...that.addForm.form,
              productName:that.form.productName,
              productTypeConfigId:that.form.productTypeConfigId
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      } else if (type === 'prev') {
        that.$emit('change', 'step3', 'prev', null)
      }
    },
    fill(data){
      const that = this
      let {items,productName,productTypeConfigId,productTypeConfigName,filterKeys} = this.addForm.form.step3
      that.optStandItems = that.addNodesKey(items)
      that.filterKeys = filterKeys
      that.form = {
        productName,productTypeConfigId,productTypeConfigName
      }
      that.query('edit')
    }
  }
}
</script>

<style scoped>
</style>

