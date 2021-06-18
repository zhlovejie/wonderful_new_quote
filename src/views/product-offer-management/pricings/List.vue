<template>
  <a-card :bordered="false">
    <a-steps :current="current">
      <a-step title="核价类型" />
      <a-step title="核价输入" />
      <a-step title="价格" />
    </a-steps>
    <div class="steps-content" v-if="current === 0">
      <a-space :size="100">
        <a-button size="large" type="primary" @click="nexts(1)">物料代码核价</a-button>
        <a-button size="large" type="primary" @click="nexts(2)">核价代码核价</a-button>
        <a-button size="large" type="primary" @click="nexts(3)">成本价核价</a-button>
      </a-space>
    </div>
    <div class="steps-content" v-if="current === 1">
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 8 }">
        <a-form-item label="代码输入" v-if="type === 1">
          <a-select
            :filter-option="filterOption"
            show-search
            v-decorator="['materialId', { rules: [{ required: true, message: '请选择代码' }] }]"
            :loading="loading"
          >
            <a-select-option v-for="item in tionList" :key="item.id" :value="item.id"
              >{{ item.productModel }} ( {{ item.productName }} )</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="代码输入" v-if="type === 2">
          <a-select
            :filter-option="filterOption"
            show-search
            v-decorator="['valencyId', { rules: [{ required: true, message: '请选择代码' }] }]"
            :loading="loading"
          >
            <a-select-option v-for="item in saleValenc" :key="item.id" :value="item.id"
              >{{ item.newBasisModel }} ( {{ item.productName }} )</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="成本价" v-if="type === 3">
          <a-input-Number
            style="width: 100%"
            v-decorator="['costPrice', { rules: [{ required: true, message: '请输入成本价' }] }]"
          />
        </a-form-item>
        <a-form-item label="产品类型" v-if="type === 3">
          <a-select v-decorator="['productTypeConfigId', { rules: [{ required: true, message: '请选择产品类型' }] }]">
            <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
              item.typeName
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
    <div class="steps-content" v-if="current === 2">3</div>
    <div class="steps-action">
      <a-button v-if="current === 1" type="primary" @click="next"> 确定 </a-button>
      <a-button v-if="current === 2" type="primary" @click="prev"> 退出 </a-button>
      <a-button
        v-if="current === 2"
        type="primary"
        style="margin-left: 8px"
        @click="$message.success('Processing complete!')"
      >
        下载
      </a-button>
    </div>
  </a-card>
</template>

<script>
import {
  productInformationList,
  saleValencyProduct,
  typeConfigList,
  costPricePricing,
  materialCodePricing,
  valencyCodePricing,
} from '@/api/productOfferManagement'

export default {
  data() {
    return {
      current: 0,
      loading: true,
      tionList: [],
      saleValenc: [],
      depList: [],
      form: this.$form.createForm(this, { name: 'pom-pricing' }),
      type: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'pom-pricing') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      productInformationList().then((res) => {
        if (res.code === 200) {
          this.loading = false
          this.tionList = res.data
        }
      })
      saleValencyProduct().then((res) => {
        if (res.code === 200) {
          this.loading = false
          this.saleValenc = res.data
        }
      })
      typeConfigList().then((res) => {
        if (res.code === 200) {
          this.loading = false
          this.depList = res.data
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    nexts(val) {
      this.type = val
      this.current++
    },
    next() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let m = {
            1: materialCodePricing,
            2: valencyCodePricing,
            3: costPricePricing,
          }
          let api = m[this.type]
          api(values).then((res) => {
            console.log(res.data)
            if (res.code === 200) {
              this.current++
            }
          })
        }
      })
    },
    prev() {
      this.current = 0
    },
  },
}
</script>

<style>
.steps-content {
  margin-top: 25px;
  border-radius: 6px;
  background-color: #fff;
  min-height: 300px;
  text-align: center;
  padding-top: 130px;
}

.steps-action {
  margin-top: 24px;
  text-align: center;
}
</style>