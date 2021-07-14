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
          <OptionsSelect
            ref="optStand"
            modelTitle="标准配置"
          />
          <OptionsSelect
            ref="optChoice"
            modelTitle="选择配置"
          />
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
      // step3,step4 数据源
      optionsList: [],
      treeData: [],
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

      that.optionsList = optionsList
      that.treeData = treeData

      priceQuotedProductDetail({ id: record.id }).then(res => {
        const data = res.data
        const step1 = []
        const step2 = data.childrenList.filter(item => item.configType === 2)
        const step3 = {
          items: data.childrenList.filter(item => item.configType === 0),
          productName: data.productName,
          productTypeConfigId: data.productTypeConfigId,
          productTypeConfigName: data.productTypeConfigName,
          filterKeys: data.childrenList.filter(item => item.configType === 0).map(opt => opt.itemConfigId)
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
        let [optionsList,treeData] = [that.optionsList,that.treeData]
        that.$refs.optStand.query('view', stands.items, { optionsList, treeData })
        that.$refs.optChoice.query('view', choices.items, { optionsList, treeData })
      })
    }
  }
}
</script>

<style scoped>
</style>

