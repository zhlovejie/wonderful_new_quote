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
      <span class="section-title">基本信息</span>
      <a-divider style="margin-top: 10px;" />
      <a-row :gutter="0">
        <a-col :span="12">
          <a-form-item label="派送货单号" v-if="+tabKey === 1">
            <a-input v-decorator="['deliveryNoteNo']" placeholder="请输入派送货单号" :allowClear="true" />
          </a-form-item>
          <a-form-item label="提货单号" v-else>
            <a-input v-decorator="['pickUpNo']" placeholder="请输入提货单号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="出库单号" v-if="+tabKey === 1">
            <a-input v-decorator="['exWarehouseNo']" placeholder="请输入出库单号" :allowClear="true" />
          </a-form-item>
          <a-form-item label="我方负责人" v-else>
            <a-input v-decorator="['headName']" placeholder="请输入采购负责人" :allowClear="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="委外加工单号">
            <a-input v-decorator="['orderNo']" placeholder="请输入委外加工单号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="加工商名称">
            <a-input v-decorator="['facName']" placeholder="请输入加工商名称" :allowClear="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <span class="section-title">物料信息</span>
      <a-divider style="margin-top: 10px;" />
      <a-row>
        <!-- 'attribute', //属性（1原材料 2模具 3成品） -->
        <a-col :span="12">
          <a-form-item label="属性">
            <a-select placeholder="请选择属性" v-decorator="['attribute']" :allowClear="true">
              <a-select-option :value="1">原材料</a-select-option>
              <a-select-option :value="2">模具</a-select-option>
              <a-select-option v-if="+tabKey === 2" :value="3">成品</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="物料名称">
            <a-input v-decorator="['materialName']" placeholder="请输入物料名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="物料代码">
            <a-input v-decorator="['materialCode']" placeholder="请输入物料代码" :allowClear="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <span class="section-title">运输信息</span>
      <a-divider style="margin-top: 10px;" />
      <a-row>
        <a-col :span="12">
          <a-form-item label="加工商地址">
            <a-input v-decorator="['facAddress']" placeholder="请输入加工商地址" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="运费结算方式">
            <a-select v-decorator="['freightSettlementMethod']" placeholder="请选择运费结算方式" :allowClear="true">
              <a-select-option :value="0">代付</a-select-option>
              <a-select-option :value="1">包邮</a-select-option>
              <a-select-option :value="2">到付</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="+tabKey === 2">
        <a-col :span="12">
          <a-form-item label="业务员">
            <a-input v-decorator="['salesmanName']" placeholder="请输入加工商业务员名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="业务员电话">
            <a-input v-decorator="['salesmanPhone']" placeholder="请输入业务员电话" :allowClear="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12" v-if="+tabKey === 1">
          <a-form-item label="负责人">
            <a-input v-decorator="['headName']" placeholder="请输入采购负责人" :allowClear="true" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="tabKey===1?'预计发货日期':'预计提货日期'">
            <a-range-picker v-decorator="['deliveryTime']" style="width: 100%" :allowClear="true" />
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
export default {
  name: 'SearchForm',
  components: {},
  data() {
    return {
      modalTitle: '高级筛选',
      visible: false,
      form: this.$form.createForm(this),
      tabKey: 1
    }
  },
  methods: {
    // tabKey:1:派送单 2:提货单
    query(tabKey) {
      this.tabKey = tabKey
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
        console.log(values)
        let startTime = undefined
        let endTime = undefined
        if (Array.isArray(values.deliveryTime) && values.deliveryTime.length === 2) {
          startTime = values.deliveryTime[0].format('YYYY-MM-DD')
          endTime = values.deliveryTime[1].format('YYYY-MM-DD')
        }
        if (+this.tabKey === 1) {
          //派送单 高级检索
          values.startDeliveryTime = startTime
          values.endDeliveryTime = endTime
        } else {
          //提货单 高级检索
          values.pickUpBeginTime = startTime
          values.pickUpEndTime = endTime
        }
        delete values.deliveryTime
        console.log(values)
        this.$emit('change', values)
        this.handleCancel()
      }
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>

<style scoped>
.search-form-wrapper >>> .ant-form-item {
  display: flex;
}
.search-form-wrapper >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.search-form-wrapper >>> .ant-form-item-label {
  display: inline-block;
  width: 120px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
}
</style>
