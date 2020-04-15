<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
    </div>
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">产品信息</a-col>
      </a-row>
      <a-form
        :form="form"
        @submit="handleSubmit"
        class="form wdf-form"
      >
        <a-table
          bordered
          :columns="columns"
          :dataSource="data"
          :pagination="false"
          :loading="memberLoading"
        >
          <template slot="targetId" slot-scope="text, record">
            <a-input
              :value="record.targetName"
              read-only="read-only"
              @click="targetIdModel(record)"
              placeholder="请选择标的名称"
              v-decorator="[ 'targetId',{initialValue:0},{rules: [{ required: true, message: '请选择标的名称'}]} ]"/>
          </template>
          <template slot="productType" slot-scope="text,record">
            <a-select
              v-decorator="['productType',{initialValue:0},{rules: [{ required: true, message: '请选择产品类别' }]}]"
              placeholder="请选择产品类别"
              @change="typeSelectChange(record,$event)"
              style="width: 100%"
              :value="record.productType"
            >
              <a-select-option :value="0">常规产品</a-select-option>
              <a-select-option :value="1">非常规产品</a-select-option>
            </a-select>
          </template>
          <template slot="productModel" slot-scope="text, record">
            <a-input :value="text" read-only="read-only" @click="openModel(record)"
                     v-decorator="[ 'productModel',{initialValue:0},{rules: [{ required: true, message: '选择产品代码'}]} ]"/>
          </template>
          <template slot="productPic" slot-scope="text, record">
            <img style="height: 50px;lenght:40px" :src="text"/>
          </template>
          <template slot="company" slot-scope="text, record">
            <a-select
              v-decorator="['company',{initialValue:0}, {rules: [{ required: true, message: '请选择标的名称' }]}]"
              placeholder="选择单位"
              @change="companySelectChange(record,$event)"
              style="width: 100%"
              :value="record.company"
            >
              <a-select-option :value="0">套</a-select-option>
              <a-select-option :value="1">台</a-select-option>
              <a-select-option :value="2">个</a-select-option>
            </a-select>
          </template>
          <template slot="count" slot-scope="text, record">
            <a-input
              ref="count"
              :defaultValue="record.count"
              type="text"
              v-decorator="['count',{rules: [{ required: true, message: '输入数量'},{pattern:/^[0-9]*$/,message:'请输入数量'}]}
              ]"
              @change="countChange(record,$event)"
            />
          </template>

          <template slot="unitPrice" slot-scope="text, record">
            <a-input
              ref="unitPrice"
              :defaultValue="record.unitPrice"
              type="text"
              v-decorator="['unitPrice',{rules: [{ required: true, message: '输入单价'},{pattern:/^[0-9]*$/,message:'请输入数量'}]}
              ]"
              @change="multiplyMoney(record,$event)" />
          </template>

          <template slot="oneMoney" slot-scope="text, record">
            <span>{{ text }}</span>
          </template>
          <template slot="tax" slot-scope="text, record">
            <span>{{ record.tax }}</span>
          </template>
          <template slot="taxAmount" slot-scope="text, record">
            <span>{{ text }}</span>
          </template>
          <template slot="deliveryDate" slot-scope="text, record">
            <!--            <a-form-item>-->
            <a-date-picker
              format="YYYY-MM-DD"
              :defaultValue="record.deliveryDate"
              v-decorator="['deliveryDate',{rules: [{required: true, message: '选择交货日期！'}],initialValue:deliveryDate}]"
              @change="onChangeDate(record,$event)"
            />
            <!--            </a-form-item>-->
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="saveRow(record)">保存</a>
                <a-divider type="vertical"/>
                <a @click="cancel(record.key)">取消</a>
              </span>
            </template>
          </template>

        </a-table>
        <a-button
          style="width: 100%;"
          type="dashed"
          icon="plus"
          @click="newMember">新增行
        </a-button>
        <a-form-item>
          <a-row justify="start" align="middle">
            <a-col class="col-mount" :span="24">
              <a-button type="primary" @click="totalMmountChange">合计</a-button>
              <span class="span-mount">（人民币）</span>
              <span class="span-mount bigword">{{ amountInWords }}</span>
              <span class="span-mount">({{ totalMmount }})。</span>
              <span class="span-mount">此价格含质保、不含运费。</span>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item class="btns-grop">
          <a-button style="margin-left:8px;" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </a-form-item>
        <product-model ref="productModel" @custom-change="productChange" :productType="productType"></product-model>
        <targetid-model ref="targetidModel" @custom-change="targetidChange" :targetId="targetId"></targetid-model>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getQueryOne, saveProduct, getTarget, turnTheCapital, deleteQueryOne } from '@/api/contractListManagement'
