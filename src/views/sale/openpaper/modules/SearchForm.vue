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
          <a-form-item label="销售经理">
            <a-select
              optionFilterProp="children"
              showSearch
              :allowClear="true"
              :filterOption="filterSalersOption"
              placeholder="销售经理"
              style="width: 100%"
              v-decorator="['saleUserId']"
            >
              <a-select-option v-for="item in saleUser" :value="item.userId" :key="item.userId">{{
                item.salesmanName
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="客户名称">
            <a-input v-decorator="['customerName']" placeholder="客户名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="开票编号">
            <a-input v-decorator="['paperCode']" placeholder="开票编号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="isShowApproveStatus">
          <a-form-item label="单据状态">
            <a-select v-decorator="['approvalStatue']" placeholder="单据状态" :allowClear="true">
              <a-select-option :value="1">待审批</a-select-option>
              <a-select-option :value="2">通过</a-select-option>
              <a-select-option :value="3">不通过</a-select-option>
              <a-select-option :value="9">已撤回</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="发票类型">
            <a-select v-decorator="['paperType']" placeholder="选择发票类型" :allowClear="true">
              <a-select-option :value="1">增票</a-select-option>
              <a-select-option :value="2">普票</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="开票性质">
            <a-select v-decorator="['paperQuality']" placeholder="选择开票性质" :allowClear="true">
              <a-select-option :value="1">常规开票</a-select-option>
              <a-select-option :value="2">特殊开票</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否已结">
            <a-select v-decorator="['paperIsend']" placeholder="选择是否已结" :allowClear="true">
              <a-select-option :value="1">未完结</a-select-option>
              <a-select-option :value="2">已完结</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item label="申请时间">
            <a-range-picker v-decorator="['sDate']" style="width: 100%" :allowClear="true" />
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
import { getListSaleContractUser } from '@/api/contractListManagement'
export default {
  name: 'searchForm',
  components: {},
  data() {
    return {
      modalTitle: '高级筛选',
      visible: false,
      form: this.$form.createForm(this),
      saleUser: [],
      isShowApproveStatus: false,
    }
  },
  methods: {
    query(tabKey) {
      this.isShowApproveStatus = +tabKey === 0
      this.visible = true
      getListSaleContractUser().then((res) => (this.saleUser = res.data))
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
        if (Array.isArray(values.sDate) && values.sDate.length === 2) {
          values.startTime = values.sDate[0].format('YYYY-MM-DD')
          values.endTime = values.sDate[1].format('YYYY-MM-DD')
          delete values.sDate
        } else {
          values.startTime = undefined
          values.endTime = undefined
          delete values.sDate
        }
        console.log(values)
        this.$emit('change', values)
        this.handleCancel()
      }
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
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
</style>
