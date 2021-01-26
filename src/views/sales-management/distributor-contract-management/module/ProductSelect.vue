<template>
  <div class="product-info-wrapper">
    <a-form>
      <a-table
        bordered
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: 1200 }"
        size="middle"
      >
        <template slot="targetId" slot-scope="text, record">
          <a-input
            read-only="read-only" 
            :disabled="isDisabled" 
            @click="targetIdModel(record)"
            placeholder="选择标的名称"
            :value="record.targetName"
          />
        </template>
        <template slot="productType" slot-scope="text,record">
          <a-select
            :value="record.productType" 
            :disabled="isDisabled" 
            placeholder="选择产品类别"
            @change="typeSelectChange(record,$event)"
          >
            <a-select-option value="0">常规产品</a-select-option>
            <a-select-option value="1">非常规产品</a-select-option>
          </a-select>
        </template>
        <template slot="productModel" slot-scope="text, record">
          <a-input
            read-only="read-only" 
            :disabled="isDisabled" 
            @click="openModel(record)"
            placeholder="选择产品代码"
            :value="record.productModel"
          />
        </template>

        <template slot="productName" slot-scope="text, record">
          <span>{{record.productName}}</span>
        </template>

        <template slot="count" slot-scope="text, record">
          <a-input-number
            step="1"
            :min="0"
            :value="record.count" 
            :disabled="isDisabled" 
            @change="multiplyMoney(record,'count',$event)"
          />
        </template>

        <template slot="unitPrice" slot-scope="text, record">
          <a-input-number
            :precision="2"
            :min="0"
            :value="record.unitPrice" 
            :disabled="isDisabled" 
            @change="multiplyMoney(record,'unitPrice',$event)"
          />
        </template>

        <template slot="oneMoney" slot-scope="text ,record">
          <span>{{ record.oneMoney | moneyFormatNumber}}</span>
        </template>

        <template slot="operation" slot-scope="text, record">
          <a-popconfirm v-if="!isDisabled" title="是否要删除此行？" @confirm="remove(record)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-form>
    <a-button style="width: 100%;" v-if="!isDisabled" type="dashed" icon="plus" @click="newMember">新增行</a-button>

    <a-row justify="start" align="middle">
      <a-col class="col-mount" :span="24">
        <slot></slot>
      </a-col>
      <a-col class="col-mount" :span="24">
        <span class="span-mount">合计（人民币）</span>
        <span class="span-mount bigword">{{ chineseTotalAmount }}</span>
        <span class="span-mount">(&nbsp;{{ totalAmount | moneyFormatNumber }}&nbsp;)</span>
      </a-col>
    </a-row>

    <product-model ref="productModel" @custom-change="productChange"></product-model>
    <targetid-model ref="targetidModel" @select="targetidChange"></targetid-model>
  </div>
</template>
<script>
import { turnTheCapital } from '@/api/contractListManagement'
import moment from 'moment'
import ProductModel from './productModel'
import TargetidModel from './targetidModel'

