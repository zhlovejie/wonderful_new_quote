<template>
  <div class="product-info-wrapper">
    <a-table
      bordered
      :columns="columns"
      :dataSource="data"
      :scroll="{ x: 2000 }"
      :pagination="false"
      :loading="loading"
    >
      <template slot="targetId" slot-scope="text, record">
        <span>分类管理软件</span>
      </template>
      <template slot="productName" slot-scope="text, record">
        <a-select @change="productNameChange(record, $event)" disabled :value="record.productSysdicId">
          <a-select-option value="-1">选择产品</a-select-option>
          <a-select-option v-for="item in softProductData" :value="item.id" :key="item.id">{{
            item.text
          }}</a-select-option>
        </a-select>
      </template>
      <template slot="productType" slot-scope="text, record">
        <a-select @change="productTypeChange(record, $event)" disabled :value="String(record.productType)">
          <a-select-option value="-1">选择产品类别</a-select-option>
          <a-select-option value="0">标准版</a-select-option>
          <a-select-option value="1">定制版</a-select-option>
        </a-select>
      </template>
      <template slot="productVersion" slot-scope="text, record">
        <template v-if="parseInt(record.productType) === 0">
          <a-select
            @change="productVersionChange(record, $event)"
            disabled
            key="selectProductVersion"
            :value="record.productId"
          >
            <a-select-option value="-1">选择版本</a-select-option>
            <a-select-option v-for="item in record.productVersionList" :value="item.id" :key="item.id">{{
              item.version
            }}</a-select-option>
          </a-select>
        </template>
        <template v-if="parseInt(record.productType) === 1">
          <a-input
            type="text"
            style="width: 80px"
            disabled
            :value="record.productVersion"
            key="inputProductVersion"
            @change="productVersionChange(record, $event)"
          />
        </template>
      </template>
      <template slot="hasTax">是</template>
      <template slot="count">1</template>
      <template slot="unitPrice" slot-scope="text, record">
        <a-input-number
          disabled
          :precision="2"
          :min="0"
          :value="record.unitPrice"
          @change="multiplyMoney(record, $event)"
        />
      </template>
      <template slot="tax">8%</template>
      <template slot="taxAmount" slot-scope="text, record">
        <span>{{ record.taxAmount | moneyFormatNumber }}</span>
      </template>
    </a-table>

    <!-- <a-button style="width: 100%;" type="dashed" icon="plus" @click="newMember">新增行</a-button> -->

    <a-row justify="start" align="middle">
      <a-col class="col-mount" :span="24">
        <span class="span-mount">合计（人民币）</span>
        <span class="span-mount bigword">{{ chineseTotalAmount }}</span>
        <span class="span-mount">(&nbsp;{{ totalAmount | moneyFormatNumber }}&nbsp;)</span>
        <span class="span-mount">此价格含税。</span>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { turnTheCapital, getSoftwareProductVersions, delSoftwareContractProduct } from '@/api/contractListManagement'

import { getDictionary } from '@/api/common'

import moment from 'moment'
import _ from 'lodash'

let productKeyID = 0
let columns = [
  {
    align: 'center',
    title: '标的名称',
    dataIndex: 'targetId',
    key: 'targetId',
    width: '200px',
    scopedSlots: { customRender: 'targetId' },
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '200px',
    scopedSlots: { customRender: 'productName' },
  },
  {
    align: 'center',
    title: '产品类别',
    dataIndex: 'productType',
    key: 'productType',
    width: '200px',
    scopedSlots: { customRender: 'productType' },
  },
  {
    align: 'center',
    title: '软件版本号',
    dataIndex: 'productVersion',
    key: 'productVersion',
    width: '200px',
    scopedSlots: { customRender: 'productVersion' },
  },
  {
    align: 'center',
    title: '是否含税',
    dataIndex: 'hasTax',
    key: 'hasTax',
    width: '100px',
    scopedSlots: { customRender: 'hasTax' },
  },
  {
    align: 'center',
    title: '数量',
    dataIndex: 'count',
    key: 'count',
    scopedSlots: { customRender: 'count' },
    width: '100px',
  },
  {
    align: 'center',
    title: '含税金额(元)',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    scopedSlots: { customRender: 'unitPrice' },
    width: '200px',
  },
  {
    align: 'center',
    title: '税率%',
    dataIndex: 'tax',
    key: 'tax',
    scopedSlots: { customRender: 'tax' },
    width: '200px',
  },
  // {
  //   align: 'center',
  //   title: '含税金额(元)',
  //   dataIndex: 'taxAmount',
  //   key: 'taxAmount',
  //   scopedSlots: { customRender: 'taxAmount' },
  //   width:'200px'
  // },
  //   {
  //     title: '操作',
  //     key: 'action',
  //     scopedSlots: { customRender: 'operation' },
  //     width: '100px',
  //   },
]

