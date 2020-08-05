<template>
  <a-modal
    title="选择资质"
    :width="900"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-card :bordered="false" style="padding:0;">
      <!--搜索模块-->
      <div class="qualification-search-wrapper">
        <a-form layout="inline">
          <a-form-item label="资质类型">
            <a-select
              style="width:200px;"
              v-model.trim="queryParam.qualificationType"
              placeholder="请选择资质类型"
              default-value
              :allowClear="true"
            >
              <a-select-option
                v-for="qtype in qualificationTypes"
                :key="qtype.index"
                :value="qtype.id"
              >{{ qtype.text }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="资质名称">
            <a-input v-model.trim="queryParam.qualificationName" placeholder="根据名称模糊查询" :allowClear="true" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="searchAction">查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-layout>
        <!--  此处编写表单中的功能按钮    -->
        <a-layout-content>
          <s-table
            ref="table"
            size="small"
            rowKey="id"
            :columns="columns"
            :data="loadData"
            :alert="false"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
          </s-table>
        </a-layout-content>
      </a-layout>
    </a-card>
  </a-modal>
</template>

<script>
import { getQualificationList, delQualification, getQualificationType } from '@/api/qualification'
import { STable } from '@/components'

const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '类别',
    dataIndex: 'qualificationTypeText',
  },
  {
    title: '名称',
    dataIndex: 'qualificationName',
  },
]

export default {
  name: 'EnterpriseQualificationSelect',
  props: {
    toolType: {
      type: String,
      default: '0',
    },
  },
  components: { STable },
  data() {
    return {
      visible: false,
      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      qualificationTypes: [],
      pagination: {},
      // 表头
      columns: columns,
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        return getQualificationList(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res
          })
          .catch((error) => {
            this.loading = false
            console.error(error)
          })
      },
    }
  },
  created() {
    // 初始化钩子,获取所有产品类型
    this.queryParam = Object.assign({}, this.queryParam, { toolType: this.toolType })
    getQualificationType({ text: '资质类型' }).then((res) => {
      this.qualificationTypes = res.data
    })
  },
  methods: {
    query() {
      this.queryParam = Object.assign({},this.queryParam,{
        qualificationType:undefined,
        qualificationName:undefined
      })
      this.selectedRowKeys = []
      this.selectedRows = []
      this.visible = true

      this.searchAction()
    },
    searchAction(){
      this.$refs.table.refresh(true)
    },
    handleOk() {
      this.$emit('select', [...this.selectedRows])
      this.handleCancel()
    },
    handleCancel() {
      this.visible = false
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows =  [...new Set([...this.selectedRows,...selectedRows])] 
    },
  },
}
</script>
