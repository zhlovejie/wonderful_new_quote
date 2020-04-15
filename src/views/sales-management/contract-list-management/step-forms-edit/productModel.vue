<template>
  <a-modal
    title="选择产品"
    :width="716"
    :confirmLoading="confirmLoading"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <div class="top-ation">
      <a-form layout="inline" :form="form">
          <a-form-item label="产品代码">
            <a-input class="modal-input" v-model="productModel"/>
          </a-form-item>
        <a-form-item label="产品名称" v-if="this.productType === 1">
          <a-input class="modal-input" v-model="productName"/>
        </a-form-item>
          <a-form-item label="客户名称" v-if="this.productType === 1">
            <a-input class="modal-input" v-model="customerName "/>
          </a-form-item>
        <a-form-item label="产品名称" v-if="this.productType === 0">
          <a-input class="modal-input" v-model="productName "/>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading" class="marg-t16">
      <s-table
        ref="table"
        size="default"
        :columns="columnsData"
        :data="loadData"
        :alert="false"
        rowKey="id"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <span slot="productModel" slot-scope="text, record">
          <a @click="clickVue(record)">{{ text }}</a>
        </span>
        <template slot="productPic" slot-scope="text">
          <img style="height: 50px;lenght:40px" :src="text"/>
        </template>
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
    STable
  },
  props: {
    productType: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      first: false,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      mdl: {},
      queryParam: {
        productType: this.productType
      },
      customerName: '',
      loading: true,
      saleUsers: [],
      productName: '',
      userId: 0,
      columns: [
          {
            align: 'center',
            title: '序号',
            key: 'order',
            width: '70px',
            scopedSlots: { customRender: 'order' }
          },
          {
            title: '产品代码',
            dataIndex: 'productModel',
            scopedSlots: { customRender: 'productModel' }
          },
          {
            title: '产品名称',
            dataIndex: 'productName',
          },
          {
            title: '产品图片',
            dataIndex: 'productPic',
            key: 'productPic',
            scopedSlots: { customRender: 'productPic' }
          },
      ],
      columns1: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '产品代码',
          dataIndex: 'productModel',
          scopedSlots: { customRender: 'productModel' }
        },
        {
          title: '核价编号',
          dataIndex: 'nuclearPriceModel'
        },
        {
          title: '客户名称',
          dataIndex: 'customerName'
        },
        {
          title: '产品图片',
          dataIndex: 'productPic',
          key: 'productPic',
          scopedSlots: { customRender: 'productPic' }
        }
      ],
      columnsData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam = {
          'productType': this.productType,
          'productModel': this.productModel || '',
          'productName': this.productName || '',
          'customerName': this.customerName || '',
          'valencyCode': this.valencyCode || ''
        }
        console.log('---------开始加载列表数据' + JSON.stringify(this.queryParam))
        // 常规非常规产品 根据不同的产品获取产品代码和产品数据
        return getProductType(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
            console.log('//常规非常规产品 根据不同的产品获取产品代码和产品数据res.data', res.data)
          })
      },
      productModel: '', // 产品代码
      nuclearPriceModel: '' // 核价编号
    }
  },
  computed: {},
  watch: {},
  cerated () {
    console.log('从父页面传来的productType', this.productType)
  },
  mounted () {
  },
  methods: {
    query (record) {
      // this.mdl = Object.assign({}, record)
      console.log('query record' + JSON.stringify(record))
      this.visible = true
      this.productType = record.productType
      // if(this.productType === 1){
      //  this.columns = this.columns1
      // }

      this.columnsData = Object.assign([], this.productType === 1 ? this.columns1 : this.columns)

      this.queryParam = { 'productType': record.productType }
      if (!this.first) {
        this.first = true
      } else {
        this.$refs.table.refresh(true)
      }
    },
    // 查询
    search () {
      this.queryParam = {
        'productType': this.productType,
        'productModel': this.productModel,
        'productName': this.productName,
        'customerName': this.customerName || '',
        'valencyCode': this.valencyCode || ''
      }
      this.$refs.table.refresh(true)
    },
    // 关闭弹窗函数
    close () {
      this.$emit('close')
      this.visible = false
    },
    // 点击产品代码执行关闭弹窗函数
    clickVue (data) {
      this.$emit('custom-change', data)
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
  .marg-t16{
    margin-top: 16px;
  }
  .modal-input{
    width: 100px;
  }
</style>
