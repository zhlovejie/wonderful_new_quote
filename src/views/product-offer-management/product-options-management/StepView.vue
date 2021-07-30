<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <div class="wrapper">
        <div style="font-weight: 700;">
          <p>产品信息：{{msg.productInfo}}</p>
          <p>产品型号：{{msg.productType}}</p>
          <p v-if="msg.productTypeConfigName">产品类型：{{msg.productTypeConfigName}}</p>
          <p>中控型号：{{msg.controlType}}</p>
        </div>
        <p>
          <OptionsSelect title="标准配置" actionType="view" v-model="standData" :filterKeys="standDataFilterKyes" />
          <OptionsSelect title="选择配置" actionType="view" v-model="choiceData" :filterKeys="choiceDataFilterKyes" />
        </p>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import { priceQuotedProductAddOrUpdate, priceQuotedProductDetail } from '@/api/productOfferManagement'
import { productMaterialInfoGetCode } from '@/api/routineMaterial'
import OptionsSelect from '@/views/product-offer-management/control-system-options/OptionsSelect'
export default {
  components: {OptionsSelect},
  provide() {
    return {
      addForm: this
    }
  },
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      form: {},
      standData:{
        keys:[],
        treeData:[]
      },
      standDataFilterKyes:[],
      choiceData:{
        keys:[],
        treeData:[]
      },
      choiceDataFilterKyes:[],
      msg : {
        productInfo:'',
        productType:'',
        controlType:''
      }
    }
  },
  created() {},
  computed: {
    modalTitle() {
      return '查看'
    }
  },
  methods: {
    query(type, record, { optionsList, treeData }) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true
      that.spinning = false
      that.currentStep = 0

      priceQuotedProductDetail({ id: record.id }).then(res => {
        const data = res.data
        const step1 = []
        const step2 = data.childrenList.filter(item => item.configType === 2)
        const step3 = {
          items: data.childrenList.filter(item => item.configType === 0),
          productName: data.productName,
          productTypeConfigId: data.productTypeConfigId,
          productTypeConfigName: data.productTypeConfigName
        }
        const step4 = {
          items: data.childrenList.filter(item => item.configType === 1)
        }
        const obj = { ...data, step1, step2, step3, step4 }
        delete obj.childrenList
        that.form = obj

        that.init()
      })
    },
    handleCancel() {
      const that = this
      that.form = {}
      that.$nextTick(() => (that.visible = false))
    },
    async init() {
      const that = this
      const {
        step1: productsPath,
        step2: controls,
        step3: stands,
        step4: choices,
        productSeries,
        productName,
        productTypeConfigName
      } = that.form

      if (productsPath.length === 0) {
        that.msg = {
          productInfo: productName,
          productType: productSeries,
          productTypeCode: productSeries,
          productTypeConfigName: productTypeConfigName,
          controlType: controls.map(item => item.configName).join('，')
        }
      } else {
        const _productsPath = [...productsPath].reverse()
        const orderCode = await productMaterialInfoGetCode({ ruleId: _productsPath[0].key }).then(res => res.data)
        const parentCode = _productsPath.map(item => item.code).join('')
        that.msg = {
          productInfo: _productsPath.map(item => item.title).join('->'),
          productType: `${productName}(${parentCode}${orderCode})`,
          productTypeCode: `${parentCode}${orderCode}`,
          controlType: controls.map(item => item.configName).join('，')
        }
      }

      that.$nextTick(() => {
        that.standData = {
          keys:stands.items.map(node => node.itemConfigId),
          treeData:that.checkedAndRequired2ConfigValue(stands.items)
        }
        that.choiceData = {
          keys:choices.items.map(node => node.itemConfigId),
          treeData:that.checkedAndRequired2ConfigValue(choices.items)
        }
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

    configValue2CheckedAndRequired(nodes) {
      const that = this
      const f = n => {
        if ('configValue' in n) {
          if (+n.configValue === 1) {
            n.isRequired = 0
            n.isChecked = 0
          } else if (+n.configValue === 2) {
            n.isRequired = 0
            n.isChecked = 1
          } else if (+n.configValue === 3) {
            n.isRequired = 1
            n.isChecked = 0
          } else if (+n.configValue === 4) {
            n.isRequired = 1
            n.isChecked = 1
          }
        }
        if (Array.isArray(n.childrenList) && n.childrenList.length > 0) {
          n.childrenList = n.childrenList.map(node => f(node))
        }
        return n
      }
      return nodes.map(n => f(n))
    }
  }
}
</script>

<style scoped>
</style>

