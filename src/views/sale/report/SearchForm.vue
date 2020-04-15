<template>
  <a-modal
    :title="modalTitle"
    :width="780"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-form :form="form" class="search-form-wrapper">
      <a-row :gutter="0">
        <a-col :span="24">基本信息</a-col>
        <a-col :span="12">
          <a-form-item label="客户名称">
            <a-input v-decorator="['customerName']" placeholder="客户名称" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="对应销售">
            <a-select
              optionFilterProp="children" 
              showSearch 
              :allowClear="true" 
              :filterOption="filterSalersOption"
              v-decorator="['saleUserId']"
              placeholder="请选择对应销售"
            >
              <a-select-option v-for="item in saleList" :value="item.userId" :key="item.userId" >{{ item.salesmanName }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="订单编号">
            <a-input v-decorator="['orderNum']" placeholder="订单编号" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="合同编号">
            <a-input v-decorator="['contractNum']" placeholder="合同编号" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="日期">
            <a-range-picker v-decorator="['sDate']" style="width:100%;" :allowClear="true"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="0">
        <a-col :span="24">产品信息</a-col>
        <a-col :span="12">
          <a-form-item label="产品名称">
            <a-input v-decorator="['productName']" placeholder="产品名称" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="规格型号">
            <a-input v-decorator="['productStand']" placeholder="规格型号" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="产品代码">
            <a-input v-decorator="['productModel']" placeholder="产品代码" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否发货">
            <a-select
              placeholder="是否发货"
              v-decorator="['sendFlag']" 
              :allowClear="true"
            >
              <a-select-option :value="0">否</a-select-option>
              <a-select-option :value="1">是</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="税率">
            <a-select
              placeholder="税率"
              v-decorator="['taxRate']" 
              :allowClear="true"
            >
              <a-select-option v-for="item in taxRateList" :key="item.id" :value="item.val" >{{item.val}}%</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否含运费">
            <a-select
              placeholder="是否含运费"
              v-decorator="['freightType']" 
              :allowClear="true"
            >
              <a-select-option :value="0">是</a-select-option>
              <a-select-option :value="1">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="0" type="flex" justify="center">
        <a-col :span="3">
          <a-button key="close" icon="close" @click="actionHandler('close')">取消</a-button>
        </a-col>
        <a-col :span="3">
          <a-button key="reload" icon="reload" @click="actionHandler('reset')">重置</a-button>
        </a-col>
        <a-col :span="3">
          <a-button key="search" type="primary" icon="search" @click="actionHandler('search')">查询</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import { listTargetTaxRate } from '@/api/saleReport'
import { getListSaleContractUser } from '@/api/contractListManagement'
export default {
  name: 'searchForm',
  components:{
  },
  data() {
    return {
      modalTitle: '高级筛选',
      visible: false,
      form: this.$form.createForm(this),
      taxRateList:[],
      saleList:[]
    }
  },
  methods: {
    query() {
      this.visible = true 
      listTargetTaxRate().then(res => {
        this.taxRateList = res.data.map((v,index) =>{
          return {index:index,val:v}
        })
      })

      getListSaleContractUser().then((res) => {
        this.saleList = res.data
      })
    },
    handleCancel() {
      this.visible = false
    },
    actionHandler(type) {
      if (type === 'close') {
        this.handleCancel()
      } else if (type === 'reset') {
        this.form.resetFields()
      } else if (type === 'search') {
        let values = this.form.getFieldsValue()
        if(Array.isArray(values.sDate) && values.sDate.length === 2){
          values.orderBeginDate = values.sDate[0].format('YYYY-MM-DD')
          values.orderEndDate = values.sDate[1].format('YYYY-MM-DD')
          delete values.sDate
        }
        console.log(values)
        this.$emit('change', values)
        this.handleCancel()
      }
    },
    filterSalersOption (input, option) { 
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  }
}
</script>
<style scoped>
.search-form-wrapper >>> .ant-form-item{
  display: flex;
}
.search-form-wrapper >>> .ant-form-item-control-wrapper{
  flex: 1;
}
.search-form-wrapper >>> .ant-form-item-label{
  display: inline-block;
  width: 120px;
}

</style>