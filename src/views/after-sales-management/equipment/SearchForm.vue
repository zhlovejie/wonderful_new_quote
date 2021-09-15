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
          <a-form-item label="机构">
            <a-select
              optionFilterProp="children"
              showSearch
              :allowClear="true"
              :filterOption="filterSalersOption"
              placeholder="机构名称"
              style="width: 100%"
              @change="handleChange"
              v-decorator="['orgId']"
            >
              <a-select-option v-for="item in NamePage" :value="item.orgId" :key="item.orgId">{{
                item.orgName
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="小区">
            <a-select
              optionFilterProp="children"
              showSearch
              :allowClear="true"
              :filterOption="filterSalersOption"
              placeholder="小区"
              style="width: 100%"
              v-decorator="['villageId']"
            >
              <a-select-option v-for="item in saleUser" :value="item.villageId" :key="item.villageId">{{
                item.villageName
              }}</a-select-option>
            </a-select>
            <!-- <a-input v-decorator="['customerName']" placeholder="客户名称" :allowClear="true" /> -->
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="SIM卡卡号">
            <a-input v-decorator="['cardNo']" placeholder="提交人" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="出厂日期">
            <a-range-picker v-decorator="['cDate']" style="width: 100%" :allowClear="true" />
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item label="SIM卡服务期限">
            <a-range-picker v-decorator="['sDate']" style="width: 100%" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="设备质保期限">
            <a-range-picker v-decorator="['dDate']" style="width: 100%" />
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
import { getOrgNamePage, getVillageNameList } from '@/api/after-sales-management' //机构名称
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
      NamePage: [],
    }
  },
  methods: {
    query(tabKey) {
      this.isShowApproveStatus = +tabKey === 0
      this.visible = true
      getOrgNamePage().then((res) => (this.NamePage = res.data))
    },
    handleCancel() {
      this.visible = false
    },
    handleChange(value) {
      this.saleUser = this.NamePage.find((i) => i.orgId === value).villageNameVoList || []
      if (!value) {
        return (this.saleUser = [])
      }
      getVillageNameList({ orgId: value }).then((res) => {
        this.saleUser = res.data
      })
    },
    actionHandler(type) {
      if (type === 'close') {
        this.handleCancel()
      } else if (type === 'reset') {
        this.form.resetFields()
      } else if (type === 'search') {
        let values = this.form.getFieldsValue()
        if (Array.isArray(values.sDate) && values.sDate.length === 2) {
          values.cardServicePeriodBeginDate = values.sDate[0].format('YYYY-MM-DD')
          values.cardServicePeriodEndDate = values.sDate[1].format('YYYY-MM-DD')
          delete values.sDate
        } else {
          values.cardServicePeriodBeginDate = undefined
          values.cardServicePeriodEndDate = undefined
          delete values.sDate
        }
        if (Array.isArray(values.dDate) && values.dDate.length === 2) {
          values.warrantyPeriodBeginDate = values.dDate[0].format('YYYY-MM-DD')
          values.warrantyPeriodEndDate = values.dDate[1].format('YYYY-MM-DD')
          delete values.dDate
        } else {
          values.warrantyPeriodBeginDate = undefined
          values.warrantyPeriodEndDate = undefined
          delete values.dDate
        }
        if (Array.isArray(values.cDate) && values.cDate.length === 2) {
          values.outBeginTime = values.cDate[0].format('YYYY-MM-DD')
          values.outEndTime = values.cDate[1].format('YYYY-MM-DD')
          delete values.cDate
        } else {
          values.outBeginTime = undefined
          values.outEndTime = undefined
          delete values.cDate
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
