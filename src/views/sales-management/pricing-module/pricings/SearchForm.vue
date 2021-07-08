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
            <a-input v-decorator="['customerName']" placeholder="客户名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="销售经理">
            <a-select placeholder="销售经理" v-decorator="['saleUserId']">
              <a-select-option v-for="salesman in allSalesman" :key="salesman.id" :value="salesman.userId">{{
                salesman.salesmanName
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="提交人">
            <a-input v-decorator="['createName']" placeholder="提交人" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="核价编号">
            <a-input v-decorator="['valencyCode']" placeholder="核价编号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="单据状态">
            <a-select v-decorator="['approveStatus', { initialValue: -1 }]" placeholder="单据状态">
              <a-select-option :value="-1">请选择审批状态</a-select-option>
              <a-select-option :value="0">待接收</a-select-option>
              <a-select-option :value="1">已接收待核价</a-select-option>
              <a-select-option :value="2">驳回</a-select-option>
              <a-select-option :value="3">核价通过</a-select-option>
              <a-select-option :value="4">待生成代码</a-select-option>
              <a-select-option :value="5">代码已生成</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="提交时间">
            <a-range-picker v-decorator="['sDate']" style="width: 100%" :allowClear="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="0">
        <a-col :span="24">核价信息</a-col>
        <a-col :span="12">
          <a-form-item label="产品名称">
            <a-input v-decorator="['productName']" placeholder="产品名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="规格型号">
            <a-input v-decorator="['valencySpecs']" placeholder="规格型号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="产品代码">
            <a-input v-decorator="['newBasisModel']" placeholder="产品代码" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="依据产品名称">
            <a-input v-decorator="['toolProductName']" placeholder="依据产品名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="依据规格型号">
            <a-input v-decorator="['toolProductStandard']" placeholder="依据规格型号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="依据产品代码">
            <a-input v-decorator="['toolProductModel']" placeholder="依据产品代码" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="需求日期">
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
import { salesJurisdiction } from '@/api/customer'
export default {
  name: 'searchForm',
  components: {},
  data() {
    return {
      modalTitle: '高级筛选',
      visible: false,
      form: this.$form.createForm(this),
      allSalesman: {},
    }
  },
  methods: {
    query() {
      let that = this
      that.visible = true
      that.$nextTick(() => {
        salesJurisdiction().then((res) => {
          // 当前用户的销售权限
          var salesJurisdiction = res.data
          this.salesJurisdiction = salesJurisdiction
          if (salesJurisdiction.top) {
            // 最高权限才可以查看所有销售人员的客户
            this.allSalesman = salesJurisdiction.allSalesman
          }
          if (salesJurisdiction.leader || salesJurisdiction.assistant) {
            this.allSalesman = salesJurisdiction.subSalesman
          }
        })
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
        if (Array.isArray(values.sDate) && values.sDate.length === 2) {
          values.startTime = values.sDate[0].format('YYYY-MM-DD')
          values.endTime = values.sDate[1].format('YYYY-MM-DD')
          delete values.sDate
        } else {
          values.startTime = undefined
          values.endTime = undefined
          delete values.sDate
        }
        if (Array.isArray(values.dDate) && values.dDate.length === 2) {
          values.startDemandTime = values.dDate[0].format('YYYY-MM-DD')
          values.endDemandTime = values.dDate[1].format('YYYY-MM-DD')
          delete values.dDate
        } else {
          values.startDemandTime = undefined
          values.endDemandTime = undefined
          delete values.dDate
        }
        console.log(values)
        this.$emit('change', values)
        this.handleCancel()
      }
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
  padding-left: 20px;
}
</style>