<template>
  <div>
    <div class="top-right clearfix">
      <a-button
        class="fl-r"
        v-if="!show"
        type="primary"
        @click="addClick"
        :loading="loading"
        icon="check">提交</a-button>
      <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
      <a-button v-show="record.approvalStatus == 2 && $auth('distributionContract:changeProduct')" class="fl-r" type="primary" @click="splitOrderAction" icon="backward">拆分订单</a-button>
    </div>
    <a-card class="card" title="产品信息" :bordered="false">
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item hidden>
              <a-input v-decorator="[ 'contractId' ]"/>
            </a-form-item>
            <a-form-item
              label="订单编号">
              <a-input read-only="read-only" v-decorator="[ 'orderNum', {} ]"/>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="客户名称">
              <a-input read-only="read-only" v-decorator="[ 'customerName', {} ]"/>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="合同编号">
              <a-input read-only="read-only" v-decorator="[ 'contractNum', {} ]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item
              label="发票类型">
              <a-select disabled v-decorator="[ 'billingType', {} ]">
                <a-select-option :value="0">普票</a-select-option>
                <a-select-option :value="1">增票</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="是否使用我方平台">
              <a-select disabled v-decorator="[ 'contractAttribute', {} ]">
                <a-select-option :value="0">是</a-select-option>
                <a-select-option :value="1">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="销售经理">
              <a-input read-only="read-only" v-decorator="[ 'saleUserName', {} ]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item
              label="签订日期">
              <a-input read-only="read-only" v-decorator="[ 'orderCreatedTime', {} ]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        rowKey="id"
        :loading="memberLoading"
        bordered
      >
        <div slot="order" slot-scope="text,record,index">
          <span>{{ index+1 }}</span>
        </div>

        <div slot="productType" slot-scope="text">
          <span v-if="text==0">常规产品</span>
          <span v-if="text==1">非常规产品</span>
        </div>
        <div slot="company" slot-scope="text">
          <span v-if="text==0">套</span>
          <span v-if="text==1">台</span>
          <span v-if="text==2">个</span>
        </div>
        <template slot="deliveryDate" slot-scope="text, record">
          <a-date-picker :disabled="show" format="YYYY-MM-DD" :value="record.deliveryDate ? moment(record.deliveryDate) : moment()" @change="onChangeDate(record,$event)"/>
        </template>
        <div slot="productStatus" slot-scope="text,record">
          <a-select :disabled="show" style="width: 100px" v-model="record.productStatus">
            <a-select-option v-for="item in record.productStatusList" :key="item.id" :value="item.id">{{ item.name }}
            </a-select-option>
          </a-select>
        </div>
        <div slot="remarks" slot-scope="text,record">
          <a-textarea :disabled="show" v-model="record.remarks" ></a-textarea>
        </div>
      </a-table>

    </a-card>
  </div>
</template>

<script>

import EditableCell from '@/components/Table/EditableCell'
import { save, orderDownload, orderDetail } from '@/api/order'
import { getQueryOne } from '@/api/contractListManagement'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import moment from 'moment'

const data = []
export default {
  name: 'OrderModule',
  components: {
    ATextarea,
    AFormItem,
    EditableCell
  },
  data () {
    return {
      form: this.$form.createForm(this),
      memberLoading: false,
      record: {},
      loading: false,
      show: false,
      params: 0,
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '分类',
          dataIndex: 'targetName'
        },
        {
          title: '产品类别',
          dataIndex: 'productType',
          scopedSlots: { customRender: 'productType' }
        },
        {
          title: '产品代码',
          dataIndex: 'productModel'
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          scopedSlots: { customRender: 'productName' }
        }, {
          title: '规格型号',
          dataIndex: 'productStandard'
        }, {
          title: '单位',
          dataIndex: 'company',
          scopedSlots: { customRender: 'company' }
        }, {
          title: '数量',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' }
        }, {
          title: '交货日期',
          dataIndex: 'deliveryDate',
          scopedSlots: { customRender: 'deliveryDate' }
        }, {
          title: '产品状态',
          dataIndex: 'productStatus',
          scopedSlots: { customRender: 'productStatus' }
        }, {
          title: '备注',
          dataIndex: 'remarks',
          scopedSlots: { customRender: 'remarks' }
        }
      ],
      type: 2,
      dataSource: []
    }
  },
  mounted () {
    this.edit()
  },
  methods: {
    moment:moment,
    edit () {
      //debugger
      let params = Object.assign({},this.$route.params)
      this.show = params.show
      this.type = params.type

      let _contractId = params.contractId || params.id
      orderDetail({contractId:_contractId}).then(res =>{
        if (res.code === 200) {
          this.record = res.data
          this.$nextTick(() => this.fillData())
        }
      })
    },
    fillData(){
      this.$nextTick(() => {
        this.form.setFieldsValue({ orderNum: this.record.orderNum })
        this.form.setFieldsValue({ customerName: this.record.customerName })
        this.form.setFieldsValue({ contractNum: this.record.contractNum })
        this.form.setFieldsValue({ billingType: this.record.billingType })
        this.form.setFieldsValue({ contractAttribute: this.record.contractAttribute })
        this.form.setFieldsValue({ saleUserName: this.record.saleUserName })
        this.form.setFieldsValue({ orderCreatedTime: this.record.orderCreatedTime })
      })
      const listProduct = []
      var status = [{ 'id': 0, 'name': '待生产' }, { 'id': 1, 'name': '现货' }]
      for (const productKey in this.record.products) {
        const product = this.record.products[productKey]
        listProduct.push({
          'id': product.id,
          'targetName': product.targetName,
          'productType': product.productType,
          'productName': product.productName,
          'productModel': product.productModel,
          'productStandard': product.productStandard,
          'company': product.company,
          'count': product.count,
          'deliveryDate': product.deliveryDate,
          'productStatusList': status,
          'productStatus': product.productStatus,
          'remarks': product.remarks
        })
      }
      this.dataSource = listProduct
    },
    // 返回
    goBackPricing () {
      if (this.type != 1) {
        this.$router.push({ name: 'order' })
        this.$destroy('orderModule')
      } else {
        this.$router.push({ name: 'distributionContractList' })
        this.$destroy('orderModule')
      }
    },
    addClick () {
      for (const source in this.dataSource) {
        const param = {}
        const product = this.dataSource[source]
        this.$set(param, 'id', product.id)
        this.$set(param, 'productStatus', product.productStatus)
        this.$set(param, 'remarks', product.remarks)
        this.$set(param, 'deliveryDate',this.moment(product.deliveryDate).format('YYYY-MM-DD'))
        save(param).then((res) => {
          if (res.code == 200) {
            const params = { 'id': this.record.id }
            orderDownload(params).then((res) => {
            })
          }
        })
      }
      this.$router.push({ name: 'order' })
    },
    splitOrderAction(){ //拆分订单
      this.$router.push({ name: 'basicInformation1', params: { id:  this.record.id , show:this.show, action:'split' , from : 'orderModule'}})
    },
        // 交货日期的改变
    onChangeDate (record, e) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.key === record.key)
      if (target) {
        target['deliveryDate'] = e
        this.dataSource = dataSource
      }
    },
  }
}
</script>
<style lang="less" scoped>
  .top-right {
    margin-bottom: 12px;
    margin-right: 6px;
  }

  .clearfix:after {
    display: block;
    content: '';
    width: 100%;
    height: 0;
    clear: both;
  }

  .clearfix {
    zoom: 1;
  }

  .fl-r {
    float: right;
    margin-left: 8px;
  }
</style>
