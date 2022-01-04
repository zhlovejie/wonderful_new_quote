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
            <a-input v-decorator="['checkSerNum']" placeholder="单据编号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="紧急程度">
            <a-select v-decorator="['emergenceLevel']" placeholder="紧急程度" :allowClear="true">
              <a-select-option :value="1">一般</a-select-option>
              <a-select-option :value="2">紧急</a-select-option>
              <a-select-option :value="3">特急</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="入库申请单号">
            <a-input v-decorator="['warehouseEnterNum']" placeholder="入库申请单号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-item label="生产车间">
            <a-select placeholder="选择部门" v-decorator="['departmentId']" :allowClear="true">
              <a-select-option v-for="item in saleUser" :key="item.id" :value="item.id">{{
                item.departmentName
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col> -->
        <a-col :span="12">
          <a-form-item label="入库类型">
            <a-select v-decorator="['warehouseEnterType']" placeholder="入库类型" :allowClear="true">
              <a-select-option :value="1">赠送入库</a-select-option>
              <a-select-option :value="2">产成品返修入库</a-select-option>
              <a-select-option :value="3">安装不良品入库</a-select-option>
              <a-select-option :value="4">退货入库</a-select-option>
            </a-select>
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
          <a-form-item label="报检人">
            <a-input v-decorator="['reportName']" placeholder="报检人" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="需要入库仓库">
            <a-select v-decorator="['storageId']" placeholder="需要入库仓库" :allowClear="true">
              <a-select-option :value="1">1仓库</a-select-option>
              <a-select-option :value="2">2仓库</a-select-option>
            </a-select>
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
import { bonus_getDepartmentByType } from '@/api/bonus_management'
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
      bonus_getDepartmentByType({ type: 3 }).then((res) => (this.saleUser = res.data))
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
          values.reportBeginTime = values.sDate[0].format('YYYY-MM-DD')
          values.reportEndTime = values.sDate[1].format('YYYY-MM-DD')
          delete values.sDate
        } else {
          values.reportBeginTime = undefined
          values.reportEndTime = undefined
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
