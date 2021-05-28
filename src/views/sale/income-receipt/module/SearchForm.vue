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
          <a-form-item label="客户名称/个人名称">
            <a-input v-decorator="['customerName']" placeholder="客户名称/个人名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="进款单编号">
            <a-input v-decorator="['incomeNum']" placeholder="进款单编号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="收款银行">
            <a-select v-decorator="['accountId']" placeholder="选择收款银行" :allowClear="true">
              <a-select-option :key="item.id" v-for="item in moneyTypes" :value="item.id"
                >{{ item.unitName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="认领人">
            <a-input v-decorator="['claimUserName']" placeholder="认领人模糊查询" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="分类">
            <a-select v-decorator="['dicId']" placeholder="选择分类" :allowClear="true">
              <a-select-option :key="item.id" v-for="item in moneyCategorys" :value="item.id"
                >{{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="收款日期">
            <a-range-picker v-decorator="['dDate']" style="width: 100%" :allowClear="true" />
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
import { getAccountBankList } from '@/api/receipt'
import { getListByText } from '@/api/workBox'
export default {
  name: 'searchForm',
  components: {},
  data() {
    return {
      modalTitle: '高级筛选',
      visible: false,
      form: this.$form.createForm(this),
      saleUser: [],
      moneyCategorys: [],
      moneyTypes: [],
      isShowApproveStatus: false,
    }
  },
  methods: {
    query(tabKey) {
      this.isShowApproveStatus = +tabKey === 0
      this.visible = true
      getListSaleContractUser().then((res) => (this.saleUser = res.data))
      getAccountBankList().then((res) => (this.moneyTypes = res.data))
      getListByText({ text: '认领金额类型' }).then((res) => {
        this.moneyCategorys = res.data.records
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
        if (Array.isArray(values.dDate) && values.dDate.length === 2) {
          values.incomeBeginTime = values.dDate[0].format('YYYY-MM-DD')
          values.incomeEndTime = values.dDate[1].format('YYYY-MM-DD')
          delete values.dDate
        } else {
          values.incomeBeginTime = undefined
          values.incomeEndTime = undefined
          delete values.dDate
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