import moment from 'moment'
import ProductModel from './productModel'
import TargetidModel from './targetidModel'

  export default {
    name: 'Step2',
    components: {
      ProductModel,
      TargetidModel,
    },
    props: {
      queryonedata: {
        type: Object
      }
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
          },
          {
            align: 'center',
            title: '产品类别',
            dataIndex: 'productType',
            key: 'productType',
            scopedSlots: { customRender: 'productType' },
          },
          {
            align: 'center',
            title: '产品代码',
            dataIndex: 'productModel',
            key: 'productModel',
            scopedSlots: { customRender: 'productModel' },
          },
          {
            align: 'center',
            title: '图片',
            dataIndex: 'productPic',
            key: 'productPic',
            scopedSlots: { customRender: 'productPic' },
            width: '50px'
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
            scopedSlots: { customRender: 'count' },
            width: '120px'
          },
          {
            align: 'center',
            title: '单价（元）',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            scopedSlots: { customRender: 'unitPrice' },
            width: '120px'
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
            dataIndex: 'tax',
            key: 'tax',
            scopedSlots: { customRender: 'tax' },
            width: '60px'
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
            width: '80px',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        data: [],
        memberLoading: false,
        contractId:0,
        // form
        form: this.$form.createForm(this),
        currentTab: 1,    //tab切换，当前tab
        targetList: {},     //标的选项下拉列表
        productType: 0,    //产品类型
        oneMoney: '',    //一行的金额
        taxAmount: 0,    //含税金额
        deliveryDate: moment(), // 签订日期, 默认今天
        isdisabled: false,    //税率是否可编写
        tax:0,
        openKey: 0,
        amountInWords:'零',    //大写总金额
        totalMmount:0,    //总金额
        id:0,    //主键id 唯一
        confirmLoading: false,
        targetId:0,
      }
    }
  ,
  computed: {

  },
  watch: {
    $route (to, from) {
      if (to.fullPath === '/sales-management/contract-list-management/distributionContractList') {
        this.currentTab = 0
      }
    }
  },
  created: function () {
    // debugger

    const products = this.$ls.get('products')
    if (products) {
      this.data = products.map(item => {
        item.deliveryDate = moment(item.deliveryDate)
        return item
      })
    }
  },
  mounted () {
    this.init()

    this.form.setFieldsValue({
      contractNum: this.queryonedata.contractNum || '',
      customerId: this.queryonedata.customerId || 0,
      isTax: this.queryonedata.isTax,
      billingType: this.queryonedata.billingType,
      saleUserId: this.queryonedata.saleUserId || 0,
      signDate: moment(this.queryonedata.signDate) || moment(),
      usingPlatform: this.queryonedata.usingPlatform || 0,
      contractAttribute: this.queryonedata.contractAttribute || 0,
      fullAmount: this.queryonedata.fullAmount || 0,
      contractAttribute: this.queryonedata.contractAttribute,
      products: this.queryonedata.products || []
      // contractId: this.queryonedata.contractId || 0,
      // targetId: this.queryonedata.targetId,
      // productType: item.productType,
      // productId: item.productId,
      // company:item.company,
      // count:item.count,
      // unitPrice:item.unitPrice,
      // taxRate:item.taxRate,
      // deliveryDate:this.queryonedata.deliveryDate.format('YYYY-MM-DD')
    })
    this.contractId = this.queryonedata.id
    this.id = this.queryonedata.id
    // 0不含税 1含税
    if (this.queryonedata.isTax === 0) {
      this.isdisabled = true
    }

    this.$nextTick(() => this.totalMmountChange())
  },
  methods: {
    init () {
      const that = this
      // that.getTargetSelect()
      const params = { id: that.queryonedata.id }
      getQueryOne(params).then(res => {
        this.queryOneData = res.data
        that.form.setFieldsValue({
          contractId: res.data.id,
          products: res.data.products,
          chineseTotalAmount: res.data.chineseTotalAmount,
          totalAmount: res.data.totalAmount
        })
        that.contractId = res.data.id
        that.contractAttribute = res.data.contractAttribute
        that.products = res.data.products
        that.chineseTotalAmount = res.data.chineseTotalAmount
        that.totalAmount = res.data.totalAmount
        that.id = res.data.id
      }).catch(error => {
        console.error(error)
      })
      this.form.setFieldsValue({
        products: this.queryonedata.products || '',
        chineseTotalAmount: this.queryonedata.chineseTotalAmount || '',
        totalAmount: this.queryonedata.totalAmount || ''
      })
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
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确定要放弃本条合同的创建吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          const params = { id: _this.queryonedata.id }
          deleteQueryOne(params).then((res) => {
            if (res.code == 200) {
              _this.$message.info('删除合同编辑成功')
              _this.$router.push({ name: 'distributionContractList' })
            } else {
              _this.$message.error(res.msg)
            }
          })
          console.log('OK')
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    // 点击下一步
    nextStep () {
      // debugger
      const that = this
      // tab下一步状态切换
      if (this.currentTab < 7) {
        this.currentTab += 1
      }

      if (that.data.length <= 0) {
        that.$error({
          title: '提示',
          content: '您还没有添加产品'
        })
        return
      }

      // 产品加入缓存,后续再测试处理
      try {
        that.$ls.set('products', that.data)
      } catch (err) {}

      // 拼接产品集合
      const bodys = []
      const products = that.data.map(item => {
        bodys.push({
          contractId: that.contractId,
          targetId: item.targetId,
          productType: item.productType,
          productId: item.productId,
          company: item.company,
          count: item.count,
          unitPrice: item.unitPrice,
          // taxRate:item.taxRate,
          taxRate: item.tax,
          // deliveryDate:item.deliveryDate.format('YYYY-MM-DD')
          deliveryDate: item.deliveryDate
        })
      })
      const params = {
        products: bodys // 上面拼接的商品集合
      }
      // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
      saveProduct(bodys).then((res) => {
        console.log('插入产品信息，请求后端接口结果', res)
        that.id = res.data.id
        that.loading = false
        that.form.setFieldsValue({
          contractNum: res.data.contractNum
        })
        that.$emit('nextStep', { ...res.data })
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
        productId: 0,
        requirementDescription: '',
        company: '',
        count: 0,
        unitPrice: 0, // 单价
        oneMoney: 0, // 一行产品的金额
        tax: 0, // 税率%
        taxAmount: 0, // 含税金额（元）
        deliveryDate: moment(), // 签订日期, 默认今天
        editable: true,
        isNew: true,
        productPic: '',
        productModel: '',
        contractId: this.contractId,
        productType: 0
      })
    },
    // 删除行
    remove (key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
      // 删除行要删除该行对应的价格，这样计算总价的时候才不会有错，总价重复计算了
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
      const id = this.id
      this.$emit('prevStep', id)
    },
    finish () {
      this.currentTab = 0
    },
    // 标的id的改变 弹出层
    targetIdModel (record) {
      this.openKey = record.key
      console.log('openKey :' + this.openKey)
      this.$refs.targetidModel.query({ targetId: this.targetId })
    },
    targetidChange (data) {
      console.log('JSON 页面传值事件 标的id的改变 弹出层:' + JSON.stringify(data))
      const paramter = { 'targetId': data.targetId, 'tax': data.tax }
      for (const key of this.data) {
        if (key.key == this.openKey) {
          key.targetId = data.id
          key.tax = data.tax
          key.targetName = data.text
        }
        console.log('在这之后要给targetId设置值', JSON.stringify(key))
      }

      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    //选择产品类别获取产品代码和产品图片
    typeSelectChange(record,e) {
      this.productModel = ''
      this.productType = e
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === record.key)
      target.productType = e
      for (let i = 0; i < this.data.length; i++) {
        let key = this.data[i]
        if (key.key == record.key) {
          this.data[i] = target
          key.productPic = ''
          key.productModel = ''
          key.productId  = ''
        }
      }
    }
    ,
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
    // 交货日期的改变
    onChangeDate (record, e) {
      this.deliveryDate = e.format('YYYY-MM-DD')
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === record.key)
      target.deliveryDate = e.format('YYYY-MM-DD')
      for (let i = 0; i < this.data.length; i++) {
        const key = this.data[i]
        if (key.key == record.key) {
          this.data[i] = target
        }
      }
      console.log('this.productModel', this.productModel)
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
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
          key.productId  = data.id
        }
        console.log('在这之后要给productId设置值',JSON.stringify(key))
      }
      console.log('在这之后要给productId设置值', JSON.stringify(key))
    },
    // 数量变化
    countChange (record, e) {
      this.count = this.$refs.count.stateValue // 100
      if (this.count.trim().length === 0 || isNaN(this.count.trim())) {
        return
      }
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === record.key)
      target.count = this.$refs.count.stateValue // 100
      console.log('数量变化 target.count', target.count)
      target.oneMoney = parseInt(this.$refs.unitPrice.stateValue) * parseInt(this.$refs.count.stateValue)
      target.taxAmount = Math.round((target.oneMoney * (1 + target.tax / 100)) * 100) / 100
      for (let i = 0; i < this.data.length; i++) {
        const key = this.data[i]
        if (key.key == record.key) {
          this.data[i] = target
        }
      }

      this.totalMmountChange()
    },
    // 输入单价后，求相乘的一行的金额
    multiplyMoney (record, e) {
      // debugger
      const dataSource = [...this.data]
      const target = dataSource.find(item => item.key === record.key)
      target.unitPrice = this.$refs.unitPrice.stateValue
      if (target.unitPrice.trim().length === 0 || isNaN(target.unitPrice.trim())) {
        return
      }

      target.oneMoney = parseInt(this.$refs.unitPrice.stateValue) * parseInt(this.$refs.count.stateValue)
      target.taxAmount = Math.round((target.oneMoney * (1 + target.tax / 100)) * 100) / 100
      // this.oneMoney = target.oneMoney
      console.log('target...', JSON.stringify(target))
      for (let i = 0; i < this.data.length; i++) {
        const key = this.data[i]
        if (key.key == record.key) {
          this.data[i] = target
        }
      }
      this.totalMmountChange()
    },
    // 合计总金额
    totalMmountChange () {
      // debugger
      this.totalMmount = 0
      if (this.queryonedata.isTax === 0) { // 0不含税
        for (let i = 0; i < this.data.length; i++) {
          this.totalMmount = this.totalMmount + this.data[i].oneMoney
        }
        this.totalMmount = Math.round(this.totalMmount * 100) / 100
      } else {
        // 1含税
        for (let i = 0; i < this.data.length; i++) {
          this.totalMmount = this.totalMmount + this.data[i].taxAmount
        }
        this.totalMmount = Math.round(this.totalMmount * 100) / 100
      }

      if (this.totalMmount > 0) {
        const params = {
          money: this.totalMmount
        }
        turnTheCapital(params).then((res) => {
          console.log('转大写，请求后端接口结果', res)
          this.amountInWords = res.data
        }).catch(error => {
          console.error(error)
        })
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
  .col-mount{
    border: 1px solid #ddd;
    border-top: none;
    padding:6px 16px;
  }
  .span-mount~.span-mount{
    margin-left:16px;
  }
  .bigword{
    font-weight: bold;
  }
</style>
