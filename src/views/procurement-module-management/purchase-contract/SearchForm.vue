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
          <a-form-item label="合同编号">
            <a-input v-decorator="['contractNum']" placeholder="合同编号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="供应商名称">
            <a-input v-decorator="['supplierName']" placeholder="供应商名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否含税">
            <a-radio-group v-decorator="['taxType']">
              <a-radio :value="0">否</a-radio>
              <a-radio :value="1">是</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否含运费">
            <a-radio-group v-decorator="['freightType']">
              <a-radio :value="0">否</a-radio>
              <a-radio :value="1">是</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="发票类型">
            <a-select placeholder="发票类型" v-decorator="['invoiceType']" :allowClear="true">
              <a-select-option :value="1">不限</a-select-option>
              <a-select-option :value="2">增值税专用发票</a-select-option>
              <a-select-option :value="3">普通发票</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="结算方式">
            <a-select placeholder="结算方式" v-decorator="['settlementMode']" :allowClear="true">
              <a-select-option :value="0">现款现货</a-select-option>
              <a-select-option :value="1">账期结算</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="货运方式">
            <CommonDictionarySelect
              placeholder="货运方式"
              style="width: 100%"
              allowClear
              :text="'物料类别'"
              :dictionaryId.sync="queryParam.logisticsTypeId"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="采购员">
            <a-input v-decorator="['purchaseUserName']" placeholder="采购员" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="签订日期">
            <a-range-picker v-decorator="['signDate']" style="width:100%;" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="提交日期">
            <a-range-picker v-decorator="['createdDate']" style="width:100%;" :allowClear="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="0">
        <a-col :span="24">物料信息</a-col>
        <a-col :span="12">
          <a-form-item label="采购需求单号">
            <a-input v-decorator="['orderNum']" placeholder="采购需求单号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="物料代码">
            <a-input v-decorator="['materialCode']" placeholder="物料代码" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="物料名称">
            <a-input v-decorator="['materialName']" placeholder="物料名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="品牌型号">
            <a-input v-decorator="['model']" placeholder="品牌型号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="预计交货日期">
            <a-range-picker v-decorator="['deliveryDate']" style="width:100%;" :allowClear="true" />
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
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
export default {
  name: 'searchForm',
  components: {
    CommonDictionarySelect
  },
  data() {
    return {
      modalTitle: '高级筛选',
      visible: false,
      form: this.$form.createForm(this),
      taxRateList: [],
      saleList: [],
      queryParam: {}
    }
  },
  methods: {
    query() {
      this.visible = true
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
        values = {
          ...values,
          ...this.queryParam
        }
        if (Array.isArray(values.deliveryDate) && values.deliveryDate.length === 2) {
          values.startDeliveryDate = values.deliveryDate[0].format('YYYY-MM-DD')
          values.endDeliveryDate = values.deliveryDate[1].format('YYYY-MM-DD')
          delete values.deliveryDate
        } else {
          values.startDeliveryDate = undefined
          values.endDeliveryDate = undefined
          delete values.deliveryDate
        }

        if (Array.isArray(values.signDate) && values.signDate.length === 2) {
          values.startSignDate = values.signDate[0].format('YYYY-MM-DD')
          values.endSignDate = values.signDate[1].format('YYYY-MM-DD')
          delete values.signDate
        } else {
          values.startSignDate = undefined
          values.endSignDate = undefined
          delete values.signDate
        }

        if (Array.isArray(values.createdDate) && values.createdDate.length === 2) {
          values.startCreatedTime = values.createdDate[0].format('YYYY-MM-DD')
          values.endCreatedTime = values.createdDate[1].format('YYYY-MM-DD')
          delete values.createdDate
        } else {
          values.startCreatedTime = undefined
          values.endCreatedTime = undefined
          delete values.createdDate
        }
        console.log(values)
        this.$emit('change', values)
        this.handleCancel()
      }
    }
  }
}
</script>
<style scoped>
.search-form-wrapper >>> .ant-form-item {
  display: flex;
  margin-bottom: 5px;
}
.search-form-wrapper >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.search-form-wrapper >>> .ant-form-item-label {
  display: inline-block;
  width: 120px;
}
</style>
