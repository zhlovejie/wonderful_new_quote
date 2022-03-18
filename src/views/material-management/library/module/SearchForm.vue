<template>
  <a-modal
    :title="modalTitle"
    :width="900"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-form :form="form" class="search-form-wrapper">
      <a-row :gutter="0">
        <a-col :span="24">基本信息</a-col>
        <a-col :span="12">
          <a-form-item label="物料代码">
            <a-input v-decorator="['materialCode']" placeholder="物料代码" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="中文名称">
            <a-input v-decorator="['materialName']" placeholder="中文名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="原K3物料代码">
            <a-input v-decorator="['k3Code']" placeholder="原K3物料代码" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="物料来源属性">
            <a-select v-decorator="['materialSource']" placeholder="物料来源属性">

              <a-select-option :value="1">自制</a-select-option>
                <a-select-option :value="2">通用外购</a-select-option>
                <a-select-option :value="4">定制外购</a-select-option>
                <a-select-option :value="3">委外加工</a-select-option>


              <!-- <a-select-option :value="1">自制</a-select-option>
              <a-select-option :value="2">外购</a-select-option>
              <a-select-option :value="3">委外</a-select-option> -->
              <!-- <a-select-option :value="4">标准件</a-select-option> -->
              <!-- <a-select-option :value="5">定制</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="使用计量单位">
            <a-select v-decorator="['subUnit']" placeholder="使用计量单位">
              <a-select-option
                v-for="item in materialUnitList"
                :key="item.text"
                :value="item.text"
              >
              {{item.text}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12" >
          <a-form-item label="审核">
            <a-select v-decorator="['auditStatus']" placeholder="审核状态">
              <a-select-option :value="1">未审核</a-select-option>
              <a-select-option :value="2">审核中</a-select-option>
              <a-select-option :value="3">已审核</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="录入人">
            <a-input v-decorator="['createdName']" placeholder="录入人" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="录入时间">
            <a-range-picker
              v-decorator="['sDate']"
               :show-time="{ format: 'HH:mm:ss' }"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="['开始时间', '结束时间']"
            />
          </a-form-item>
        </a-col>

        <a-col :span="24" >
          <a-form-item label="禁用">
            <a-radio-group
              v-decorator="['isForbidden']"
              style="width: 100%"
            >
              <a-radio :value="1">否</a-radio>
              <a-radio :value="2">是</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <template v-if="isNormal">
          <a-col :span="24">规格型号</a-col>
          <a-col :span="24">
              <SpecificationSearch ref="specificationSearch" :info="detail" @change="specificationSearchChange" />
          </a-col>
        </template>
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
import SpecificationSearch from './SpecificationSearch'
import { getDictionary } from '@/api/common'
import moment from 'moment'

export default {
  name: 'searchForm',
  components: {SpecificationSearch},
  data() {
    return {
      modalTitle: '高级筛选',
      visible: false,
      form: this.$form.createForm(this),
      detail:{},

      specification:undefined, //规格型号
      materialUnitList:[]
    }
  },
  computed:{
    isNormal(){
      return this.detail && this.detail.__from === 'normal'
    },
    isProduct(){
      return this.detail && this.detail.__from === 'product'
    }
  },
  methods: {
    query(record) {
      const that = this
      that.detail = { ...record }
      getDictionary({ text: '物料计量单位' }).then((res) => {
        that.materialUnitList = res.data
      })
      that.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    actionHandler(type) {
      if (type === 'close') {
        this.handleCancel()
      } else if (type === 'reset') {
        this.form.resetFields()
        this.specification = undefined
        this.$refs['specificationSearch'] && this.$refs['specificationSearch'].reset()
      } else if (type === 'search') {
        let values = this.form.getFieldsValue()
        values = {...values,specification:this.specification}

        let beginTime = undefined, endTime = undefined;
        if (Array.isArray(values.sDate) && values.sDate.length === 2) {
          beginTime = values.sDate[0] instanceof moment ? values.sDate[0].format('YYYY-MM-DD HH:mm:ss') : undefined
          endTime = values.sDate[1] instanceof moment ? values.sDate[1].format('YYYY-MM-DD HH:mm:ss') : undefined
        }
        values.startTime = beginTime
        values.endTime = endTime
        console.log(values)
        this.$emit('change', values)
        this.handleCancel()
      }
    },
    specificationSearchChange({specification}){
      this.specification = specification
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
</style>