let productKeyID = 0
let columns = [
  {
    align: 'center',
    title: '标的名称',
    dataIndex: 'targetId',
    key: 'targetId',
    scopedSlots: { customRender: 'targetId' }
  },
  {
    align: 'center',
    title: '产品类别',
    dataIndex: 'productType',
    key: 'productType',
    scopedSlots: { customRender: 'productType' }
  },
  {
    align: 'center',
    title: '产品代码',
    dataIndex: 'productModel',
    key: 'productModel',
    scopedSlots: { customRender: 'productModel' }
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    scopedSlots: { customRender: 'productName' }
  },
  {
    align: 'center',
    title: '单位（套）',
    dataIndex: 'count',
    key: 'count',
    scopedSlots: { customRender: 'count' }
  },
  {
    align: 'center',
    title: '单价(元)',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    scopedSlots: { customRender: 'unitPrice' }
  },
  {
    align: 'center',
    title: '金额(元)',
    dataIndex: 'oneMoney',
    key: 'oneMoney',
    scopedSlots: { customRender: 'oneMoney' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'ProductList',
  components: {
    ProductModel, //选择产品
    TargetidModel //选择标的
  },
  props: {
    productListDataSource: {
      type: Array,
      default: function() {
        return []
      }
    },
    disabled:{
      type:Boolean,
      default:function(){
        return false
      }
    }
  },
  data() {
    return {
      columns: columns,
      loading: false,
      data: [], //行信息
      validateData: {}, //验证行信息
      chineseTotalAmount: '零',
      isDisabled:false
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    productListDataSource: function() {
      this.init()
    },
    totalAmount: function() {
      if (this.totalAmount <= 0) {
        this.chineseTotalAmount = '零'
      } else {
        turnTheCapital({ money: this.totalAmount }).then(res => (this.chineseTotalAmount = res.data))
      }
    }
  },
  computed: {
    // 合计总金额
    totalAmount() {
      let totalAmount = this.data.reduce((calc, item) => calc + (item.count * item.unitPrice), 0)
      return Number(totalAmount).toFixed(2)
    }
  },
  methods: {
    init() {
      let that = this

      that.isDisabled = this.disabled
      that.data = that.productListDataSource.map(item =>{
        let _item = Object.assign({},item)
        productKeyID++
        _item.key = productKeyID
        _item.oneMoney = _item.count * _item.unitPrice
        _item.productModel = _item.productCode
        _item.productType = String(_item.productType)
        return _item
      })
    },
    // 添加行
    newMember() {
      productKeyID++
      this.data.push({
        key: productKeyID,
        targetId: null, //标的编号
        targetName: null, //标的名称

        productType: undefined, //产品类别
        productId: 0,
        productModel: '', //产品代码
        productName: '', //产品名称
        productStandard: '', //规格型号

        count: undefined, //数量
        unitPrice: undefined, //'单价'
        oneMoney: 0 // 一行产品的金额
      })
    },
    // 删除行
    async remove(record) {
      this.data = this.data.filter(item => item.key !== record.key)
    },
    // 标的id的改变 弹出层
    targetIdModel(record) {
      this.$refs.targetidModel.query(record)
    },
    targetidChange(data) {
      console.log('JSON 页面传值事件 标的id的改变 弹出层:', data)
      const dataSource = [...this.data]
      let { inputObject, selectItem } = data
      const target = dataSource.find(item => item.key === inputObject.key)
      if (target) {
        target.targetId = selectItem.id
        target.targetName = selectItem.text
        this.data = dataSource
      }
    },
    //选择产品类别获取产品代码和产品图片
    typeSelectChange(record, e) {
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === record.key)
      if (target) {
        target['productType'] = e
        target.productPic = null
        target.productModel = null
        target.productId = null
        target.productName = null
        this.data = dataSource
      }
    },
    //产品代码弹出框
    openModel(record) {
      this.$refs.productModel.query(record)
    },
    productChange(data) {
      console.log('JSON 页面传值事件 标的id的改变 弹出层:', data)
      let { selectItem, recordParam } = data
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === recordParam.key)
      if (target) {
        target['productPic'] = selectItem.productPic
        target['productModel'] = selectItem.productModel
        target['productId'] = selectItem.id
        target['productName'] = selectItem.productName
        this.data = dataSource
      }
    },
    // 输入单价后，求相乘的一行的金额
    multiplyMoney(record, key, e) {
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === record.key)
      if (target) {
        target[key] = e
        let calcObj = this.calcNumber(target)
        target['oneMoney'] = calcObj.oneMoney
        this.data = dataSource
      }
    },
    calcNumber(item) {
      let count = parseInt(item.count, 10)
      let unitPrice = parseFloat(item.unitPrice || 0)
      let oneMoney = count * unitPrice
      return { oneMoney: oneMoney }
    },

    validate() {
      let hasError = false
      for (let i = 0, len = this.data.length; i < len; i++) {
        let item = this.data[i]
        if (isEmpty(item.targetName)) {
          this.$message.info('请选择标的名称')
          hasError = true
          break
        }
        if (isEmpty(item.productType)) {
          this.$message.info('请选择产品类别')
          hasError = true
          break
        }
        if (isEmpty(item.productModel)) {
          this.$message.info('请选择产品代码')
          hasError = true
          break
        }
        if (isEmpty(item.count) || item.count <= 0) {
          this.$message.info('请输入数量')
          hasError = true
          break
        }
        if (isEmpty(item.unitPrice) || item.unitPrice <= 0) {
          this.$message.info('请输入单价')
          hasError = true
          break
        }
      }

      function isEmpty(v) {
        return v === undefined || v === null || v === '' ? true : false
      }

      return {
        errors: hasError,
        values: [...this.data]
      }
    }
  }
}
</script>
