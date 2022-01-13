<template>
  <a-modal
    title="选择物料"
    :width="860"
    :confirmLoading="confirmLoading"
    :footer="null"
    v-model="visible"
    :maskClosable="false"
  >
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item label="物料代码">
          <a-input style="width: 130px; margin-right: 10px" class="modal-input" v-model="queryParam.materialCode" />
        </a-form-item>
        <a-form-item label="物料名称">
          <a-input style="width: 130px; margin-right: 10px" class="modal-input" v-model="queryParam.materialName" />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-spin :spinning="confirmLoading" class="marg-t16">
      <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false" rowKey="id">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <span slot="materialCode" slot-scope="text, record">
          <a @click="clickVue(record)">{{ text }}</a>
        </span>
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { inventorygetMoveMaterialList } from '@/api/storage'

export default {
  name: 'MaterialSelect',
  components: {
    STable,
  },
  data() {
    return {
      first: false,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      mdl: {},
      queryParam: {},
      customerName: '',
      loading: true,
      saleUsers: [],
      productName: '',
      productType: 0,
      seriesFlag: '',
      userId: 0,
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '物料代码',
          dataIndex: 'materialCode',
          width: 180,
          scopedSlots: { customRender: 'materialCode' },
        },
        {
          title: '物料名称',
          width: 180,
          dataIndex: 'materialName',
        },
        {
          title: '仓位代码',
          dataIndex: 'positionCode',
          key: 'positionCode',
          // scopedSlots: { customRender: 'shelvesLocationName' },
        },
      ],
      loadData: (parameter) => {
        console.log('---------开始加载列表数据' + JSON.stringify(this.queryParam))
        return inventorygetMoveMaterialList(Object.assign(parameter, this.queryParam)).then((res) => {
          console.log('res===', res)
          return res
        })
      },
      recordParam: null,
    }
  },
  methods: {
    query(record) {
      this.recordParam = record
      this.visible = true
      this.search()
    },
    search() {
      this.$refs.table && this.$refs.table.refresh(true)
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    clickVue(data) {
      this.$emit('custom-change', {
        selectItem: data, //用户选择项目
        recordParam: this.recordParam, //父页面传过来的项目
      })
      this.close()
    },
  },
}
</script>

<style lang="less" scoped>
.marg-t16 {
  margin-top: 16px;
}
.modal-input {
  width: 100px;
}
</style>
