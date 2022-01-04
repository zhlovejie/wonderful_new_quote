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
        <a-col :span="12">
          <a-form-item label="单据编号">
            <a-input v-decorator="['dealNum']" placeholder="单据编号" :allowClear="true" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="检验单据编号">
            <a-input v-decorator="['checkSerNum']" placeholder="检验单据编号" :allowClear="true" />
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
          <a-form-item label="检验人">
            <a-input v-decorator="['checkUserName']" placeholder="检验人" :allowClear="true" />
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item label="报检时间">
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
          values.checkBeginTime = values.sDate[0].format('YYYY-MM-DD')
          values.checkEndTime = values.sDate[1].format('YYYY-MM-DD')
          delete values.sDate
        } else {
          values.checkBeginTime = undefined
          values.checkEndTime = undefined
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
