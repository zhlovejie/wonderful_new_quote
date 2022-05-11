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
            <a-input v-decorator="['inspectionNo']" placeholder="单据编号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="委外加工单号">
            <a-input v-decorator="['orderNo']" placeholder="委外加工单号" :allowClear="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="加工商">
            <a-select placeholder="选择加工商" v-decorator="['facId']" :allowClear="true">
              <a-select-option v-for="item in materialList" :key="item.materialId" :value="item.materialId">{{
                `${item.materialName}(${item.materialCode})`
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="物料名称">
            <a-input v-decorator="['materialName']" placeholder="物料名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="物料代码">
            <a-input v-decorator="['materialCode']" placeholder="物料代码" :allowClear="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="报检人">
            <a-input v-decorator="['createdName']" placeholder="报检人" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="报检时间">
            <a-range-picker v-decorator="['createdTime']" style="width: 100%" :allowClear="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="检验人">
            <a-input v-decorator="['inspectionUserName']" placeholder="检验人" :allowClear="true" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="检验时间">
            <a-range-picker v-decorator="['inspectionTime']" style="width: 100%" :allowClear="true" />
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
import {
  exWarehouseApplyGetMaterial //条件检索-物料列表
} from '@/api/storage_wzz'

export default {
  name: 'searchForm',
  components: {},
  data() {
    return {
      modalTitle: '高级筛选',
      visible: false,
      form: this.$form.createForm(this),
      materialList: []
    }
  },
  methods: {
    query(tabKey) {
      this.visible = true
      exWarehouseApplyGetMaterial().then(res => (this.materialList = res.data))
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
        console.log(values);
        if (Array.isArray(values.createdTime) && values.createdTime.length === 2) {
          values.createdStartTime = values.createdTime[0].format('YYYY-MM-DD')
          values.createdEndTime = values.createdTime[1].format('YYYY-MM-DD')
          delete values.createdTime
        } else {
          values.createdStartTime = undefined
          values.createdEndTime = undefined
          delete values.createdTime
        }
        if (Array.isArray(values.inspectionTime) && values.inspectionTime.length === 2) {
          values.inspectionStartTime = values.inspectionTime[0].format('YYYY-MM-DD')
          values.inspectionEndTime = values.inspectionTime[1].format('YYYY-MM-DD')
          delete values.inspectionTime
        } else {
          values.inspectionStartTime = undefined
          values.inspectionEndTime = undefined
          delete values.inspectionTime
        }
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
</style>
