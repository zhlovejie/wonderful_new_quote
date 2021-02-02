<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="prevStep" icon="backward">返回</a-button>
    </div>
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">产品信息</a-col>
      </a-row>
      <a-form :form="form" @submit="handleSubmit" class="form wdf-form">
        <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading">
          <template v-if="record.editable" slot="targetId" slot-scope="text, record">
            <a-select
              v-decorator="['targetId', { rules: [{ required: true, message: '请选择标的名称' }] }]"
              placeholder="请选择标的名称"
              @change="idSelectChange(record, $event)"
              style="width: 100%"
            >
              <a-select-option v-for="item in targetList" :key="item.id">{{ item.text }}</a-select-option>
            </a-select>
          </template>
          <template v-else>{{ record.target.text }}</template>
          <template slot="productType" slot-scope="text, record">
            <a-select
              v-decorator="['productType', { rules: [{ required: true, message: '请选择产品类别' }] }]"
              placeholder="请选择产品类别"
              @change="typeSelectChange(record, $event)"
              style="width: 100%"
            >
              <a-select-option :value="0">常规产品</a-select-option>
              <a-select-option :value="1">非常规产品</a-select-option>
            </a-select>
          </template>
          <template slot="productModel" slot-scope="text, record">
            <a-input
              :value="text"
              read-only="read-only"
              @click="openModel(record)"
              v-decorator="['productModel', { rules: [{ required: true, message: '选择产品代码' }] }]"
            />
          </template>
          <template slot="productPic" slot-scope="text, record">
            <img style="height: 50px; lenght: 40px" :src="text" />
          </template>
          <template slot="colour" slot-scope="text, record">
            <a-input v-model="colour" placeholder="常规色" />
          </template>
          <template slot="company" slot-scope="text, record">
            <a-select
              v-decorator="['company', { rules: [{ required: true, message: '请选择标的名称' }] }]"
              placeholder="选择单位"
              @change="companySelectChange(record, $event)"
              style="width: 100%"
            >
              <a-select-option :value="0">套</a-select-option>
              <a-select-option :value="1">台</a-select-option>
              <a-select-option :value="2">个</a-select-option>
            </a-select>
          </template>
          <template slot="count" slot-scope="text, record">
            <a-input
              ref="count"
              v-decorator="['count', { rules: [{ required: true, message: '输入数量', pattern: /^[1-9]\d*$/ }] }]"
              @change="countChange(record, $event)"
            />
          </template>
          <template slot="unitPrice" slot-scope="text, record">
            <a-input
              ref="unitPrice"
              v-decorator="['unitPrice', { rules: [{ required: true, message: '输入单价', pattern: /^[1-9]\d*$/ }] }]"
              @change="multiplyMoney(record, $event)"
            />
          </template>
          <template slot="oneMoney" slot-scope="text, record">
            <span>{{ text }}</span>
          </template>
          <template slot="taxRate" slot-scope="text, record">
            <a-select
              v-decorator="['taxRate', { rules: [{ required: true, message: '选择税率' }] }]"
              placeholder="选择税率"
              @change="taxRateSelectChange(record, $event)"
              style="width: 100%"
              :disabled="isdisabled"
            >
              <a-select-option :value="0">选择税率</a-select-option>
              <a-select-option :value="8">8</a-select-option>
              <a-select-option :value="11">11</a-select-option>
            </a-select>
          </template>
          <template slot="taxAmount" slot-scope="text, record">
            <span>{{ text }}</span>
          </template>
          <template slot="deliveryDate" slot-scope="text, record">
            <a-date-picker
              v-decorator="[
                'deliveryDate',
                { rules: [{ required: true, message: '选择交货日期！' }], initialValue: deliveryDate },
              ]"
            />
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a @click="saveRow(record)">添加</a>
                <a-divider type="vertical" />
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="saveRow(record)">保存</a>
                <a-divider type="vertical" />
                <a @click="cancel(record.key)">取消</a>
              </span>
            </template>
            <span v-else>
              <a @click="toggle(record.key)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember"
          >新增行
        </a-button>
        <a-form-item class="btns-grop">
          <a-button type="primary" @click="nextStep">下一步</a-button>
          <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
        </a-form-item>
        <product-model ref="productModel" @custom-change="productChange" :productType="productType"></product-model>
      </a-form>
    </div>
  </div>
</template>

<script>
import { saveProduct } from '@/api/contractListManagement'
import moment from 'moment'
import ProductModel from './productModel'

