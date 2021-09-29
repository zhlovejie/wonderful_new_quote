<template>
  <a-modal
    title="选择产品"
    :width="860"
    :confirmLoading="confirmLoading"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item label="产品代码">
          <a-input style="width: 200px; margin-right: 10px" class="modal-input" v-model="productModel" />
        </a-form-item>
        <a-form-item label="产品名称">
          <a-input style="width: 200px; margin-right: 10px" class="modal-input" v-model="productName" />
        </a-form-item>
        <a-form-item label="客户名称" v-if="this.queryParam.productType === 1">
          <a-input class="modal-input" v-model="customerName" />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading" class="marg-t16">
      <s-table ref="table" size="default" :columns="columnsData" :data="loadData" :alert="false" rowKey="id">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <span slot="productModel" slot-scope="text, record">
          <a @click="clickVue(record)">{{ text }}</a>
        </span>
        <!--        <template slot="productPic" slot-scope="text">-->
        <!--          <img style="width:50px;height:auto;border:none;" :src="text"/>-->
        <!--        </template>-->
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getProductType } from '@/api/contractListManagement'
export default {
  name: 'ProductModel',
  components: {
    STable,
  },
  data() {
    return {
      first: false,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      mdl: {},
      queryParam: {},
      customerName: '',
      loading: true,
      saleUsers: [],
      productName: '',
      productType: 0,
      seriesFlag: '',
      userId: 0,
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '产品代码',
          dataIndex: 'productModel',
          width: 180,
          scopedSlots: { customRender: 'productModel' },
        },
        {
          title: '产品名称',
          width: 180,
          dataIndex: 'productName',
        },
        {
          title: '规格型号',
          dataIndex: 'productStandard',
          key: 'productStandard',
          scopedSlots: { customRender: 'productStandard' },
        },
      ],
      columns1: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '产品代码',
          dataIndex: 'productModel',
          scopedSlots: { customRender: 'productModel' },
        },
        {
          title: '核价编号',
          dataIndex: 'nuclearPriceModel',
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
        },
        {
          title: '产品图片',
          dataIndex: 'productStandard',
          key: 'productStandard',
          scopedSlots: { customRender: 'productStandard' },
        },
      ],
      columnsData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParam = {
          productType: this.productType || 0,
          productModel: this.productModel || '',
          productName: this.productName || '',
          customerName: this.customerName || '',
          valencyCode: this.valencyCode || '',
          seriesFlag: this.seriesFlag,
        }
        console.log('---------开始加载列表数据' + JSON.stringify(this.queryParam))
        // 常规非常规产品 根据不同的产品获取产品代码和产品数据
        return getProductType(Object.assign(parameter, this.queryParam)).then((res) => {
          console.log('res===', res)
          return res
          console.log('//常规非常规产品 根据不同的产品获取产品代码和产品数据res.data', res.data)
        })
      },
      productModel: '', // 产品代码
      nuclearPriceModel: '', // 核价编号
      recordParam: null,
    }
  },
  computed: {},
  watch: {},
  cerated() {},
  mounted() {},
  methods: {
    query(record={}) {
      // this.mdl = Object.assign({}, record)
      // debugger
      console.log('query record' + JSON.stringify(record))
      this.visible = true
      this.productType = record.productType || 0
      this.queryParam.productType = this.productType
      this.recordParam = record
      this.seriesFlag = record.seriesFlag || ''

      this.columnsData = Object.assign([], this.productType === 1 ? this.columns1 : this.columns)

      try {
        console.log('---------seriesFlag:' + this.seriesFlag)
        this.$refs.table.refresh(true)
      } catch (err) {}
    },
    // 查询
    search() {
      this.queryParam = {
        productType: this.productType,
        productModel: this.productModel,
        productName: this.productName,
        customerName: this.customerName || '',
        valencyCode: this.valencyCode || '',
        seriesFlag: this.seriesFlag || '',
      }
      this.$refs.table.refresh(true)
    },
    // 关闭弹窗函数
    close() {
      this.$emit('close')
      this.visible = false
    },
    // 点击产品代码执行关闭弹窗函数
    clickVue(data) {
      this.$emit('change', {
        selectItem: data, //用户选择项目
        recordParam: this.recordParam, //父页面传过来的项目
      })

      this.close()
    },
  },
}
</script>

<style lang="less" scoped>
.marg-t16 {
  margin-top: 16px;
}
.modal-input {
  width: 100px;
}
</style>