export default {
  name: 'ProductCommon',
  components: {},
  props: {
    params: {
      type: Object,
      default: {
        dataSource: [],
        totalAmount: 0,
        chineseTotalAmount: '零',
        isTax: true,
        __fromAction: 'add',
      },
    },
  },
  data() {
    return {
      columns: columns,
      loading: false,
      data: [], //行信息
      validateData: {}, //验证行信息
      totalAmount: 0,
      chineseTotalAmount: '零',
      isTax: true,
      softProductData: [],
      throttleTotalMmountChange: null,
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    params: function () {
      this.init()
    },
  },
  methods: {
    async init() {
      let that = this
      if (this.throttleTotalMmountChange === null) {
        this.throttleTotalMmountChange = _.throttle(this.totalMmountChange, 500)
      }
      productKeyID = 0
      await this.fillSoftProduct()
      //debugger
      let dataSource = this.params.dataSource || []
      dataSource = dataSource.map((item) => Object.assign({}, item))
      for (let i = 0, len = dataSource.length; i < len; i++) {
        let _item = dataSource[i]
        productKeyID++
        _item.key = productKeyID
        _item.productVersionList = await that
          .fillSoftProductVersion(_item.productSysdicId)
          .then((result) => result.data)
        _item.tax = 8
        _item.count = 1
        let _result = that.calcNumber(_item)
        _item.oneMoney = _result.oneMoney
        _item.taxAmount = _result.taxAmount
      }

      that.data = dataSource
      that.$nextTick(() => {
        that.totalMmountChange()
      })
    },
    fillSoftProduct() {
      return getDictionary({ text: '软件产品名称' }).then((res) => {
        console.log(res)
        this.softProductData = res.data
      })
    },
    fillSoftProductVersion(dictoryId) {
      return getSoftwareProductVersions({ dictoryId: dictoryId })
    },
    productNameChange(record, e) {
      let that = this
      this.fillSoftProductVersion(e)
        .then((result) => result.data)
        .then((data) => {
          let dataSource = that.data.map((item) => Object.assign({}, item))
          let target = dataSource.find((item) => record.key === item.key)
          if (target) {
            target.productVersionList = data
            target.productSysdicId = e
            that.data = dataSource
          }
        })
    },
    productTypeChange(record, e) {
      let dataSource = this.data.map((item) => Object.assign({}, item))
      let target = dataSource.find((item) => record.key === item.key)
      if (target) {
        target['productType'] = e
        this.data = dataSource
      }
    },
    productVersionChange(record, e) {
      let isCustomized = parseInt(record.productType) === 1 ? true : false
      let val = isCustomized ? e.target.value.trim() : e
      let dataSource = this.data.map((item) => Object.assign({}, item))
      let target = dataSource.find((item) => record.key === item.key)
      if (target) {
        let _key = isCustomized ? 'productVersion' : 'productId'
        target[_key] = val
        this.data = dataSource
      }
    },
    // 添加行
    newMember() {
      productKeyID++
      this.data.push({
        key: productKeyID,
        contractId: null, //合同编号 *
        productSysdicId: '-1', //产品名称数据字典idid *
        productType: '-1', //产品类别(0标准版，1定制版) *
        productId: '-1', //软件版本号（用于类别为标准型） *
        productVersion: '', //软件版本号（用于类别为定制型 *
        productVersionList: [], //软件版本号下拉框数据源
        unitPrice: 0, //单价 *
        tax: 8, //税率默认8%
        count: 1, //数量默认 1
        oneMoney: 0, // 单价 *  数量
        taxAmount: 0, //单价 * 税率 * 数量
      })
    },
    // 删除行
    async remove(record) {
      const data = [...this.data]
      this.data = data.filter((item) => item.key !== record.key)
      if (record.id !== undefined) {
        await delSoftwareContractProduct({ id: record.id })
      }
    },
    // 输入单价后，求相乘的一行的金额
    multiplyMoney(record, e) {
      const dataSource = [...this.data]
      const target = dataSource.find((item) => item.key === record.key)
      if (target) {
        //let val = e.target.value.trim()
        target['unitPrice'] = e
        let calcObj = this.calcNumber(target)
        target['oneMoney'] = calcObj.oneMoney
        target['taxAmount'] = calcObj.taxAmount
        this.data = dataSource
        this.throttleTotalMmountChange()
      }
    },
    calcNumber(item) {
      //debugger
      let count = parseInt(item.count || 0, 10)
      let unitPrice = parseFloat(item.unitPrice || 0)
      let tax = this.isTax ? parseFloat(item.tax || 0) : 0
      let oneMoney = count * unitPrice
      let taxAmount = tax > 0 ? parseFloat(oneMoney) + parseFloat((oneMoney / 100) * tax) : oneMoney
      //不用计算含税了，，，修改为 输入的价格就包含税的价格了
      return {
        oneMoney: oneMoney,
        taxAmount: oneMoney,
      }
    },
    // 合计总金额
    totalMmountChange() {
      //debugger
      let that = this
      let hasTax = this.isTax
      let totalAmount = this.data.reduce((calc, item) => {
        return calc + (hasTax ? item.taxAmount : item.oneMoney)
      }, 0)

      totalAmount = Number(totalAmount).toFixed(2)
      this.totalAmount = totalAmount
      if (totalAmount <= 0) return
      turnTheCapital({ money: totalAmount })
        .then((res) => {
          console.log('转大写，请求后端接口结果', res)
          that.chineseTotalAmount = res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    validate() {
      return {
        error: !this.checkTabelData(),
        values: this.data.map((item) => {
          let isCustomized = parseInt(item.productType) === 1 ? true : false
          let _item = {
            productSysdicId: item.productSysdicId,
            productType: item.productType,
            unitPrice: item.unitPrice,
          }
          if (item.id !== undefined) {
            //修改流程 添加产品id
            _item.id = item.id
          }

          if (isCustomized) {
            _item['productVersion'] = item.productVersion
          } else {
            _item['productId'] = item.productId
          }
          return _item
        }),
      }
    },
    checkTabelData() {
      let i = 0,
        len = this.data.length
      if (len === 0) return false
      for (; i < len; i++) {
        let item = this.data[i]
        if (parseInt(item['productSysdicId']) === -1) {
          this.$message.error('请选择产品名称')
          return false
        }
        if (parseInt(item['productType']) === -1) {
          this.$message.error('请选择产品类别')
          return false
        }
        if (parseInt(item['productType']) === 0 && parseInt(item['productId']) === -1) {
          this.$message.error('请选择软件版本号')
          return false
        }
        if (parseInt(item['productType']) === 1 && item['productVersion'].trim().length === 0) {
          this.$message.error('请输入软件版本号')
          return false
        }
        if (parseInt(item['unitPrice']) <= 0) {
          this.$message.error('请输入金额且金额大于零')
          return false
        }
      }
      return true
    },
  },
}
</script>
<style scoped>
.product-info-wrapper .ant-form-item {
  margin-bottom: 0;
}
</style>