export default {
  name: 'Step2',
  components: {
    ProductModel
  },
  props: {
    queryonedata: {
      type: Object
    }
  },
  data () {
    return {
      // table
      columns: [
        {
          align: 'center',
          title: '标的名称',
          dataIndex: 'targetId',
          key: 'targetId',
          scopedSlots: { customRender: 'targetId' },
          width: 100
        },
        {
          align: 'center',
          title: '产品类别',
          dataIndex: 'productType',
          key: 'productType',
          scopedSlots: { customRender: 'productType' },
          width: 100
        },
        {
          align: 'center',
          title: '产品代码',
          dataIndex: 'productModel',
          key: 'productModel',
          scopedSlots: { customRender: 'productModel' },
          width: 100
        },
        {
          align: 'center',
          title: '图片',
          dataIndex: 'productPic',
          key: 'productPic',
          scopedSlots: { customRender: 'productPic' },
          width: '70px'
        },
        {
          align: 'center',
          title: '颜色',
          dataIndex: 'colour',
          key: 'colour',
          scopedSlots: { customRender: 'colour' }
        },
        {
          align: 'center',
          title: '单位',
          dataIndex: 'company',
          key: 'company',
          scopedSlots: { customRender: 'company' },
          width: '80px'
        },
        {
          align: 'center',
          title: '数量',
          dataIndex: 'count',
          key: 'count',
          scopedSlots: { customRender: 'count' }
        },
        {
          align: 'center',
          title: '单价（元）',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' }
        },
        {
          align: 'center',
          title: '金额（元）',
          dataIndex: 'oneMoney',
          key: 'oneMoney',
          scopedSlots: { customRender: 'oneMoney' }
        },
        {
          align: 'center',
          title: '税率%',
          dataIndex: 'taxRate',
          key: 'taxRate',
          scopedSlots: { customRender: 'taxRate' },
          width: '90px'
        },
        {
          align: 'center',
          title: '含税金额（元）',
          dataIndex: 'taxAmount',
          key: 'taxAmount',
          scopedSlots: { customRender: 'taxAmount' }
        },
        {
          align: 'center',
          title: '交货日期',
          dataIndex: 'deliveryDate',
          key: 'deliveryDate',
          scopedSlots: { customRender: 'deliveryDate' },
          width: '146px'
        },
        {
          title: '操作',
          key: 'action',
          width: '110px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      memberLoading: false,
      // form
      form: this.$form.createForm(this),
      currentTab: 1, // tab切换，当前tab
      targetList: {}, // 标的选项下拉列表
      targetId: 0, // 选中的标的id
      productType: 0, // 产品类型
      productPic: '', // 图片地址
      productModel: '', // 产品代码
      colour: '常规色',
      oneMoney: '', // 一行的金额
      taxAmount: '', // 含税金额
      deliveryDate: moment(), // 签订日期, 默认今天
      isdisabled: false, // 税率是否可编写
      openKey: 0
    }
  },
  computed: {},
  watch: {},
  mounted () {
    this.init()
    this.form.setFieldsValue({
      isTax: this.queryonedata.isTax
    })
    // 0不含税 1含税
    if (this.queryonedata.isTax === 0) {
      this.isdisabled = true
      // 税率和含税金额不展示
    }
    console.log('从step1传给父，又从父传给step2的是否含税', this.queryonedata.isTax)
  },
  methods: {
    init () {
      this.getTargetSelect()
    },
    data() {
      return {
        // table
        columns: [
          {
            align: 'center',
            title: '标的名称',
            dataIndex: 'targetId',
            key: 'targetId',
            scopedSlots: { customRender: 'targetId' },
            width: 100
          },
          {
            align: 'center',
            title: '产品类别',
            dataIndex: 'productType',
            key: 'productType',
            scopedSlots: { customRender: 'productType' },
            width: 100
          },
          {
            align: 'center',
            title: '产品代码',
            dataIndex: 'productModel',
            key: 'productModel',
            scopedSlots: { customRender: 'productModel' },
            width: 100
          },
          {
            align: 'center',
            title: '图片',
            dataIndex: 'productPic',
            key: 'productPic',
            scopedSlots: { customRender: 'productPic' },
            width: '70px'
          },
          {
            align: 'center',
            title: '颜色',
            dataIndex: 'colour',
            key: 'colour',
            scopedSlots: { customRender: 'colour' }
          },
          {
            align: 'center',
            title: '单位',
            dataIndex: 'company',
            key: 'company',
            scopedSlots: { customRender: 'company' },
            width: '80px'
          },
          {
            align: 'center',
            title: '数量',
            dataIndex: 'count',
            key: 'count',
            scopedSlots: { customRender: 'count' }
          },
          {
            align: 'center',
            title: '单价（元）',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            scopedSlots: { customRender: 'unitPrice' }
          },
          {
            align: 'center',
            title: '金额（元）',
            dataIndex: 'oneMoney',
            key: 'oneMoney',
            scopedSlots: { customRender: 'oneMoney' }
          },
          {
            align: 'center',
            title: '税率%',
            dataIndex: 'taxRate',
            key: 'taxRate',
            scopedSlots: { customRender: 'taxRate' },
            width: '90px'
          },
          {
            align: 'center',
            title: '含税金额（元）',
            dataIndex: 'taxAmount',
            key: 'taxAmount',
            scopedSlots: { customRender: 'taxAmount' }
          },
          {
            align: 'center',
            title: '交货日期',
            dataIndex: 'deliveryDate',
            key: 'deliveryDate',
            scopedSlots: { customRender: 'deliveryDate' },
            width: '146px'
          },
          {
            title: '操作',
            key: 'action',
            width: '110px',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        data: [],
        memberLoading: false,
        // form
        form: this.$form.createForm(this),
        currentTab: 1,    //tab切换，当前tab
        targetList: {},     //标的选项下拉列表
        targetId: 0,    //选中的标的id
        productType: 0,    //产品类型
        productPic: '',    //图片地址
        productModel: '',    //产品代码
        colour: '常规色',
        oneMoney: '',    //一行的金额
        taxAmount: '',    //含税金额
        deliveryDate: moment(), // 签订日期, 默认今天
        isdisabled: false,    //税率是否可编写
        openKey: 0
      }
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    // 返回
    goBack () {
      this.$router.push({ name: 'basicInformation2' })
    },
    // 点击下一步
    nextStep () {
      const { form: { validateFields } } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          // tab下一步状态切换
          if (this.currentTab < 7) {
            this.currentTab += 1
          }
          const params = {
            contractNum: values.contractNum,
            customerId: values.customerId,
            saleUserId: values.saleUserId,
            isTax: values.isTax,
            billingType: values.billingType,
            signDate: values.signDate.format('YYYY-MM-DD'), // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
            usingPlatform: values.usingPlatform,
            contractAttribute: values.contractAttribute,
            fullAmount: values.fullAmount
          }
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveProduct(params).then((res) => {
            console.log('校验成功，保存填写的信息，请求后端接口结果', res)
            this.$router.push({ name: 'Step2', params: { isTax: this.isTax } })
          }).catch(error => {
            console.error(error)
          })
        }
      })
    },
    // 这个应该是点击下一步全页面提交
    validate () {
      // 验证子组件的输入是否有效并且获取子组件的数据
      const BasicPricingInformation = this.$refs['BasicPricingInformation']

      BasicPricingInformation.validForm()
      const { status, ...data } = this.newBasicInfo
      if (status === 'error') {
        console.error('error')
        return false
      }
      console.log('获取子组件的数据:', data)

      this.form.validateFields((err, values) => {
        console.log('点击提交，看看获取父页面那些信息', values)

        if (!err) {

        } else {
          return false
        }
      })

      this.priceOrderSubmit()
    },
    // 点击提交：信息添加
    priceOrderSubmit () {
      const {
        code,
        consumerId,
        demandTime
      } = this.newBasicInfo

      // 拼接商品集合
      const valencyProducts = this.data.map(item => {
        return {
          basisModel: item.targetId,
          demandNumber: item.quantityRequired,
          specs: item.productId,
          demandRemarks: item.requirementDescription,
          referencePic: item.company
        }
      })
      const params = {
        valencyCode: code,
        consumerId: consumerId,
        demandTime: demandTime, // 需求日期，日期格式：yyyy-MM-dd

        valencyUserId: this.form.getFieldValue('valencyUserId'),
        demandRemarks: this.form.getFieldValue('demandRemarks'),

        valencyProducts: valencyProducts, // 上面拼接的商品集合
        explainText: this.form.getFieldValue('explainText')

      }
      console.log('点击提交：核价订单添加params:', params)
      this.loading = true
      priceOrderAdd(params).then((res) => {
        console.log('提交申请请求接口的结果', res)
        this.$router.push({ name: 'pricing' })
      }).catch(error => {
        console.error(error)
      })
    },
    // 添加行
    newMember () {
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        // index:length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        targetId: '',
        quantityRequired: '',
        productId: '',
        requirementDescription: '',
        colour: '',
        company: '',
        count: 0,
        unitPrice: 0, // 单价
        oneMoney: 0, // 一行产品的金额
        taxRate: 0, // 税率%
        taxAmount: 0, // 含税金额（元）
        deliveryDate: moment(), // 签订日期, 默认今天
        editable: true,
        isNew: true,
        productPic: '',
        productModel: ''
      })
    },
    // 删除行
    remove (key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    // 保存行
    saveRow (record) {
      this.memberLoading = true
      // const { key, targetId, productType, productId, colour,company,count,unitPrice,taxRate,deliveryDate } = record
      const { key, targetId, productType, productId, colour, company, count, unitPrice, taxRate, deliveryDate } = record
      // if (!targetId || !productType || !productId || !colour || !company|| !count||!unitPrice || !taxRate || !taxRate ||!deliveryDate) {
      //  if (!targetId || !productType || !colour || !company|| !count||!unitPrice || !taxRate || !taxRate ||!deliveryDate) {
      //     this.memberLoading = false
      //     // 必填项:
      //     this.$message.error('请填写完整信息。')
      //     return
      //   }

      // 模拟网络请求、卡顿 800ms
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 800)
      }).then(() => {
        const target = this.data.find(item => item.key === key)

        target.editable = false
        target.isNew = false
        this.data.splice(Number(key), 1, target)
        this.memberLoading = false
      })
    },
    // 编辑行
    toggle (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    // 取消编辑行操作
    cancel (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    // 行输入数据内容变化监听事件
    handleChange (value, key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        // target[column] = value
        target[0] = value
        this.data = newData
      }
    },

    // 上一步
    prevStep () {
      this.$emit('prevStep')
    },
    finish () {
      this.currentTab = 0
    },
    // 标的id改变
    idSelectChange (record, e) {
      this.targetId = e
      console.log('标的id改变', this.targetId)
      console.log('标的id改变----', JSON.stringify(e))
      const dataSource = [...this.data]
      console.log('标的id改变dataSource...', JSON.stringify(dataSource))
      const target = dataSource.find(item => item.key === record.key)
      target.targetId = e
      for (let i = 0; i < this.data.length; i++) {
        const key = this.data[i]
        if (key.key == record.key) {
          this.data[i] = target
        }
      },
      //选择产品类别获取产品代码和产品图片
      typeSelectChange(record,e) {
        this.productType = e
        const dataSource = [...this.data]
        const target = dataSource.find(item => item.key === record.key)
        target.productType = e
        for (let i = 0; i < this.data.length; i++) {
          let key = this.data[i]
          if (key.key == record.key) {
            this.data[i] = target
          }
        }
      }
    },
    // 单位的改变
    companySelectChange (record, e) {
      this.company = e
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === record.key)
      target.company = e
      for (let i = 0; i < this.data.length; i++) {
        const key = this.data[i]
        if (key.key == record.key) {
          this.data[i] = target
        }
      }
    },
    // 税率的改变
    taxRateSelectChange (record, e) {
      this.taxRate = e
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === record.key)
      target.taxRate = e
      target.taxAmount = Math.round((parseInt(this.oneMoney) * (1 + e / 100)) * 100) / 100
      // console.log('税率的改变target...', JSON.stringify(target))
      for (let i = 0; i < this.data.length; i++) {
        const key = this.data[i]
        if (key.key == record.key) {
          this.data[i] = target
        }
      },
      //产品代码弹出框
      openModel(record) {
        this.openKey = record.key
        console.log('openKey :' + this.openKey)
        this.$refs.productModel.query({ productType: this.productType })
      },
      productChange(data) {
        console.log('JSON 页面传值事件:' + JSON.stringify(data))
        const paramter = { 'productModel': data.productModel, 'productPic': 'productPic' }
        for (let key of this.data) {
          if (key.key == this.openKey) {
            key.productPic = data.productPic
            key.productModel = data.productModel
          }
          console.log(JSON.stringify(key))
        }
        console.log(JSON.stringify(key))
      }
      console.log('this.productModel', this.productModel)
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    // 数量变化
    countChange (record, e) {
      this.count = e.data
      this.count = this.$refs.count.stateValue
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === record.key)
      target.count = this.$refs.count.stateValue
      target.count = e.data
      this.count = target.count
      for (let i = 0; i < this.data.length; i++) {
        const key = this.data[i]
        if (key.key == record.key) {
          this.data[i] = target
        }
      }
    },
    // 输入单价后，求相乘的一行的金额
    multiplyMoney (record, e) {
      console.log('e...', JSON.stringify(e))
      const dataSource = [...this.data]
      console.log('dataSource...', JSON.stringify(dataSource))
      const target = dataSource.find(item => item.key === record.key)
      target.unitPrice = this.$refs.unitPrice.stateValue
      target.unitPrice = e.data
      target.oneMoney = parseInt(this.$refs.unitPrice.stateValue) * parseInt(this.count)
      this.oneMoney = target.oneMoney
      console.log('target...', JSON.stringify(target))
      for (let i = 0; i < this.data.length; i++) {
        const key = this.data[i]
        if (key.key == record.key) {
          this.data[i] = target
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.wdf-row {
  border: 1px solid #ddd;
}

.wdf-form {
  margin-top: 12px;
  padding: 12px;
}

.btns-grop {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
}

.btns-grop button:not(first-child) {
  margin-left: 12px;
}
</style>
